"""
Mission extractor for the data-processing pipeline.

Extracts a single ``Mission`` record representing the flight program
or exploration project the spacecraft was part of, directly and strictly
from the crawled JSON content.

No third-party libraries — stdlib only.
"""

import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import slugify, truncate, clean_text
from utils.dates import now_iso
from utils.enums import map_mission_status


def _extract_mission_name(content: str, output_name: str) -> str:
    """Extract mission name directly from raw page content."""
    m_h1 = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    h1 = m_h1.group(1).strip() if m_h1 else ""

    # Check for Apollo program flight numbers (e.g., Apollo 11, Apollo 12, Apollo 15)
    m_apollo = re.search(r"\b(Apollo\s+\d+)\b", h1 + " " + content[:2000], re.IGNORECASE)
    if m_apollo:
        return m_apollo.group(1).title()

    # Clean H1 title if present
    if h1:
        clean = re.sub(r"\s*[\-–|/].*$", "", h1).strip()
        clean = re.sub(r"\s*(NASA|NSSDCA|Science).*$", "", clean, flags=re.IGNORECASE).strip()
        if len(clean) >= 3:
            return clean

    # Fallback to readable output name
    return output_name.replace("_", " ").title()


def _extract_mission_description(content: str) -> str | None:
    """Extract mission description directly from raw page content."""
    if not content:
        return None

    # NSSDC description section
    m_nssdc = re.search(r"##\s+Description\s*\n+([^\n#]+)", content)
    if m_nssdc:
        desc = m_nssdc.group(1).strip()
        if len(desc) >= 40:
            return truncate(desc, 800)

    # NASA Science "What was ...?" section
    m_what = re.search(r"##\s+What was [^\n\?]+\?\s*\n+([^\n#]+)", content)
    if m_what:
        desc = m_what.group(1).strip()
        if len(desc) >= 40:
            return truncate(desc, 800)

    return None


def extract_mission(
    resource: dict,
    pages: list[dict],
    combined_content: str,
) -> dict:
    """
    Extract the primary ``Mission`` record strictly from the raw data.

    Parameters
    ----------
    resource:
        The ``resource`` dict from the raw JSON.
    pages:
        List of all pages.
    combined_content:
        Concatenated content of the best pages.

    Returns
    -------
    dict
        A complete Mission record matching schema.prisma.
    """
    output_name: str = resource.get("output_name", "unknown")
    primary_content = pages[0].get("content", "") if pages else combined_content

    mission_name = _extract_mission_name(primary_content, output_name)
    slug = slugify(mission_name)
    mission_id = make_id("mission", slug)

    description = _extract_mission_description(primary_content)

    agency = "NASA" if "NASA" in primary_content.upper() else None
    status = map_mission_status(primary_content[:8000])

    ts = now_iso()
    return {
        "missionId": mission_id,
        "name": mission_name,
        "slug": slug,
        "description": description,
        "agency": agency,
        "missionStatus": status,
        "createdAt": ts,
        "updatedAt": ts,
    }
