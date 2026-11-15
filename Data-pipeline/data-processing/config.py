"""
Central configuration for data-processing pipeline.

Inherits from global_config.py at project root for end-to-end consistency,
reproducibility, and spatial zone filtering.
"""

from pathlib import Path
import sys

# Ensure root is in sys.path
PROJECT_ROOT = Path(__file__).parent.parent.resolve()
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import global_config

# File paths
INPUT_FOLDER = global_config.INGESTION_RESULTS_DIR
OUTPUT_FOLDER = global_config.PROCESSING_RESULTS_DIR

SCHEMA_VERSION = "1.0"

# Reproducibility settings
UUID_NAMESPACE_SEED = global_config.UUID_NAMESPACE_SEED
RANDOM_SEED = global_config.RANDOM_SEED

# Filtering & scoring
MIN_PAGE_SCORE = global_config.MIN_PAGE_SCORE
MAX_MEDIA_PER_SPACECRAFT = global_config.MAX_MEDIA_PER_SPACECRAFT
TOP_PAGES_LIMIT = global_config.TOP_PAGES_LIMIT

# Spatial zones & targets
TARGET_ZONES = global_config.TARGET_ZONES
TARGET_SPACECRAFT = global_config.TARGET_SPACECRAFT
SPATIAL_ZONE_MAP = global_config.SPATIAL_ZONE_MAP
get_spatial_zone = global_config.get_spatial_zone
get_active_equipment_slugs = global_config.get_active_equipment_slugs
is_equipment_active = global_config.is_equipment_active
normalize_slug = global_config.normalize_slug
