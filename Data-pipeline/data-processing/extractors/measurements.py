"""
Measurements extractor for the data-processing pipeline.

Extracts ``Measurement`` records from markdown tech-spec tables found
in crawled page content.

Expected table patterns
-----------------------
| Mass          | 3.97 pounds (1.8 kilograms)                         |
| Power         | Solar panel ... ~350 Watts average ...               |
| Width         | Total length of rotors: Approximately 4 feet (1.2 m)|

No third-party libraries — stdlib only.
"""

import re
import sys
import os
from decimal import Decimal, InvalidOperation

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import clean_text
from utils.dates import now_iso
from utils.enums import map_measurement_type


# ---------------------------------------------------------------------------
# Value extraction helpers
# ---------------------------------------------------------------------------

# Match a number (int or float) possibly with commas as thousands-separator
_NUMBER_RE = re.compile(r"[\d,]+(?:\.\d+)?")

# Preferred metric unit patterns (match inside parentheses in a cell value)
_METRIC_PARENS_RE = re.compile(
    r"\((?:approximately\s+)?([\d,]+(?:\.\d+)?)\s*"
    r"(kilograms?|kg|meters?|metres?|m|centimeters?|cm|millimeters?|mm|"
    r"kilometers?|km|watts?|W|kilohertz|MHz|GHz|Hz|seconds?|s|minutes?|"
    r"hours?|days?|km/s|m/s|km/h|mph|°C|°F|K|N|kN|Pa|kPa)\)",
    re.IGNORECASE,
)

# Imperial/general value: first number + unit in the whole cell
_GENERAL_VALUE_RE = re.compile(
    r"(?:approximately\s+)?([\d,]+(?:\.\d+)?)\s*"
    r"(pounds?|lbs?|kilograms?|kg|feet|foot|ft|inches?|in\b|miles?|"
    r"meters?|metres?|m\b|centimeters?|cm|kilometers?|km|watts?|W\b|"
    r"kilowatts?|kW|seconds?|s\b|minutes?|hours?|days?|years?|"
    r"km/s|m/s|km/h|mph|°C|°F|K\b|N\b|kN|Pa\b|kPa|MHz|GHz|Hz|rpm)",
    re.IGNORECASE,
)

# Unit normalisation map (raw → canonical)
_UNIT_NORM: dict[str, str] = {
    "pound": "lb", "pounds": "lb", "lbs": "lb", "lb": "lb",
    "kilogram": "kg", "kilograms": "kg", "kg": "kg",
    "foot": "ft", "feet": "ft", "ft": "ft",
    "inch": "in", "inches": "in",
    "meter": "m", "meters": "m", "metre": "m", "metres": "m", "m": "m",
    "centimeter": "cm", "centimeters": "cm", "cm": "cm",
    "kilometer": "km", "kilometers": "km", "km": "km",
    "millimeter": "mm", "millimeters": "mm", "mm": "mm",
    "watt": "W", "watts": "W", "w": "W",
    "kilowatt": "kW", "kilowatts": "kW", "kw": "kW",
    "second": "s", "seconds": "s", "s": "s",
    "minute": "min", "minutes": "min",
    "hour": "h", "hours": "h",
    "day": "day", "days": "day",
    "year": "year", "years": "year",
    "mile": "mi", "miles": "mi",
    "mhz": "MHz", "ghz": "GHz", "hz": "Hz",
    "rpm": "rpm",
    "n": "N", "kn": "kN",
    "pa": "Pa", "kpa": "kPa",
    "°c": "°C", "°f": "°F", "k": "K",
    "km/s": "km/s", "m/s": "m/s", "km/h": "km/h", "mph": "mph",
}


def _normalise_unit(raw: str) -> str:
    return _UNIT_NORM.get(raw.lower().rstrip("s"), raw)


def _parse_cell_value(cell: str) -> tuple[Decimal | None, str, bool]:
    """
    Parse a measurement table cell value.

    Returns
    -------
    tuple[Decimal | None, str, bool]
        (numeric_value, unit, is_approximate)
    """
    is_approximate = bool(re.search(r"\bapprox(?:imately)?\b|~\s*\d", cell, re.IGNORECASE))

    # Prefer metric value in parentheses
    m = _METRIC_PARENS_RE.search(cell)
    if m:
        raw_num = m.group(1).replace(",", "")
        unit = _normalise_unit(m.group(2))
        try:
            return Decimal(raw_num), unit, is_approximate
        except InvalidOperation:
            pass

    # Fall back to first number + unit in full cell
    m = _GENERAL_VALUE_RE.search(cell)
    if m:
        raw_num = m.group(1).replace(",", "")
        unit = _normalise_unit(m.group(2))
        try:
            return Decimal(raw_num), unit, is_approximate
        except InvalidOperation:
            pass

    return None, "", is_approximate


# ---------------------------------------------------------------------------
# Table row extraction
# ---------------------------------------------------------------------------

# Match a simple two-column markdown table row: | name | value |
_TABLE_ROW_RE = re.compile(
    r"^\|\s*([^|\-]{2,60}?)\s*\|\s*([^|]{3,300}?)\s*\|",
    re.MULTILINE,
)

# Skip these row labels — they're not measurements
_SKIP_LABELS = {
    "field", "value", "parameter", "detail", "description", "key", "item",
    "property", "note", "status", "---", "type", "name", "url",
}


def extract_measurements(combined_content: str, equipment_id: str) -> list[dict]:
    """
    Extract ``Measurement`` records from tech-spec tables in the content.

    Parameters
    ----------
    combined_content:
        Concatenated text of the top-scored pages.
    equipment_id:
        UUID of the associated Equipment record.

    Returns
    -------
    list[dict]
        List of Measurement dicts (may be empty).
    """
    measurements: list[dict] = []
    seen_names: set[str] = set()
    ts = now_iso()

    for m in _TABLE_ROW_RE.finditer(combined_content):
        label = clean_text(m.group(1))
        cell = clean_text(m.group(2))

        label_lower = label.lower().strip()
        # Skip headers and known non-measurement labels
        if label_lower in _SKIP_LABELS:
            continue
        if re.match(r"^-+$", label_lower):
            continue
        # Skip rows that are clearly not numeric measurements
        if not _NUMBER_RE.search(cell):
            continue

        value, unit, is_approx = _parse_cell_value(cell)
        if value is None:
            continue

        name = label.strip()
        name_key = name.lower()
        if name_key in seen_names:
            continue
        seen_names.add(name_key)

        mtype = map_measurement_type(name, unit)
        meas_id = make_id("measurement", equipment_id, name_key)

        measurements.append(
            {
                "measurementId": meas_id,
                "equipmentId": equipment_id,
                "eventId": None,
                "name": name,
                "value": str(value),  # Decimal → str for JSON serialisation
                "unit": unit,
                "measurementType": mtype,
                "context": clean_text(cell)[:500],
                "measurementDate": None,
                "isApproximate": is_approx,
                "uncertainty": None,
            }
        )

    return measurements
