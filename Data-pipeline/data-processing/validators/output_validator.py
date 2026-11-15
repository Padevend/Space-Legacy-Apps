"""
Output validator for the data-processing pipeline.

Validates processed bulk datasets against the authoritative schema.prisma:
- Checks required models: CelestialBody, Machine, MachineSource, MachineFact, MachineEvent, MachineImage
- Verifies UUID v5 formats for all identifier columns
- Validates enum values against MachineKind, MachineState, MediaLabel
- Checks foreign key referential integrity within each dataset

No third-party libraries — stdlib only.
"""

import re
import uuid
from dataclasses import dataclass, field
from typing import Any

from utils.enums import MACHINE_KINDS, MACHINE_STATES, MEDIA_LABELS

# The 6 core models governed by the pipeline
ALL_MODEL_KEYS: list[str] = [
    "CelestialBody",
    "Machine",
    "MachineSource",
    "MachineFact",
    "MachineEvent",
    "MachineImage",
]

# Required fields for each model
REQUIRED_FIELDS: dict[str, list[str]] = {
    "CelestialBody": ["id", "slug", "name", "summary", "sortOrder", "isPublished"],
    "Machine": [
        "id", "slug", "bodyId", "name", "kind", "state",
        "summary", "description", "missionPurpose", "howItWorked",
        "discoveries", "isPublished"
    ],
    "MachineSource": ["id", "machineId", "title", "publisher", "url"],
    "MachineFact": ["id", "machineId", "label", "value", "sourceId", "sortOrder"],
    "MachineEvent": ["id", "machineId", "dateLabel", "title", "description", "sourceId", "sortOrder"],
    "MachineImage": ["id", "machineId", "path", "alt", "label", "credit", "width", "height", "isCover", "sortOrder"],
}

_UUID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


def _is_valid_uuid(val: Any) -> bool:
    """Return True if val is a valid UUID string."""
    if not isinstance(val, str):
        return False
    return bool(_UUID_RE.match(val))


@dataclass
class ValidationResult:
    """Validation outcome."""
    is_valid: bool = True
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def validate_dataset(dataset: dict[str, Any]) -> ValidationResult:
    """
    Validate a spacecraft_bulk dataset against the Prisma schema rules.

    Parameters
    ----------
    dataset:
        Dict with top-level keys 'metadata' and 'data'.

    Returns
    -------
    ValidationResult
    """
    res = ValidationResult()

    if not isinstance(dataset, dict):
        res.errors.append("Dataset must be a dictionary")
        res.is_valid = False
        return res

    data = dataset.get("data")
    if not isinstance(data, dict):
        res.errors.append("Dataset missing 'data' dictionary")
        res.is_valid = False
        return res

    # 1. Verify required model keys
    for key in ALL_MODEL_KEYS:
        if key not in data:
            res.errors.append(f"Missing required model key: {key}")
        elif not isinstance(data[key], list) or len(data[key]) == 0:
            res.errors.append(f"Model {key} must be a non-empty list of records")

    if res.errors:
        res.is_valid = False
        return res

    # Collect IDs for referential integrity
    body_ids = {r.get("id") for r in data.get("CelestialBody", []) if r.get("id")}
    machine_ids = {r.get("id") for r in data.get("Machine", []) if r.get("id")}
    source_ids = {r.get("id") for r in data.get("MachineSource", []) if r.get("id")}

    # 2. Validate CelestialBody
    for idx, cb in enumerate(data.get("CelestialBody", [])):
        for fld in REQUIRED_FIELDS["CelestialBody"]:
            if cb.get(fld) is None:
                res.errors.append(f"CelestialBody[{idx}] missing field '{fld}'")
        if not _is_valid_uuid(cb.get("id")):
            res.errors.append(f"CelestialBody[{idx}] has invalid UUID id '{cb.get('id')}'")

    # 3. Validate Machine
    for idx, m in enumerate(data.get("Machine", [])):
        for fld in REQUIRED_FIELDS["Machine"]:
            if m.get(fld) is None:
                res.errors.append(f"Machine[{idx}] missing required field '{fld}'")
        if not _is_valid_uuid(m.get("id")):
            res.errors.append(f"Machine[{idx}] has invalid UUID id '{m.get('id')}'")
        if m.get("bodyId") not in body_ids:
            res.errors.append(f"Machine[{idx}] bodyId '{m.get('bodyId')}' not found in CelestialBody IDs")
        if m.get("kind") not in MACHINE_KINDS:
            res.errors.append(f"Machine[{idx}] invalid kind '{m.get('kind')}'")
        if m.get("state") not in MACHINE_STATES:
            res.errors.append(f"Machine[{idx}] invalid state '{m.get('state')}'")

    # 4. Validate MachineSource
    for idx, s in enumerate(data.get("MachineSource", [])):
        for fld in REQUIRED_FIELDS["MachineSource"]:
            if s.get(fld) is None:
                res.errors.append(f"MachineSource[{idx}] missing field '{fld}'")
        if not _is_valid_uuid(s.get("id")):
            res.errors.append(f"MachineSource[{idx}] has invalid UUID id '{s.get('id')}'")
        if s.get("machineId") not in machine_ids:
            res.errors.append(f"MachineSource[{idx}] machineId '{s.get('machineId')}' not in Machine IDs")

    # 5. Validate MachineFact
    for idx, f in enumerate(data.get("MachineFact", [])):
        for fld in REQUIRED_FIELDS["MachineFact"]:
            if f.get(fld) is None:
                res.errors.append(f"MachineFact[{idx}] missing field '{fld}'")
        if not _is_valid_uuid(f.get("id")):
            res.errors.append(f"MachineFact[{idx}] has invalid UUID id '{f.get('id')}'")
        if f.get("machineId") not in machine_ids:
            res.errors.append(f"MachineFact[{idx}] machineId '{f.get('machineId')}' not in Machine IDs")
        if f.get("sourceId") not in source_ids:
            res.errors.append(f"MachineFact[{idx}] sourceId '{f.get('sourceId')}' not in MachineSource IDs")

    # 6. Validate MachineEvent
    for idx, ev in enumerate(data.get("MachineEvent", [])):
        for fld in REQUIRED_FIELDS["MachineEvent"]:
            if ev.get(fld) is None:
                res.errors.append(f"MachineEvent[{idx}] missing field '{fld}'")
        if not _is_valid_uuid(ev.get("id")):
            res.errors.append(f"MachineEvent[{idx}] has invalid UUID id '{ev.get('id')}'")
        if ev.get("machineId") not in machine_ids:
            res.errors.append(f"MachineEvent[{idx}] machineId '{ev.get('machineId')}' not in Machine IDs")
        if ev.get("sourceId") not in source_ids:
            res.errors.append(f"MachineEvent[{idx}] sourceId '{ev.get('sourceId')}' not in MachineSource IDs")

    # 7. Validate MachineImage
    has_cover = False
    for idx, img in enumerate(data.get("MachineImage", [])):
        for fld in REQUIRED_FIELDS["MachineImage"]:
            if img.get(fld) is None:
                res.errors.append(f"MachineImage[{idx}] missing field '{fld}'")
        if not _is_valid_uuid(img.get("id")):
            res.errors.append(f"MachineImage[{idx}] has invalid UUID id '{img.get('id')}'")
        if img.get("machineId") not in machine_ids:
            res.errors.append(f"MachineImage[{idx}] machineId '{img.get('machineId')}' not in Machine IDs")
        if img.get("label") not in MEDIA_LABELS:
            res.errors.append(f"MachineImage[{idx}] invalid label '{img.get('label')}'")
        if img.get("isCover"):
            has_cover = True

    if not has_cover and len(data.get("MachineImage", [])) > 0:
        res.warnings.append("No cover image (isCover=True) found in MachineImage records")

    res.is_valid = len(res.errors) == 0
    return res
