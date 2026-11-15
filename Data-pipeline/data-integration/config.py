"""
Configuration for data-integration pipeline.

Inherits from global_config.py at project root for end-to-end consistency,
reproducibility, and spatial zone filtering.
Reads PostgreSQL connection parameters from environment variables with sensible defaults,
supporting both individual components (DB_HOST, DB_USER, etc.) and full DATABASE_URL.
"""

from pathlib import Path
import os
import sys
from urllib.parse import urlparse

# Ensure root is in sys.path
PROJECT_ROOT = Path(__file__).parent.parent.resolve()
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import global_config

# ---------------------------------------------------------------------------
# Directories & Global Settings
# ---------------------------------------------------------------------------
INPUT_FOLDER = global_config.PROCESSING_RESULTS_DIR
OUTPUT_FOLDER = global_config.INTEGRATION_RESULTS_DIR

TARGET_ZONES = global_config.TARGET_ZONES
TARGET_SPACECRAFT = global_config.TARGET_SPACECRAFT
SPATIAL_ZONE_MAP = global_config.SPATIAL_ZONE_MAP
get_spatial_zone = global_config.get_spatial_zone
get_active_equipment_slugs = global_config.get_active_equipment_slugs
is_equipment_active = global_config.is_equipment_active
normalize_slug = global_config.normalize_slug

# ---------------------------------------------------------------------------
# Database Connection Parameters
# ---------------------------------------------------------------------------
DB_HOST = os.getenv("DB_HOST", os.getenv("POSTGRES_HOST", "localhost"))
DB_PORT = int(os.getenv("DB_PORT", os.getenv("POSTGRES_PORT", "5432")))
DB_NAME = os.getenv("DB_NAME", os.getenv("POSTGRES_DB", "space_legacy"))
DB_USER = os.getenv("DB_USER", os.getenv("POSTGRES_USER", "postgres"))
DB_PASSWORD = os.getenv("DB_PASSWORD", os.getenv("POSTGRES_PASSWORD", ""))

# Full connection string (can be overridden by DATABASE_URL from schema.prisma / .env)
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    try:
        parsed = urlparse(DATABASE_URL)
        if parsed.hostname:
            DB_HOST = parsed.hostname
        if parsed.port:
            DB_PORT = parsed.port
        if parsed.path and parsed.path.lstrip("/"):
            DB_NAME = parsed.path.lstrip("/")
        if parsed.username:
            DB_USER = parsed.username
        if parsed.password is not None:
            DB_PASSWORD = parsed.password
    except Exception:
        pass
else:
    # Build standard connection URL
    if DB_PASSWORD:
        DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    else:
        DATABASE_URL = f"postgresql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ---------------------------------------------------------------------------
# Bulk Insertion Configuration
# ---------------------------------------------------------------------------
BATCH_SIZE = int(os.getenv("BATCH_SIZE", "500"))
ON_CONFLICT_ACTION = os.getenv("ON_CONFLICT_ACTION", "DO NOTHING").upper()
if ON_CONFLICT_ACTION not in ("DO NOTHING", "DO UPDATE"):
    ON_CONFLICT_ACTION = "DO NOTHING"

# Connection timeout in seconds
CONNECT_TIMEOUT = int(os.getenv("DB_CONNECT_TIMEOUT", "5"))


def get_connection_params() -> dict:
    """Return connection parameters as a dictionary for psycopg2."""
    params = {
        "host": DB_HOST,
        "port": DB_PORT,
        "dbname": DB_NAME,
        "user": DB_USER,
        "connect_timeout": CONNECT_TIMEOUT,
    }
    if DB_PASSWORD:
        params["password"] = DB_PASSWORD
    return params
