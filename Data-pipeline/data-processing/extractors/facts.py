"""
Facts extractor for the data-processing pipeline.

Extracts ``MachineFact`` records according to schema.prisma:
- id: deterministic UUID v5
- machineId: UUID
- label: string (e.g. "Landed Mass", "Launch Vehicle", "Total Flights")
- value: string
- unit: string? (e.g. "kg", "m", "watts", "hours", "flights", etc.)
- sourceId: UUID (FK -> machine_sources)
- sortOrder: int (1, 2, 3...)
"""

import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import clean_text, truncate, clean_markdown_text


# Unit extraction regex patterns
_UNIT_PATTERNS = [
    (r"\b(kilograms?|kg)\b", "kg"),
    (r"\b(pounds?|lbs?)\b", "lbs"),
    (r"\b(grams?|g)\b", "g"),
    (r"\b(meters?|metres?|m)\b", "m"),
    (r"\b(centimeters?|cm)\b", "cm"),
    (r"\b(millimeters?|mm)\b", "mm"),
    (r"\b(kilometers?|km)\b", "km"),
    (r"\b(feet|ft)\b", "ft"),
    (r"\b(inches?|in)\b", "in"),
    (r"\b(miles?|mi)\b", "miles"),
    (r"\b(watts?|W)\b", "W"),
    (r"\b(kilowatts?|kW)\b", "kW"),
    (r"\b(megawatts?|MW)\b", "MW"),
    (r"\b(volts?|V)\b", "V"),
    (r"\b(newtons?|N)\b", "N"),
    (r"\b(kilonewtons?|kN)\b", "kN"),
    (r"\b(seconds?|sec|s)\b", "seconds"),
    (r"\b(minutes?|min)\b", "minutes"),
    (r"\b(hours?|hr|hrs)\b", "hours"),
    (r"\b(days?)\b", "days"),
    (r"\b(years?)\b", "years"),
    (r"\b(flights?)\b", "flights"),
    (r"\b(photos?|images?|pictures?)\b", "photos"),
    (r"\b(samples?)\b", "samples"),
    (r"\b(km/s|m/s|km/h|mph)\b", lambda m: m.group(1)),
    (r"\b(rpm|RPM)\b", "RPM"),
    (r"\b(degrees?|deg|°)\b", "deg"),
]


def detect_unit(label: str, value: str) -> str | None:
    """Detect and return standard unit from label and value string."""
    combined = f"{label} {value}"
    for pat, unit_val in _UNIT_PATTERNS:
        m = re.search(pat, combined, re.IGNORECASE)
        if m:
            if callable(unit_val):
                return unit_val(m)
            return unit_val
    return None


def clean_fact_value(value: str) -> tuple[str, str | None]:
    """
    Clean the value string and separate trailing unit if detected.
    """
    clean_val = clean_markdown_text(value).strip()
    # Normalize internal brackets
    clean_val = re.sub(r"\s+", " ", clean_val)
    unit = detect_unit("", clean_val)
    return truncate(clean_val, 255), unit


def extract_machine_facts(
    pages: list[dict],
    machine_id: str,
    machine_name: str,
    source_id_map: dict[str, str],
    default_source_id: str,
    baseline_facts: list[dict] | None = None,
) -> list[dict]:
    """
    Extract structured MachineFact records from tables, key facts blocks, and narrative.

    Parameters
    ----------
    pages:
        List of crawled pages.
    machine_id:
        UUID of the machine.
    machine_name:
        Display name of the machine.
    source_id_map:
        Map of page URL -> MachineSource ID.
    default_source_id:
        Fallback source UUID.
    baseline_facts:
        List of curated verified facts for this machine.
    """
    facts: list[dict] = []
    seen_labels: set[str] = set()

    # 1. Add baseline facts first
    if baseline_facts:
        for bf in baseline_facts:
            lbl = bf["label"]
            seen_labels.add(lbl.lower())
            unit = bf.get("unit") or detect_unit(lbl, bf["value"])
            facts.append({
                "label": lbl,
                "value": bf["value"],
                "unit": unit,
                "sourceId": bf.get("sourceId") or default_source_id,
            })

    # 2. Extract from markdown tables: | Label | Value |
    table_re = re.compile(r"\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|")

    for page in pages:
        url = page.get("url", "")
        content = page.get("content", "")
        if not content:
            continue
        page_source_id = source_id_map.get(url, default_source_id)

        for m in table_re.finditer(content):
            raw_label, raw_val = m.group(1).strip(), m.group(2).strip()
            # Skip separator rows or headers
            if "---" in raw_label or "---" in raw_val:
                continue
            if raw_label.lower() in ("name", "parameter", "item", "key", "metric", "type"):
                continue
            if len(raw_label) > 50 or len(raw_val) < 2 or len(raw_val) > 250:
                continue
            clean_lbl = clean_markdown_text(raw_label).strip(": ")
            if not clean_lbl or clean_lbl.lower() in seen_labels:
                continue
            clean_val, detected_unit = clean_fact_value(raw_val)
            if not clean_val or clean_val.startswith("http"):
                continue

            seen_labels.add(clean_lbl.lower())
            facts.append({
                "label": clean_lbl,
                "value": clean_val,
                "unit": detected_unit,
                "sourceId": page_source_id,
            })

    # 3. Extract NSSDC bullet facts: **Label:** Value
    kv_re = re.compile(r"\*\*([A-Za-z0-9\s/]+?):\*\*\s*([^\n\r\|]{2,120})")
    for page in pages:
        url = page.get("url", "")
        content = page.get("content", "")
        page_source_id = source_id_map.get(url, default_source_id)

        for m in kv_re.finditer(content):
            lbl, val = m.group(1).strip(), m.group(2).strip()
            if len(lbl) > 40 or lbl.lower() in seen_labels:
                continue
            if any(k in lbl.lower() for k in ["date", "description", "reference", "source", "url"]):
                continue
            clean_val, unit = clean_fact_value(val)
            if not clean_val:
                continue

            seen_labels.add(lbl.lower())
            facts.append({
                "label": lbl,
                "value": clean_val,
                "unit": unit,
                "sourceId": page_source_id,
            })

    # Assign IDs and sortOrder
    result: list[dict] = []
    for idx, f in enumerate(facts, start=1):
        f_id = make_id("machine_fact", machine_id, str(idx), f["label"])
        result.append({
            "id": f_id,
            "machineId": machine_id,
            "label": f["label"],
            "value": f["value"],
            "unit": f["unit"],
            "sourceId": f["sourceId"],
            "sortOrder": idx,
        })

    return result
