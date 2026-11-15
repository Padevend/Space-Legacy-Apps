#!/usr/bin/env python3
"""
SPACE LEGACY - Master Pipeline Runner
2026 NASA Space Apps Challenge

Orchestrates the entire end-to-end data pipeline with 100% deterministic reproducibility:
1. data-processing: Reads crawled JSON data, extracts verified hardware/mission data,
   cleans markdown text, generates images.json, and produces spacecraft_bulk.json.
2. data-integration: Deduplicates entities across spacecraft, enforces topological
   foreign key constraints, generates seed.sql, and executes bulk database seeding.

Usage
-----
    # Run full pipeline for priority zones (Moon & Mars):
    python3 run_pipeline.py --zone MOON MARS

    # Target a single spacecraft:
    python3 run_pipeline.py --target apollo-lunar-modules

    # Generate standalone SQL seed file (no DB needed):
    python3 run_pipeline.py --sql-only

    # Dry-run validation of the entire pipeline:
    python3 run_pipeline.py --dry-run
"""

import argparse
import logging
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone

# Ensure project root is in sys.path
_ROOT = Path(__file__).parent.resolve()
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

import global_config
from global_config import (
    CHALLENGE_NAME,
    CHALLENGE_TITLE,
    PRIORITY_ZONES,
    ALL_ZONES,
    get_active_equipment_slugs,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("space-legacy-master")


def print_banner(zones: list[str], targets: list[str], dry_run: bool, sql_only: bool):
    """Print master pipeline banner."""
    print("=" * 80)
    print(f"             {CHALLENGE_NAME}")
    print(f"             {CHALLENGE_TITLE}")
    print("=" * 80)
    now_str = datetime.now(timezone.utc).isoformat()
    print(f"Timestamp:       {now_str}")
    print(f"Target Zones:    {', '.join(zones) if zones else 'ALL'}")
    print(f"Target Objects:  {', '.join(targets) if targets else 'ALL IN ZONES'}")
    print(f"Mode:            {'SQL Export Only' if sql_only else ('Dry Run Simulation' if dry_run else 'Live Seeding')}")
    print(f"Reproducibility: Deterministic (Seed: {global_config.RANDOM_SEED}, Namespace: UUID v5)")
    print("=" * 80)


def run_stage_processing(zones: list[str] | None, targets: list[str] | None) -> bool:
    """Execute Stage 2: data-processing via isolated Python subprocess."""
    log.info(">>> STAGE 2: STARTING DATA PROCESSING >>>")
    cmd = [sys.executable, str(global_config.PROCESSING_DIR / "main.py")]
    if zones:
        cmd.extend(["--zone"] + zones)
    if targets:
        cmd.extend(["--target"] + targets)

    result = subprocess.run(cmd)
    return result.returncode == 0


def run_stage_integration(
    zones: list[str] | None,
    targets: list[str] | None,
    dry_run: bool = False,
    sql_only: bool = False,
    table: str | None = None,
) -> bool:
    """Execute Stage 3: data-integration via isolated Python subprocess."""
    log.info(">>> STAGE 3: STARTING DATA INTEGRATION >>>")
    cmd = [sys.executable, str(global_config.INTEGRATION_DIR / "main.py")]
    if sql_only:
        cmd.append("--sql-only")
    elif dry_run:
        cmd.append("--dry-run")
    if zones:
        cmd.extend(["--zone"] + zones)
    if targets and len(targets) == 1:
        cmd.extend(["--spacecraft", targets[0]])
    if table:
        cmd.extend(["--table", table])

    result = subprocess.run(cmd)
    return result.returncode == 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="SPACE LEGACY - Master Pipeline Runner",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--zone",
        nargs="+",
        default=PRIORITY_ZONES,
        help="Spatial zones to include (e.g. MOON MARS DEEP_SPACE ASTEROIDS)",
    )
    parser.add_argument(
        "--target",
        nargs="+",
        default=None,
        help="Specific spacecraft slug(s) to process",
    )
    parser.add_argument(
        "--stage",
        choices=["all", "processing", "integration"],
        default="all",
        help="Pipeline stage to execute",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate full pipeline without writing to database",
    )
    parser.add_argument(
        "--sql-only",
        action="store_true",
        help="Run processing and export standalone results/seed.sql",
    )
    parser.add_argument(
        "--table",
        type=str,
        default=None,
        help="Target a specific database table",
    )

    args = parser.parse_args()

    selected_zones = [z.upper() for z in args.zone] if args.zone else PRIORITY_ZONES
    selected_targets = args.target if args.target else []

    print_banner(
        zones=selected_zones,
        targets=selected_targets,
        dry_run=args.dry_run,
        sql_only=args.sql_only,
    )

    active_slugs = get_active_equipment_slugs(zones=selected_zones, targets=selected_targets)
    log.info("Active spacecraft to process (%d): %s", len(active_slugs), ", ".join(active_slugs))

    if not active_slugs:
        log.warning("No spacecraft matched the given filters. Exiting.")
        return 0

    # 1. Stage: data-processing
    if args.stage in ("all", "processing"):
        ok = run_stage_processing(zones=selected_zones, targets=selected_targets)
        if not ok:
            log.error("Stage 2 (data-processing) failed. Aborting pipeline.")
            return 1

    # 2. Stage: data-integration
    if args.stage in ("all", "integration"):
        ok = run_stage_integration(
            zones=selected_zones,
            targets=selected_targets,
            dry_run=args.dry_run,
            sql_only=args.sql_only,
            table=args.table,
        )
        if not ok:
            log.error("Stage 3 (data-integration) failed.")
            return 1

    print("\n" + "=" * 80)
    print("           SPACE LEGACY PIPELINE EXECUTION COMPLETED SUCCESSFULLY")
    print("=" * 80)
    print(f"Processed Objects: {len(active_slugs)}")
    print(f"SQL Export:        {global_config.SEED_SQL_PATH}")
    print("=" * 80 + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
