"""
Events extractor for the data-processing pipeline.

Extracts ``MachineEvent`` records according to schema.prisma:
- id: deterministic UUID v5
- machineId: UUID
- dateLabel: string formatted date (e.g., "July 20, 1969")
- dateIso: ISO 8601 timestamp string (e.g., "1969-07-20T00:00:00Z") - avoid null!
- title: string
- description: text
- sourceId: UUID (FK -> machine_sources)
- sortOrder: int (1, 2, 3...)
"""

import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import clean_text, truncate, clean_markdown_text
from utils.dates import parse_date


# Patterns for extracting timeline dates
_TIMELINE_HEADER_RE = re.compile(
    r"###\s+([A-Za-z]+\.?\s+\d{1,2},?\s+\d{4})\s*\n([^\n]+)",
    re.MULTILINE,
)

_BOLD_DATE_RE = re.compile(
    r"\*\*([A-Za-z]+\.?\s+(?:\d{1,2},?\s+)?\d{4}):?\*\*:?\s*([^\n]+)",
)

_NSSDC_DATE_RE = re.compile(
    r"\*\*(Launch Date|Landing Date|Deployment Date|First Flight|Final Contact|Last Signal):\*\*\s*([^\n\r\|]+)",
    re.IGNORECASE,
)


def _to_iso_datetime(iso_date: str | None, default_year: int | None = None) -> str:
    """Format an ISO date string into an ISO 8601 UTC timestamp (YYYY-MM-DDTHH:MM:SSZ)."""
    if iso_date and re.match(r"^\d{4}-\d{2}-\d{2}$", iso_date):
        return f"{iso_date}T00:00:00Z"
    if iso_date and re.match(r"^\d{4}-\d{2}$", iso_date):
        return f"{iso_date}-01T00:00:00Z"
    if iso_date and re.match(r"^\d{4}$", iso_date):
        return f"{iso_date}-01-01T00:00:00Z"
    if default_year:
        return f"{default_year}-01-01T00:00:00Z"
    return "1970-01-01T00:00:00Z"


def extract_machine_events(
    pages: list[dict],
    machine_id: str,
    machine_name: str,
    source_id_map: dict[str, str],
    default_source_id: str,
    baseline_events: list[dict] | None = None,
) -> list[dict]:
    """
    Extract MachineEvent records from crawled pages and timeline narrative.

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
        Fallback source UUID if not matched to a specific page.
    baseline_events:
        Optional list of curated historical events for this specific machine.
    """
    events: list[dict] = []
    seen_titles: set[str] = set()

    # 1. Include curated baseline events if provided
    if baseline_events:
        for b_ev in baseline_events:
            title = b_ev["title"]
            seen_titles.add(title.lower())
            date_label = b_ev["dateLabel"]
            date_iso_raw, _ = parse_date(date_label)
            date_iso = b_ev.get("dateIso") or _to_iso_datetime(date_iso_raw)
            events.append({
                "dateLabel": date_label,
                "dateIso": date_iso,
                "title": title,
                "description": b_ev["description"],
                "sourceId": b_ev.get("sourceId") or default_source_id,
            })

    # 2. Extract from crawled pages
    for page in pages:
        url = page.get("url", "")
        content = page.get("content", "")
        if not content:
            continue
        page_source_id = source_id_map.get(url, default_source_id)

        # Pattern A: ### Date \n Title
        for m in _TIMELINE_HEADER_RE.finditer(content):
            d_raw, title_raw = m.group(1).strip(), m.group(2).strip()
            clean_title = clean_text(title_raw)
            if not clean_title or clean_title.lower() in seen_titles:
                continue
            date_iso_str, _ = parse_date(d_raw)
            if not date_iso_str:
                continue
            seen_titles.add(clean_title.lower())
            events.append({
                "dateLabel": d_raw,
                "dateIso": _to_iso_datetime(date_iso_str),
                "title": truncate(clean_title, 150),
                "description": f"Key mission timeline event recorded on {d_raw}: {clean_title}.",
                "sourceId": page_source_id,
            })

        # Pattern B: **Date:** Description
        for m in _BOLD_DATE_RE.finditer(content):
            d_raw, desc_raw = m.group(1).strip(), m.group(2).strip()
            clean_desc = clean_markdown_text(desc_raw)
            if len(clean_desc) < 10:
                continue
            # First sentence as title
            title_cand = clean_desc.split(".")[0].strip()
            if not title_cand or title_cand.lower() in seen_titles:
                continue
            date_iso_str, _ = parse_date(d_raw)
            if not date_iso_str:
                continue
            seen_titles.add(title_cand.lower())
            events.append({
                "dateLabel": d_raw,
                "dateIso": _to_iso_datetime(date_iso_str),
                "title": truncate(title_cand, 150),
                "description": clean_desc,
                "sourceId": page_source_id,
            })

        # Pattern C: **Key Date Type:** YYYY-MM-DD
        for m in _NSSDC_DATE_RE.finditer(content):
            label_raw, val_raw = m.group(1).strip(), m.group(2).strip()
            title = f"{machine_name} {label_raw}"
            if title.lower() in seen_titles:
                continue
            date_iso_str, _ = parse_date(val_raw)
            if not date_iso_str:
                continue
            seen_titles.add(title.lower())
            events.append({
                "dateLabel": val_raw,
                "dateIso": _to_iso_datetime(date_iso_str),
                "title": title,
                "description": f"Official {label_raw.lower()} recorded by NASA: {val_raw}.",
                "sourceId": page_source_id,
            })

    # Sort events chronologically by dateIso
    events.sort(key=lambda ev: ev["dateIso"] or "")

    # Assign IDs and sortOrder
    result: list[dict] = []
    for idx, ev in enumerate(events, start=1):
        ev_id = make_id("machine_event", machine_id, str(idx), ev["title"])
        result.append({
            "id": ev_id,
            "machineId": machine_id,
            "dateLabel": ev["dateLabel"],
            "dateIso": ev["dateIso"],
            "title": ev["title"],
            "description": ev["description"],
            "sourceId": ev["sourceId"],
            "sortOrder": idx,
        })

    return result
