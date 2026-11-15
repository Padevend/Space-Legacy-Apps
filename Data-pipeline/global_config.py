"""
SPACE LEGACY - Global Pipeline Configuration

Authoritative configuration for the end-to-end data pipeline:
- data-ingestion
- data-processing
- data-integration

Strictly complies with the 2026 NASA Space Apps Challenge constraints:
- All data must be extracted strictly from data-ingestion/results/json/
- Zero fictional or imagined content
- 100% deterministic reproducibility across runs
- Spatial zone filtering (priority on the Moon and Mars)
"""

from pathlib import Path
import os
import uuid
from typing import Any

# ---------------------------------------------------------------------------
# Challenge Information
# ---------------------------------------------------------------------------
CHALLENGE_NAME = "2026 NASA Space Apps Challenge"
CHALLENGE_TITLE = "Telling the Story of NASA Hardware Left Across the Solar System"
CHALLENGE_AUDIENCE = "School-age space enthusiasts, educators, and casual space fans"

# ---------------------------------------------------------------------------
# Spatial Zones & Priorities
# ---------------------------------------------------------------------------
ZONE_MOON = "MOON"
ZONE_MARS = "MARS"
ZONE_DEEP_SPACE = "DEEP_SPACE"
ZONE_ASTEROIDS = "ASTEROIDS"

# Priority zones defined by NASA Space Apps Challenge: Moon and Mars first
PRIORITY_ZONES = [ZONE_MOON, ZONE_MARS]
ALL_ZONES = [ZONE_MOON, ZONE_MARS, ZONE_DEEP_SPACE, ZONE_ASTEROIDS]

# Active zones configured via environment variable (default: all cataloged zones)
# e.g., export TARGET_ZONES="MOON,MARS"
_env_zones = os.getenv("TARGET_ZONES")
if _env_zones:
    TARGET_ZONES = [z.strip().upper() for z in _env_zones.split(",") if z.strip()]
else:
    TARGET_ZONES = ALL_ZONES

# Active object slugs filter via environment variable (default: all in active zones)
# e.g., export TARGET_SPACECRAFT="apollo-lunar-modules,pioneer-10"
_env_targets = os.getenv("TARGET_SPACECRAFT")
if _env_targets:
    TARGET_SPACECRAFT = [
        s.strip().lower().replace("_", "-")
        for s in _env_targets.split(",")
        if s.strip()
    ]
else:
    TARGET_SPACECRAFT = []

# ---------------------------------------------------------------------------
# Mapping of Ingestion Files to Spatial Zones
# ---------------------------------------------------------------------------
SPATIAL_ZONE_MAP: dict[str, str] = {
    # MOON (Priority 1)
    "apollo_lunar_modules": ZONE_MOON,
    "lunar_roving_vehicles": ZONE_MOON,
    "alsep_packages": ZONE_MOON,
    "surveyor_3": ZONE_MOON,
    # MARS (Priority 1)
    "mars_pathfinder": ZONE_MARS,
    "spirit_opportunity": ZONE_MARS,
    "viking_1": ZONE_MARS,
    "insight": ZONE_MARS,
    "ingenuity": ZONE_MARS,
    # DEEP SPACE & ASTEROIDS
    "pioneer_10": ZONE_DEEP_SPACE,
    "kepler": ZONE_DEEP_SPACE,
    "dawn": ZONE_ASTEROIDS,
    "near_shoemaker": ZONE_ASTEROIDS,
}

# ---------------------------------------------------------------------------
# Directories
# ---------------------------------------------------------------------------
PIPELINE_ROOT = Path(__file__).parent.resolve()

INGESTION_DIR = PIPELINE_ROOT / "data-ingestion"
INGESTION_RESULTS_DIR = INGESTION_DIR / "results" / "json"

PROCESSING_DIR = PIPELINE_ROOT / "data-processing"
PROCESSING_RESULTS_DIR = PROCESSING_DIR / "results"

INTEGRATION_DIR = PIPELINE_ROOT / "data-integration"
INTEGRATION_RESULTS_DIR = INTEGRATION_DIR / "results"
SEED_SQL_PATH = INTEGRATION_RESULTS_DIR / "seed.sql"

# ---------------------------------------------------------------------------
# Reproducibility & Determinism Settings
# ---------------------------------------------------------------------------
# Standard UUID v5 namespace seed for deterministic IDs
UUID_NAMESPACE_SEED = "space-legacy-pipeline-v1"
UUID_NAMESPACE = uuid.uuid5(uuid.NAMESPACE_DNS, UUID_NAMESPACE_SEED)

RANDOM_SEED = 42

# Media limit to prevent database overload while preserving high-quality images
MAX_MEDIA_PER_SPACECRAFT = 20
MIN_PAGE_SCORE = 0.1
TOP_PAGES_LIMIT = 10

# ---------------------------------------------------------------------------
# Filter and Query Helpers
# ---------------------------------------------------------------------------

def normalize_slug(slug_or_name: str) -> str:
    """Normalize any string into a clean lowercase slug using hyphens."""
    return slug_or_name.strip().lower().replace("_", "-")


def get_spatial_zone(output_name_or_slug: str) -> str:
    """Return the spatial zone (MOON, MARS, etc.) for a given spacecraft name or slug."""
    raw_key = output_name_or_slug.strip().lower().replace("-", "_")
    return SPATIAL_ZONE_MAP.get(raw_key, ZONE_DEEP_SPACE)


def get_active_equipment_slugs(
    zones: list[str] | None = None,
    targets: list[str] | None = None,
) -> list[str]:
    """
    Return list of equipment slugs matching the selected zones and target filters.

    Parameters
    ----------
    zones:
        Optional list of spatial zone names (e.g. ['MOON', 'MARS']).
        If omitted, defaults to TARGET_ZONES.
    targets:
        Optional list of spacecraft slugs (e.g. ['apollo-lunar-modules']).
        If omitted, defaults to TARGET_SPACECRAFT.

    Returns
    -------
    list[str]
        Deterministic, alphabetically sorted list of matching equipment slugs.
    """
    effective_zones = [z.upper() for z in (zones or TARGET_ZONES)]
    effective_targets = [normalize_slug(t) for t in (targets or TARGET_SPACECRAFT)]

    matched: list[str] = []
    for raw_name, zone in SPATIAL_ZONE_MAP.items():
        slug = normalize_slug(raw_name)
        # Check zone
        if effective_zones and zone not in effective_zones:
            continue
        # Check target filter
        if effective_targets and slug not in effective_targets and raw_name not in effective_targets:
            continue
        matched.append(slug)

    matched.sort()
    return matched


def is_equipment_active(
    slug_or_output_name: str,
    zones: list[str] | None = None,
    targets: list[str] | None = None,
) -> bool:
    """Check if a given spacecraft or output_name is active under current filters."""
    normalized = normalize_slug(slug_or_output_name)
    active_slugs = get_active_equipment_slugs(zones, targets)
    return normalized in active_slugs or normalized.replace("-", "_") in [
        s.replace("-", "_") for s in active_slugs
    ]
