"""
Deterministic UUID generation for the data-processing pipeline.

Uses UUID v5 (name-based with SHA-1) so the same entity always
gets the same ID across pipeline runs.
"""

import uuid
import sys
from pathlib import Path

# Ensure project root is accessible
_ROOT = Path(__file__).parent.parent.parent.resolve()
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

try:
    from global_config import UUID_NAMESPACE_SEED
except ImportError:
    UUID_NAMESPACE_SEED = "space-legacy-pipeline-v1"

# Fixed namespace derived from the project seed — never change this.
_PIPELINE_NAMESPACE = uuid.uuid5(uuid.NAMESPACE_URL, UUID_NAMESPACE_SEED)


def make_id(entity_type: str, *parts: str) -> str:
    """
    Generate a deterministic UUID v5 string for an entity.

    Parameters
    ----------
    entity_type:
        Short category name, e.g. ``"equipment"``, ``"mission"``.
    *parts:
        Identifying string parts that together uniquely identify this
        specific record (e.g. the slug, or URL).

    Returns
    -------
    str
        Lowercase UUID string (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
    """
    # Combine entity type and all parts into a single stable key.
    key = ":".join([entity_type.lower()] + [str(p).strip().lower() for p in parts])
    return str(uuid.uuid5(_PIPELINE_NAMESPACE, key))
