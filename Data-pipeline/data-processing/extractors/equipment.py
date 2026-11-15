"""
Equipment extractor for the data-processing pipeline.

Extracts a single primary ``Equipment`` record from the authoritative
page content for a spacecraft.

Per the Prisma data model requirements:
- A primary spacecraft must have equipmentType = SPACECRAFT.
- All 10 scalar fields required by the Equipment model are populated.

No third-party libraries — stdlib only.
"""

import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import slugify, clean_text, truncate, strip_markdown
from utils.dates import now_iso
from utils.enums import map_operational_status, map_physical_status


# ---------------------------------------------------------------------------
# Manufacturer detection patterns
# ---------------------------------------------------------------------------
_MANUFACTURER_PATTERNS: list[tuple[str, str]] = [
    (r"\bJPL\b|Jet Propulsion Laboratory", "NASA/JPL"),
    (r"\bLockheed Martin\b|\bLockheed\b", "Lockheed Martin"),
    (r"\bBoeing\b", "Boeing"),
    (r"\bBall Aerospace\b", "Ball Aerospace"),
    (r"\bAerojet\b", "Aerojet Rocketdyne"),
    (r"\bRaytheon\b", "Raytheon"),
    (r"\bNorthrop Grumman\b|\bGrumman\b", "Grumman Aerospace"),
    (r"\bAeroVironment\b", "AeroVironment"),
    (r"\bThales\b", "Thales Alenia Space"),
    (r"\bAirbus\b|\bAstrium\b", "Airbus Defence and Space"),
    (r"\bOrbital Sciences\b|\bOrbital ATK\b", "Orbital Sciences"),
    (r"\bSpaceX\b", "SpaceX"),
    (r"\bRocket Lab\b", "Rocket Lab"),
    (r"\bHughes Aircraft\b|\bHughes\b", "Hughes Aircraft"),
    (r"\bTRW\b", "TRW Inc."),
    (r"\bMartin Marietta\b", "Martin Marietta"),
    (r"\bApplied Physics Laboratory\b|\bAPL\b", "Johns Hopkins APL"),
    (r"\bBendix\b", "Bendix Corporation"),
]

def _find_manufacturer(content: str) -> str | None:
    """Search *content* for known manufacturer names and return the first match."""
    for pattern, name in _MANUFACTURER_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            return name
    return None


def _extract_name(content: str, output_name: str) -> str:
    """
    Derive the spacecraft name directly from the H1 markdown heading of the crawled content.
    """
    m_h1 = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if m_h1:
        raw_title = m_h1.group(1).strip()
        # Clean site suffixes
        clean_title = re.sub(
            r"\s*[\-–|]\s*(NASA|NASA Science|NASA\.gov|NSSDCA).*$",
            "",
            raw_title,
            flags=re.IGNORECASE,
        ).strip()
        if clean_title and len(clean_title) > 2:
            return clean_title

    return output_name.replace("_", " ").title()


def _extract_description(content: str, name: str) -> str | None:
    """
    Extract the clean summary description from the article body.

    Handles:
    - NSSDC ``## Description`` sections
    - NASA Science ``## What was ...?`` sections
    - NASA Science intro paragraphs directly following ``# <Title>``
    """
    if not content:
        return None

    # 1. NSSDC description section
    m_nssdc = re.search(r"## Description\s*\n+([^\n#]+)", content)
    if m_nssdc:
        desc = m_nssdc.group(1).strip()
        if len(desc) >= 50:
            return truncate(desc, 800)

    # 2. "## What was <Spacecraft>?" section
    m_what = re.search(r"##\s+What was [^\n\?]+\?\s*\n+([^\n#]+)", content)
    if m_what:
        desc = m_what.group(1).strip()
        if len(desc) >= 50:
            return truncate(desc, 800)

    # 3. "## Viking: ..." or similar specific section
    m_sec = re.search(r"##\s+[A-Za-z0-9 ]+:\s*50 Years[^\n]*\s*\n+([^\n#]+)", content)
    if m_sec:
        desc = m_sec.group(1).strip()
        if len(desc) >= 50:
            return truncate(desc, 800)

    # 4. Paragraph immediately following # <Title>
    m_h1 = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if m_h1:
        after = content[m_h1.end():]
        # Strip footers and navigation
        for marker in [
            "## Discover More Topics",
            "### National Aeronautics",
            "## Latest News",
            "## Key Source",
            "## Key Dates",
            "## Personnel",
        ]:
            pos = after.find(marker)
            if pos != -1:
                after = after[:pos]

        # Strip markdown images and links
        clean = re.sub(r"\[!\[.*?\]\(.*?\)\]\(.*?\)", "", after)
        clean = re.sub(r"!\[.*?\]\(.*?\)", "", clean)
        clean = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", clean)

        paras = [p.strip() for p in clean.split("\n\n") if p.strip()]
        for p in paras:
            if p.startswith("#") or p.startswith("|") or p.startswith("*"):
                continue
            lines = [
                l.strip()
                for l in p.split("\n")
                if l.strip()
                and not any(
                    l.startswith(prefix)
                    for prefix in (
                        "Occurred ", "Type", "Launch", "Target",
                        "Objective", "Destination", "Results", "Mission Type",
                        "First flight", "first in flight",
                    )
                )
            ]
            cand = " ".join(lines).strip()
            if (
                len(cand) >= 50
                and not cand.lower().startswith("search")
                and "nasa logo" not in cand.lower()
            ):
                return truncate(cand, 800)

    return None


def extract_equipment(
    resource: dict,
    pages: list[dict],
    combined_content: str,
) -> dict:
    """
    Extract the primary ``Equipment`` record for a spacecraft.

    Parameters
    ----------
    resource:
        The ``resource`` dict from the raw JSON (link, target, output_name).
    pages:
        List of all pages.
    combined_content:
        Concatenated content of the best pages.

    Returns
    -------
    dict
        A complete Equipment record with equipmentType = SPACECRAFT.
    """
    output_name: str = resource.get("output_name", "unknown")
    primary_content = pages[0].get("content", "") if pages else combined_content

    # Determine canonical spacecraft name strictly from crawled content
    name = _extract_name(primary_content, output_name)
    slug = slugify(name)
    equipment_id = make_id("equipment", slug)

    # Per Prisma architecture requirements in Section 3:
    # A primary spacecraft must have equipmentType = SPACECRAFT.
    equipment_type = "SPACECRAFT"

    # Manufacturer detection across all pages
    manufacturer = _find_manufacturer(combined_content)

    # Operational & Physical statuses mapped strictly from raw content
    operational_status = map_operational_status(combined_content[:8000])
    physical_status = map_physical_status(combined_content[:8000])

    # Clean description strictly from primary content
    description = _extract_description(primary_content, name)

    ts = now_iso()
    return {
        "equipmentId": equipment_id,
        "parentEquipmentId": None,
        "name": name,
        "slug": slug,
        "description": description,
        "equipmentType": equipment_type,
        "manufacturer": manufacturer,
        "operationalStatus": operational_status,
        "physicalStatus": physical_status,
        "createdAt": ts,
        "updatedAt": ts,
    }
