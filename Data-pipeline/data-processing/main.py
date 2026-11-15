#!/usr/bin/env python3
"""
Main entry point for the data-processing pipeline.

Usage
-----
    python data-processing/main.py

Discovers all JSON files in INPUT_FOLDER, processes each spacecraft,
cleans markdown content, catalogs images into images.json, validates
the output against the Prisma schema, writes results to OUTPUT_FOLDER,
and prints an execution summary.
"""

import json
import logging
import sys
import os
import traceback
from pathlib import Path

# ---------------------------------------------------------------------------
# Ensure the data-processing directory is on the import path
# ---------------------------------------------------------------------------
_THIS_DIR = Path(__file__).parent.resolve()
sys.path.insert(0, str(_THIS_DIR))

from config import (
    INPUT_FOLDER,
    OUTPUT_FOLDER,
    SCHEMA_VERSION,
    TARGET_ZONES,
    TARGET_SPACECRAFT,
    is_equipment_active,
)
from processors.spacecraft_processor import process_spacecraft
from validators.output_validator import validate_dataset, ALL_MODEL_KEYS

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("data-processing")


# ---------------------------------------------------------------------------
# JSON serialiser that handles Decimal
# ---------------------------------------------------------------------------
import decimal


class _DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        return super().default(obj)


def _write_output(dataset: dict, output_path: Path) -> None:
    """Write *dataset* as pretty-printed JSON to *output_path*."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as fh:
        json.dump(dataset, fh, indent=2, ensure_ascii=False, cls=_DecimalEncoder)


def _record_counts(data: dict) -> dict[str, int]:
    """Return a {model_name: count} dict for non-null models."""
    return {
        key: len(val)
        for key, val in data.items()
        if val is not None
    }


def _format_counts(counts: dict[str, int]) -> str:
    """Format record counts as a compact comma-separated string."""
    return ", ".join(f"{k}: {v}" for k, v in counts.items() if v > 0)


# ---------------------------------------------------------------------------
# Per-spacecraft processing
# ---------------------------------------------------------------------------

def _process_file(json_path: Path) -> dict:
    """
    Load, process, clean, validate, and write one spacecraft JSON file.
    Writes:
      - results/<slug>/spacecraft_bulk.json (32 Prisma models)
      - results/<slug>/images.json (image catalog with links & descriptions)

    Returns
    -------
    dict
        Result summary with keys: slug, ok, output_path, images_path,
        counts, image_count, warnings, error.
    """
    raw_slug = json_path.stem
    norm_slug = raw_slug.replace("_", "-")

    result: dict = {
        "slug": norm_slug,
        "ok": False,
        "output_path": None,
        "images_path": None,
        "counts": {},
        "image_count": 0,
        "warnings": [],
        "error": None,
    }

    log.info("Processing: %s", json_path.name)

    # --- Load ---
    with open(json_path, "r", encoding="utf-8") as fh:
        raw_data = json.load(fh)

    # --- Process (returns bulk dataset + images catalog) ---
    dataset, images_catalog = process_spacecraft(raw_data)

    # --- Validate bulk dataset against Prisma schema rules ---
    validation = validate_dataset(dataset)
    result["warnings"] = validation.warnings

    if not validation.is_valid:
        for err in validation.errors:
            log.error("[%s] Validation error: %s", norm_slug, err)
        result["error"] = (
            f"{len(validation.errors)} validation error(s): "
            + "; ".join(validation.errors[:3])
        )

    # --- Write outputs ---
    output_dir = OUTPUT_FOLDER / norm_slug
    bulk_path = output_dir / "spacecraft_bulk.json"
    images_path = output_dir / "images.json"

    _write_output(dataset, bulk_path)
    _write_output(images_catalog, images_path)

    result["output_path"] = str(bulk_path.relative_to(OUTPUT_FOLDER.parent))
    result["images_path"] = str(images_path.relative_to(OUTPUT_FOLDER.parent))
    result["counts"] = _record_counts(dataset["data"])
    result["image_count"] = images_catalog.get("totalImages", 0)
    result["ok"] = validation.is_valid

    return result


# ---------------------------------------------------------------------------
# Main orchestrator
# ---------------------------------------------------------------------------

def main() -> int:
    """
    Orchestrate the full processing pipeline with optional zone and target filtering.

    Returns
    -------
    int
        Exit code (0 = all succeeded, 1 = one or more failures).
    """
    import argparse

    parser = argparse.ArgumentParser(
        description="SPACE LEGACY - Data Processing Pipeline",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--zone",
        nargs="+",
        default=None,
        help="Filter by spatial zone(s), e.g. MOON MARS DEEP_SPACE ASTEROIDS",
    )
    parser.add_argument(
        "--target",
        nargs="+",
        default=None,
        help="Filter by spacecraft slug(s), e.g. pioneer-10 apollo-lunar-modules",
    )
    parser.add_argument(
        "--input-dir",
        type=str,
        default=str(INPUT_FOLDER),
        help="Input folder containing raw JSON files",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(OUTPUT_FOLDER),
        help="Output folder for processed results",
    )

    args = parser.parse_args()

    input_path = Path(args.input_dir)
    output_path = Path(args.output_dir)

    log.info("=== DATA PROCESSING PIPELINE STARTING ===")
    log.info("Input  : %s", input_path)
    log.info("Output : %s", output_path)

    active_zones = [z.upper() for z in args.zone] if args.zone else TARGET_ZONES
    active_targets = args.target if args.target else TARGET_SPACECRAFT

    if active_zones:
        log.info("Filtering by Spatial Zones: %s", ", ".join(active_zones))
    if active_targets:
        log.info("Filtering by Targets      : %s", ", ".join(active_targets))

    if not input_path.exists():
        log.error("Input folder does not exist: %s", input_path)
        return 1

    all_json_files = sorted(input_path.glob("*.json"))
    if not all_json_files:
        log.error("No JSON files found in %s", input_path)
        return 1

    # Apply spatial zone and target filters
    json_files = [
        f for f in all_json_files
        if is_equipment_active(f.stem, zones=active_zones, targets=active_targets)
    ]

    log.info("Discovered %d matching input file(s) (out of %d total)", len(json_files), len(all_json_files))
    output_path.mkdir(parents=True, exist_ok=True)

    results: list[dict] = []
    total_warnings: list[str] = []
    total_errors: list[str] = []

    for json_path in json_files:
        try:
            res = _process_file(json_path)
            results.append(res)
            total_warnings.extend(res["warnings"])
            if not res["ok"] and res["error"]:
                total_errors.append(f"{res['slug']}: {res['error']}")
            status = "OK" if res["ok"] else "WARN"
            log.info(
                "[%s] %s → %s (Images: %d)",
                status,
                res["slug"],
                res.get("output_path", "?"),
                res.get("image_count", 0),
            )
        except Exception as exc:
            tb = traceback.format_exc()
            log.error("[FAIL] %s — %s\n%s", json_path.stem, exc, tb)
            results.append(
                {
                    "slug": json_path.stem.replace("_", "-"),
                    "ok": False,
                    "output_path": None,
                    "images_path": None,
                    "counts": {},
                    "image_count": 0,
                    "warnings": [],
                    "error": str(exc),
                }
            )
            total_errors.append(f"{json_path.stem}: {exc}")

    # Summary report
    successful = [r for r in results if r["ok"]]
    failed = [r for r in results if not r["ok"]]

    print()
    print("=" * 60)
    print("=== DATA PROCESSING SUMMARY ===")
    print("=" * 60)
    print(f"Input files discovered : {len(json_files)}")
    print(f"Spacecraft processed   : {len(results)}")
    print(f"Successful outputs     : {len(successful)}")
    print(f"Failed / errors        : {len(failed)}")
    print()
    print("--- Per-spacecraft results ---")

    for r in results:
        status = "OK  " if r["ok"] else "FAIL"
        path = r.get("output_path") or "not written"
        img_info = f"[{r['image_count']} images → {r.get('images_path')}]"
        print(f"[{status}] {r['slug']:<25} → {path}")
        print(f"       Images: {img_info}")
        if r["counts"]:
            counts_str = _format_counts(r["counts"])
            print(f"       Models: {counts_str}")
        if r["error"]:
            print(f"       ⚠  {r['error']}")

    print()
    print("--- Validation ---")
    print(f"Warnings : {len(total_warnings)}")
    print(f"Errors   : {len(total_errors)}")
    if total_errors:
        print()
        print("Error details:")
        for e in total_errors:
            print(f"  • {e}")

    print()
    print("=" * 60)
    log.info("Pipeline complete.")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
