"""
Prisma schema metadata, table mappings, and topological order for data-integration.

Provides:
- MODEL_TABLE_MAP: Prisma Model Name -> PostgreSQL Table Name (per @@map in schema.prisma)
- MODEL_PK_MAP: Prisma Model Name -> list of primary key columns for ON CONFLICT target
- TABLE_ORDER: Topological dependency order for seeding (CelestialBody -> Machine -> Source/Image -> Fact/Event)
- JSON_COLUMNS: Columns that require JSON serialization for PostgreSQL JSONB
- serialize_value: Adapts Python values for psycopg2 query execution
- format_sql_literal: Formats Python values as standard SQL literals for seed.sql
"""

from typing import Any
import json
from decimal import Decimal

# Try importing Json from psycopg2 if installed; fallback gracefully
try:
    from psycopg2.extras import Json
except ImportError:
    class Json:
        def __init__(self, adapted):
            self.adapted = adapted
        def __repr__(self):
            return repr(self.adapted)

# ---------------------------------------------------------------------------
# Prisma Model Name -> Database Table Name (per @@map in schema.prisma)
# ---------------------------------------------------------------------------
MODEL_TABLE_MAP: dict[str, str] = {
    "CelestialBody": "celestial_bodies",
    "Machine": "machines",
    "MachineSource": "machine_sources",
    "MachineImage": "machine_images",
    "MachineFact": "machine_facts",
    "MachineEvent": "machine_events",
}

# ---------------------------------------------------------------------------
# Primary Key / Unique Constraint columns for each model (used for ON CONFLICT target)
# In PostgreSQL / Prisma:
# - CelestialBody: unique on "slug"
# - Machine: unique on "slug"
# - LogbookEntry: unique on ("machineId", "slug")
# - Child tables: unique on "id"
# ---------------------------------------------------------------------------
MODEL_PK_MAP: dict[str, list[str]] = {
    "CelestialBody": ["slug"],
    "Machine": ["slug"],
    "MachineSource": ["id"],
    "MachineImage": ["id"],
    "MachineFact": ["id"],
    "MachineEvent": ["id"],
    "LogbookEntry": ["machineId", "slug"],
}

# ---------------------------------------------------------------------------
# Strict Topological Order for Bulk Seeding
#
# Insert order must satisfy foreign keys:
# Level 0 (no FKs): CelestialBody
# Level 1 (FK -> CelestialBody): Machine
# Level 2 (FK -> Machine): MachineSource, MachineImage
# Level 3 (FK -> Machine, MachineSource): MachineFact, MachineEvent
# ---------------------------------------------------------------------------
TABLE_ORDER: list[str] = [
    "CelestialBody",
    "Machine",
    "MachineSource",
    "MachineImage",
    "MachineFact",
    "MachineEvent",
]

# ---------------------------------------------------------------------------
# Columns with JSON/JSONB data types
# ---------------------------------------------------------------------------
JSON_COLUMNS: set[str] = set()


def serialize_value(val: Any) -> Any:
    """Prepare a Python value for psycopg2 SQL parameter binding."""
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return Json(val)
    if isinstance(val, Decimal):
        return float(val)
    return val


def format_sql_literal(val: Any) -> str:
    """Format a Python value as a standard raw SQL literal for seed.sql."""
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, Decimal):
        return str(float(val))
    if isinstance(val, (dict, list)):
        serialized = json.dumps(val, ensure_ascii=False)
        escaped = serialized.replace("'", "''")
        return f"'{escaped}'::jsonb"
    s = str(val).replace("'", "''")
    return f"'{s}'"
