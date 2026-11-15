"""
Bulk seeder for SPACE LEGACY data-integration pipeline.

Orchestrates loading structured machine data from data-processing,
deduplicating across spacecraft by primary keys (id), ordering by topological
foreign-key dependencies (Level 0 to Level 3), generating standalone SQL scripts (seed.sql),
and performing high-performance bulk inserts into PostgreSQL with conflict resolution.
"""

from collections import OrderedDict
from datetime import datetime
import json
import logging
from pathlib import Path
from typing import Any
import sys
import os

# Ensure data-processing is available for knowledge_base if needed
_PROCESSING_DIR = Path(__file__).parent.parent / "data-processing"
if str(_PROCESSING_DIR) not in sys.path:
    sys.path.insert(0, str(_PROCESSING_DIR))

from knowledge_base import get_all_celestial_bodies, MACHINES_METADATA
from utils.ids import make_id

# Deterministic machine UUID -> slug mapping for dynamic foreign key resolutions
ID_TO_MACHINE_SLUG: dict[str, str] = {
    make_id("machine", slug): slug for slug in MACHINES_METADATA
}

from config import (
    INPUT_FOLDER,
    OUTPUT_FOLDER,
    BATCH_SIZE,
    ON_CONFLICT_ACTION,
    TARGET_ZONES,
    TARGET_SPACECRAFT,
    is_equipment_active,
)
from database import DatabaseManager
from schema_meta import (
    MODEL_TABLE_MAP,
    MODEL_PK_MAP,
    TABLE_ORDER,
    serialize_value,
    format_sql_literal,
)

log = logging.getLogger("data-integration.seeder")


def load_all_spacecraft_data(
    input_dir: Path = INPUT_FOLDER,
    target_spacecraft: str | None = None,
    zones: list[str] | None = None,
) -> dict[str, list[dict[str, Any]]]:
    """
    Load data from spacecraft_bulk.json files across results directories.

    Parameters
    ----------
    input_dir:
        Root path to data-processing results (e.g. data-processing/results).
    target_spacecraft:
        Optional slug of a specific spacecraft to load (e.g. 'apollo-lunar-modules').
    zones:
        Optional spatial zones filter (e.g. ['MOON', 'MARS']).

    Returns
    -------
    dict[str, list[dict]]
        Aggregated records mapped by Prisma model name.
    """
    aggregated: dict[str, list[dict[str, Any]]] = {m: [] for m in TABLE_ORDER}
    search_dirs: list[Path] = []

    # Always seed the 5 canonical celestial bodies
    canonical_bodies = get_all_celestial_bodies()
    aggregated["CelestialBody"].extend(canonical_bodies)

    if not input_dir.exists():
        log.error("Input folder does not exist: %s", input_dir)
        return aggregated

    active_zones = zones or TARGET_ZONES
    active_targets = [target_spacecraft] if target_spacecraft else None

    # Filter directories matching target and zones
    for p in sorted(input_dir.iterdir()):
        if not p.is_dir():
            continue
        if is_equipment_active(p.name, zones=active_zones, targets=active_targets):
            search_dirs.append(p)

    total_files = 0
    for s_dir in search_dirs:
        bulk_file = s_dir / "spacecraft_bulk.json"
        if not bulk_file.exists():
            continue
        try:
            with open(bulk_file, "r", encoding="utf-8") as f:
                payload = json.load(f)
            data_map = payload.get("data", {})
            for model_name, recs in data_map.items():
                if recs and isinstance(recs, list) and model_name in aggregated:
                    aggregated[model_name].extend(recs)
            total_files += 1
        except Exception as exc:
            log.warning("Could not read bulk file %s: %s", bulk_file, exc)

    log.info("Loaded bulk data from %d spacecraft files.", total_files)
    return aggregated


def deduplicate_records(
    aggregated: dict[str, list[dict[str, Any]]]
) -> dict[str, list[dict[str, Any]]]:
    """
    Deduplicate records per model based on primary keys defined in MODEL_PK_MAP.

    Preserves first-seen order while discarding duplicate entries generated
    by overlapping spacecraft contexts (e.g., shared celestial bodies).
    """
    deduped: dict[str, list[dict[str, Any]]] = {}

    for model_name, records in aggregated.items():
        if not records:
            deduped[model_name] = []
            continue

        pk_fields = MODEL_PK_MAP.get(model_name, ["id"])
        seen_keys: set[tuple] = set()
        unique_records: list[dict[str, Any]] = []

        for rec in records:
            key = tuple(rec.get(pk) for pk in pk_fields)
            if key not in seen_keys:
                seen_keys.add(key)
                unique_records.append(rec)

        if model_name == "CelestialBody":
            unique_records.sort(key=lambda r: r.get("sortOrder", 0))
        elif model_name == "Machine":
            unique_records.sort(key=lambda r: r.get("name", ""))
        elif model_name in ("MachineFact", "MachineEvent", "MachineImage"):
            unique_records.sort(key=lambda r: (r.get("machineId", ""), r.get("sortOrder", 0)))

        deduped[model_name] = unique_records
        log.debug(
            "Model %s: %d total records -> %d unique records",
            model_name,
            len(records),
            len(unique_records),
        )

    return deduped


def prepare_table_data(
    model_name: str, records: list[dict[str, Any]]
) -> tuple[list[str], list[list[Any]]]:
    """
    Extract a uniform column list and row values for psycopg2 execution.

    Parameters
    ----------
    model_name:
        Prisma model name.
    records:
        List of deduplicated records for this model.

    Returns
    -------
    tuple[list[str], list[list[Any]]]
        (columns, list of row values)
    """
    if not records:
        return [], []

    pk_fields = MODEL_PK_MAP.get(model_name, [])
    # Collect all distinct column names across all records
    all_cols: OrderedDict[str, None] = OrderedDict()
    # Ensure PKs are listed first
    for pk in pk_fields:
        all_cols[pk] = None
    for rec in records:
        for k in rec.keys():
            all_cols[k] = None

    columns = list(all_cols.keys())

    # Build rows
    rows: list[list[Any]] = []
    for rec in records:
        row = [serialize_value(rec.get(col)) for col in columns]
        rows.append(row)

    return columns, rows


def generate_sql_script(
    deduped_data: dict[str, list[dict[str, Any]]],
    output_path: Path,
    on_conflict: str = ON_CONFLICT_ACTION,
    chunk_size: int = 100,
) -> dict[str, int]:
    """
    Generate a standalone, self-contained seed.sql script for direct psql seeding.

    Parameters
    ----------
    deduped_data:
        Deduplicated records mapped by Prisma model name.
    output_path:
        Destination file path for seed.sql.
    on_conflict:
        'DO NOTHING' or 'DO UPDATE'.
    chunk_size:
        Number of records per multi-row INSERT statement.

    Returns
    -------
    dict[str, int]
        Number of records exported per model.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    counts: dict[str, int] = {}
    now_iso = datetime.utcnow().isoformat() + "Z"

    with open(output_path, "w", encoding="utf-8") as f:
        # File header
        f.write("-- =====================================================================\n")
        f.write("-- SPACE LEGACY - Database Seeder Script (schema.prisma v2.0)\n")
        f.write(f"-- Generated At: {now_iso}\n")
        f.write(f"-- Conflict Resolution: {on_conflict}\n")
        f.write("-- Topological Order: CelestialBody -> Machine -> Source/Image -> Fact/Event\n")
        f.write("-- =====================================================================\n\n")
        f.write("BEGIN;\n\n")
        f.write("SET client_encoding = 'UTF8';\n")
        f.write("SET standard_conforming_strings = on;\n\n")

        for model_name in TABLE_ORDER:
            records = deduped_data.get(model_name, [])
            if not records:
                counts[model_name] = 0
                continue

            table_name = MODEL_TABLE_MAP[model_name]
            pk_fields = MODEL_PK_MAP.get(model_name, [])

            # Get uniform columns
            columns, _ = prepare_table_data(model_name, records)
            cols_sql = ", ".join(f'"{c}"' for c in columns)

            # Build conflict clause
            if pk_fields:
                pk_sql = ", ".join(f'"{pk}"' for pk in pk_fields)
                if on_conflict == "DO UPDATE":
                    update_cols = [c for c in columns if c not in pk_fields]
                    if update_cols:
                        updates = ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
                        conflict_clause = f"ON CONFLICT ({pk_sql}) DO UPDATE SET {updates}"
                    else:
                        conflict_clause = f"ON CONFLICT ({pk_sql}) DO NOTHING"
                else:
                    conflict_clause = f"ON CONFLICT ({pk_sql}) DO NOTHING"
            else:
                conflict_clause = ""

            f.write(f"-- -----------------------------------------------------------------\n")
            f.write(f"-- Table: {table_name} (Model: {model_name}) - {len(records)} records\n")
            f.write(f"-- -----------------------------------------------------------------\n")

            # Write multi-row INSERTs in chunks
            for i in range(0, len(records), chunk_size):
                chunk = records[i : i + chunk_size]
                row_clauses: list[str] = []
                for rec in chunk:
                    row_vals: list[str] = []
                    for c in columns:
                        if model_name == "Machine" and c == "bodyId":
                            body_slug = MACHINES_METADATA.get(rec.get("slug", ""), {}).get("bodySlug")
                            if body_slug:
                                row_vals.append(f'(SELECT "id" FROM "celestial_bodies" WHERE "slug" = \'{body_slug}\' LIMIT 1)')
                            else:
                                row_vals.append(format_sql_literal(rec.get(c)))
                        elif model_name in ("MachineSource", "MachineImage", "MachineFact", "MachineEvent") and c == "machineId":
                            raw_mid = rec.get("machineId")
                            m_slug = ID_TO_MACHINE_SLUG.get(raw_mid)
                            if m_slug:
                                row_vals.append(f'(SELECT "id" FROM "machines" WHERE "slug" = \'{m_slug}\' LIMIT 1)')
                            else:
                                row_vals.append(format_sql_literal(rec.get(c)))
                        else:
                            row_vals.append(format_sql_literal(rec.get(c)))
                    row_clauses.append(f"  ({', '.join(row_vals)})")

                values_sql = ",\n".join(row_clauses)
                if conflict_clause:
                    f.write(
                        f'INSERT INTO "{table_name}" ({cols_sql})\nVALUES\n{values_sql}\n{conflict_clause};\n\n'
                    )
                else:
                    f.write(
                        f'INSERT INTO "{table_name}" ({cols_sql})\nVALUES\n{values_sql};\n\n'
                    )

            counts[model_name] = len(records)

        f.write("COMMIT;\n")

    log.info("Successfully generated SQL script at %s", output_path)
    return counts


def run_seed(
    db_manager: DatabaseManager,
    input_dir: Path = INPUT_FOLDER,
    target_spacecraft: str | None = None,
    target_table: str | None = None,
    zones: list[str] | None = None,
    batch_size: int = BATCH_SIZE,
    on_conflict: str = ON_CONFLICT_ACTION,
    dry_run: bool = False,
    generate_sql: bool = True,
    sql_output_path: Path | None = None,
) -> dict[str, Any]:
    """
    Execute targeted bulk seeding across tables in topological dependency order.

    Parameters
    ----------
    db_manager:
        DatabaseManager instance for PostgreSQL connection.
    input_dir:
        Directory containing data-processing spacecraft outputs.
    target_spacecraft:
        Optional spacecraft slug filter.
    target_table:
        Optional table name or model name filter.
    zones:
        Optional spatial zones filter.
    batch_size:
        Rows per bulk insert batch.
    on_conflict:
        'DO NOTHING' or 'DO UPDATE'.
    dry_run:
        If True, validate data and simulate without modifying database.
    generate_sql:
        If True, also write out the clean seed.sql export file.
    sql_output_path:
        Optional custom path for seed.sql (defaults to results/seed.sql).

    Returns
    -------
    dict[str, Any]
        Summary report containing record counts, statuses, and execution details.
    """
    start_time = datetime.utcnow()
    report: dict[str, Any] = {
        "status": "STARTED",
        "dryRun": dry_run,
        "startTime": start_time.isoformat() + "Z",
        "tables": {},
        "totalRecords": 0,
        "totalInserted": 0,
        "sqlGenerated": None,
        "errors": [],
    }

    # Step 1: Load and aggregate data
    log.info("Reading processed data from %s...", input_dir)
    raw_aggregated = load_all_spacecraft_data(input_dir, target_spacecraft, zones=zones)
    deduped = deduplicate_records(raw_aggregated)

    total_records = sum(len(recs) for recs in deduped.values())
    report["totalRecords"] = total_records
    log.info("Total unique records across all models: %d", total_records)

    # Step 2: Generate standalone SQL script if requested
    if generate_sql:
        sql_path = sql_output_path or (OUTPUT_FOLDER / "seed.sql")
        try:
            sql_counts = generate_sql_script(deduped, sql_path, on_conflict=on_conflict)
            report["sqlGenerated"] = str(sql_path)
            log.info("SQL seed script generated at %s", sql_path)
        except Exception as exc:
            err_msg = f"Failed to generate SQL seed script: {exc}"
            log.error(err_msg)
            report["errors"].append(err_msg)

    # If dry_run, complete here
    if dry_run:
        for model in TABLE_ORDER:
            recs = deduped.get(model, [])
            tbl = MODEL_TABLE_MAP[model]
            report["tables"][tbl] = {
                "model": model,
                "records": len(recs),
                "status": "DRY_RUN_VALIDATED",
            }
        report["status"] = "COMPLETED_DRY_RUN"
        report["endTime"] = datetime.utcnow().isoformat() + "Z"
        return report

    # Step 3: Connect to Database
    connected, conn_msg = db_manager.test_connection()
    if not connected:
        report["status"] = "DB_CONNECTION_FAILED"
        report["errors"].append(conn_msg)
        log.error("Database connection failed: %s", conn_msg)
        return report

    log.info("Database connection established: %s", conn_msg)

    # Check available public tables
    try:
        existing_tables = db_manager.get_existing_tables()
    except Exception as exc:
        report["status"] = "TABLE_CHECK_FAILED"
        report["errors"].append(str(exc))
        return report

    # Filter by target_table if given
    filter_tbl = None
    if target_table:
        for m, t in MODEL_TABLE_MAP.items():
            if target_table in (m, t, m.lower(), t.lower()):
                filter_tbl = t
                break

    # Step 4: Execute bulk inserts in topological order
    total_affected = 0
    for model_name in TABLE_ORDER:
        tbl_name = MODEL_TABLE_MAP[model_name]
        records = deduped.get(model_name, [])

        if filter_tbl and tbl_name != filter_tbl:
            continue

        if tbl_name not in existing_tables:
            log.warning("Table '%s' does not exist in target database. Skipping.", tbl_name)
            report["tables"][tbl_name] = {
                "model": model_name,
                "records": len(records),
                "status": "TABLE_NOT_FOUND",
            }
            continue

        if not records:
            report["tables"][tbl_name] = {
                "model": model_name,
                "records": 0,
                "status": "SKIPPED_EMPTY",
            }
            continue

        # Pre-resolve foreign keys from existing database rows to prevent FK constraint violations
        if model_name == "Machine":
            try:
                with db_manager.connect().cursor() as cur:
                    cur.execute('SELECT slug, id FROM celestial_bodies;')
                    body_map = dict(cur.fetchall())
                for rec in records:
                    bslug = MACHINES_METADATA.get(rec.get("slug", ""), {}).get("bodySlug")
                    if bslug and bslug in body_map:
                        rec["bodyId"] = str(body_map[bslug])
            except Exception as e:
                log.warning("Could not pre-resolve bodyId from DB: %s", e)
        elif model_name in ("MachineSource", "MachineImage", "MachineFact", "MachineEvent"):
            try:
                with db_manager.connect().cursor() as cur:
                    cur.execute('SELECT slug, id FROM machines;')
                    mach_map = dict(cur.fetchall())
                for rec in records:
                    mslug = ID_TO_MACHINE_SLUG.get(rec.get("machineId"))
                    if mslug and mslug in mach_map:
                        rec["machineId"] = str(mach_map[mslug])
            except Exception as e:
                log.warning("Could not pre-resolve machineId from DB: %s", e)

        columns, rows = prepare_table_data(model_name, records)
        pk_fields = MODEL_PK_MAP.get(model_name, [])

        try:
            affected = db_manager.bulk_insert(
                table_name=tbl_name,
                columns=columns,
                rows=rows,
                conflict_columns=pk_fields,
                on_conflict=on_conflict,
                batch_size=batch_size,
            )
            total_affected += affected
            report["tables"][tbl_name] = {
                "model": model_name,
                "records": len(records),
                "affected": affected,
                "status": "SEEDED",
            }
            log.info("Seeded %d records into %s.", len(records), tbl_name)
        except Exception as exc:
            err_msg = f"Failed to seed table '{tbl_name}': {exc}"
            log.error(err_msg)
            report["errors"].append(err_msg)
            report["tables"][tbl_name] = {
                "model": model_name,
                "records": len(records),
                "status": "FAILED",
                "error": str(exc),
            }

    report["totalInserted"] = total_affected
    report["status"] = "COMPLETED" if not report["errors"] else "COMPLETED_WITH_ERRORS"
    report["endTime"] = datetime.utcnow().isoformat() + "Z"
    return report
