"""
Entry point for SPACE LEGACY data-integration pipeline.

CLI interface to seed PostgreSQL database with structured bulk data from data-processing.
Supports full seeding, dry-run validation, SQL script export, table targeting, and spacecraft filtering.
"""

import argparse
import json
import logging
from pathlib import Path
import sys

from config import (
    INPUT_FOLDER,
    OUTPUT_FOLDER,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    BATCH_SIZE,
    ON_CONFLICT_ACTION,
    get_connection_params,
)
from database import DatabaseManager
from seeder import run_seed, load_all_spacecraft_data, deduplicate_records, generate_sql_script


def setup_logging(verbose: bool = False) -> None:
    """Configure console logging format."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="[%(asctime)s] %(levelname)-7s [%(name)s] %(message)s",
        datefmt="%H:%M:%S",
    )


def print_summary_table(report: dict) -> None:
    """Print an aligned ASCII summary table of the integration results."""
    print("\n" + "=" * 80)
    print("                    SPACE LEGACY DATA INTEGRATION SUMMARY")
    print("=" * 80)
    print(f"Status:            {report.get('status')}")
    print(f"Dry Run:           {report.get('dryRun')}")
    print(f"Total Records:     {report.get('totalRecords', 0)}")
    print(f"Total Inserted:    {report.get('totalInserted', 0)}")
    if report.get("sqlGenerated"):
        print(f"Generated SQL:     {report.get('sqlGenerated')}")
    print("-" * 80)
    print(f"{'Database Table':<24} | {'Prisma Model':<20} | {'Records':<8} | {'Status'}")
    print("-" * 80)

    tables = report.get("tables", {})
    for tbl, info in tables.items():
        model = info.get("model", "")
        recs = info.get("records", 0)
        status = info.get("status", "N/A")
        print(f"{tbl:<24} | {model:<20} | {recs:<8} | {status}")

    print("=" * 80)
    if report.get("errors"):
        print("\nERRORS ENCOUNTERED:")
        for err in report["errors"]:
            print(f"  * {err}")
        print("=" * 80)


def main() -> int:
    """Parse CLI arguments and run data-integration workflow."""
    parser = argparse.ArgumentParser(
        description="SPACE LEGACY - Data Integration Seeder Pipeline",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate loading, deduplication, and verification without writing to database",
    )
    parser.add_argument(
        "--sql-only",
        action="store_true",
        help="Generate standalone seed.sql export file and exit without database connection",
    )
    parser.add_argument(
        "--zone",
        nargs="+",
        default=None,
        help="Filter by spatial zone(s), e.g. MOON MARS DEEP_SPACE ASTEROIDS",
    )
    parser.add_argument(
        "--spacecraft",
        type=str,
        default=None,
        help="Process only a specific spacecraft folder (e.g. 'pioneer-10', 'apollo-11')",
    )
    parser.add_argument(
        "--table",
        type=str,
        default=None,
        help="Target only a specific table or model (e.g. 'missions', 'Equipment')",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=BATCH_SIZE,
        help="Batch size for PostgreSQL execute_values bulk insertion",
    )
    parser.add_argument(
        "--on-conflict",
        type=str,
        default=ON_CONFLICT_ACTION,
        choices=["DO NOTHING", "DO UPDATE"],
        help="PostgreSQL conflict resolution behavior",
    )
    parser.add_argument(
        "--input-dir",
        type=str,
        default=str(INPUT_FOLDER),
        help="Directory containing spacecraft processed results",
    )
    parser.add_argument(
        "--output-sql",
        type=str,
        default=str(OUTPUT_FOLDER / "seed.sql"),
        help="File path to write standalone seed.sql export",
    )
    parser.add_argument(
        "--host",
        type=str,
        default=None,
        help="Override database host",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=None,
        help="Override database port",
    )
    parser.add_argument(
        "--dbname",
        type=str,
        default=None,
        help="Override database name",
    )
    parser.add_argument(
        "--user",
        type=str,
        default=None,
        help="Override database user",
    )
    parser.add_argument(
        "--password",
        type=str,
        default=None,
        help="Override database password",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable debug logging",
    )

    args = parser.parse_args()
    setup_logging(args.verbose)

    input_path = Path(args.input_dir)
    sql_path = Path(args.output_sql)

    active_zones = [z.upper() for z in args.zone] if args.zone else None

    # 1. SQL-only generation mode
    if args.sql_only:
        logging.info("Running in --sql-only mode. Loading data from %s...", input_path)
        if active_zones:
            logging.info("Filtered by spatial zones: %s", ", ".join(active_zones))
        raw_data = load_all_spacecraft_data(input_path, target_spacecraft=args.spacecraft, zones=active_zones)
        deduped = deduplicate_records(raw_data)
        counts = generate_sql_script(
            deduped_data=deduped,
            output_path=sql_path,
            on_conflict=args.on_conflict,
        )
        total_records = sum(counts.values())
        print(f"\n[OK] Successfully generated standalone SQL seed file: {sql_path}")
        print(f"     Total unique records exported: {total_records}")
        print(f"     Execute with: psql -U <user> -d <dbname> -f \"{sql_path}\"")
        return 0

    # 2. Configure connection parameters
    conn_params = get_connection_params()
    if args.host:
        conn_params["host"] = args.host
    if args.port:
        conn_params["port"] = args.port
    if args.dbname:
        conn_params["dbname"] = args.dbname
    if args.user:
        conn_params["user"] = args.user
    if args.password:
        conn_params["password"] = args.password

    db_mgr = DatabaseManager(conn_params)

    # 3. Run seeding (or dry run)
    report = run_seed(
        db_manager=db_mgr,
        input_dir=input_path,
        target_spacecraft=args.spacecraft,
        target_table=args.table,
        zones=active_zones,
        batch_size=args.batch_size,
        on_conflict=args.on_conflict,
        dry_run=args.dry_run,
        generate_sql=True,
        sql_output_path=sql_path,
    )

    print_summary_table(report)

    db_mgr.close()
    return 0 if report.get("status") in ("SUCCESS", "COMPLETED_DRY_RUN") else 1


if __name__ == "__main__":
    sys.exit(main())
