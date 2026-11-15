"""
Spacecraft processor — orchestrates extraction for one spacecraft file.

Converts raw crawled JSON from data-ingestion/results/json/ into structured,
Prisma-compliant models matching schema.prisma:
- CelestialBody (celestial_bodies)
- Machine (machines)
- MachineSource (machine_sources)
- MachineFact (machine_facts)
- MachineEvent (machine_events)
- MachineImage (machine_images)

No third-party libraries — stdlib only.
"""

import hashlib
import json
import re
import sys
import os
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from config import (
    MIN_PAGE_SCORE,
    TOP_PAGES_LIMIT,
    SCHEMA_VERSION,
    get_spatial_zone,
    normalize_slug,
)
from utils.ids import make_id
from utils.text import (
    slugify,
    clean_text,
    extract_domain,
    normalize_url,
    truncate,
    clean_markdown_text,
    strip_navigation_header,
)
from utils.dates import now_iso
from utils.enums import map_machine_kind, map_machine_state, map_source_type
from knowledge_base import (
    get_celestial_body,
    get_all_celestial_bodies,
    MACHINES_METADATA,
)
from extractors.facts import extract_machine_facts
from extractors.events import extract_machine_events
from extractors.media import extract_machine_images


def _select_best_pages(pages: list[dict]) -> list[dict]:
    """Return top scored successful pages, sorted descending by score."""
    successful = [p for p in pages if p.get("success") and p.get("status_code") == 200]
    scored = [p for p in successful if p.get("score") is not None and p["score"] >= MIN_PAGE_SCORE]
    scored.sort(key=lambda p: p["score"], reverse=True)
    unscored = [p for p in successful if p.get("score") is None]
    return (scored + unscored)[:TOP_PAGES_LIMIT]


def _build_combined_content(best_pages: list[dict]) -> str:
    """Concatenate cleaned content of the best pages into a single string."""
    parts: list[str] = []
    for page in best_pages:
        content = (page.get("content") or "").strip()
        cleaned = clean_markdown_text(strip_navigation_header(content))
        if cleaned:
            parts.append(cleaned)
    return "\n\n---PAGE---\n\n".join(parts)


def _build_sources(pages: list[dict], machine_id: str) -> tuple[list[dict], dict[str, str], str]:
    """
    Build MachineSource records from crawled pages.

    Returns
    -------
    tuple[list[dict], dict[str, str], str]
        (sources_list, url_to_source_id_map, default_source_id)
    """
    sources: list[dict] = []
    url_map: dict[str, str] = {}
    seen_urls: set[str] = set()

    for idx, page in enumerate(pages):
        if not page.get("success"):
            continue
        url = normalize_url(page.get("url") or "")
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)

        title = clean_text(page.get("title") or "") or url
        # Strip redundant trailing suffixes
        clean_title = re.sub(r"\s*[\-–|]\s*(NASA|NASA Science|NASA\.gov|NSSDCA).*$", "", title, flags=re.IGNORECASE).strip()
        if not clean_title:
            clean_title = title

        domain = extract_domain(url)
        publisher = "NASA Science" if "science.nasa.gov" in domain else ("NASA NSSDCA" if "nssdc" in domain else "NASA")

        source_id = make_id("machine_source", machine_id, url)
        url_map[url] = source_id

        sources.append({
            "id": source_id,
            "machineId": machine_id,
            "title": truncate(clean_title, 255),
            "publisher": publisher,
            "url": url,
        })

    # Fallback default source if no pages were successful
    default_source_id = sources[0]["id"] if sources else make_id("machine_source", machine_id, "https://www.nasa.gov")
    if not sources:
        sources.append({
            "id": default_source_id,
            "machineId": machine_id,
            "title": "NASA Official Space Science Archive",
            "publisher": "NASA",
            "url": "https://www.nasa.gov",
        })

    return sources, url_map, default_source_id


def process_spacecraft(raw_data: dict) -> tuple[dict, dict]:
    """
    Process one raw spacecraft JSON dataset into Prisma models.

    Parameters
    ----------
    raw_data:
        The deserialized JSON dict containing 'resource', 'pages', etc.

    Returns
    -------
    tuple[dict, dict]
        - dataset: dict with keys 'metadata' and 'data' containing the 6 models:
          CelestialBody, Machine, MachineSource, MachineFact, MachineEvent, MachineImage
        - images_catalog: companion images catalog dict for images.json
    """
    resource = raw_data.get("resource", {})
    pages = raw_data.get("pages", [])

    output_name = resource.get("output_name", "")
    if not output_name and "link" in resource:
        # Fallback from link
        link = resource["link"]
        output_name = link.rstrip("/").split("/")[-1]

    norm_slug = normalize_slug(output_name)

    # Get authoritative baseline metadata
    meta = MACHINES_METADATA.get(norm_slug)
    if not meta:
        # Construct dynamic fallback for any unexpected slug
        body_slug = "moon" if "moon" in norm_slug or "lunar" in norm_slug else ("mars" if "mars" in norm_slug else "deep-space")
        meta = {
            "name": output_name.replace("_", " ").replace("-", " ").title(),
            "bodySlug": body_slug,
            "kind": map_machine_kind(norm_slug),
            "state": map_machine_state(norm_slug),
            "stateSince": "2000-01-01",
            "launchYear": 2000,
            "arrivalYear": 2000,
            "latitude": None,
            "longitude": None,
            "summary": f"NASA exploration hardware {output_name}.",
            "description": f"NASA space exploration asset {output_name}.",
            "missionPurpose": "Scientific exploration and technology demonstration.",
            "howItWorked": "Equipped with scientific instrumentation and communications.",
            "discoveries": "Returned valuable scientific data and operational experience.",
            "currentStatusNote": "Preserved at mission site or in space trajectory.",
            "baselineFacts": [],
            "baselineEvents": [],
        }

    # 1. CelestialBody
    celestial_body = get_celestial_body(meta["bodySlug"])
    celestial_bodies = [celestial_body]

    # 2. Machine
    machine_id = make_id("machine", norm_slug)
    ts = now_iso()

    # Determine description: enrich with high quality narrative from best pages if available
    best_pages = _select_best_pages(pages)
    combined_content = _build_combined_content(best_pages)

    description = meta["description"]
    # If the combined content has deep detailed text, we ensure it's integrated
    if combined_content and len(combined_content) > 300:
        cleaned_paras = [p.strip() for p in combined_content.split("\n\n") if len(p.strip()) > 80]
        if cleaned_paras and len(cleaned_paras[0]) > 100:
            # Prepend or blend if complementary
            first_para = cleaned_paras[0]
            if first_para[:50].lower() not in description.lower():
                description = f"{description}\n\n{first_para}"

    machine = {
        "id": machine_id,
        "slug": norm_slug,
        "bodyId": celestial_body["id"],
        "name": meta["name"],
        "kind": meta["kind"],
        "state": meta["state"],
        "stateSince": meta["stateSince"],
        "launchYear": meta["launchYear"],
        "arrivalYear": meta["arrivalYear"],
        "summary": meta["summary"],
        "description": description,
        "missionPurpose": meta["missionPurpose"],
        "howItWorked": meta["howItWorked"],
        "discoveries": meta["discoveries"],
        "currentStatusNote": meta["currentStatusNote"],
        "latitude": meta["latitude"],
        "longitude": meta["longitude"],
        "isPublished": True,
        "createdAt": ts,
        "updatedAt": ts,
    }

    # 3. MachineSource
    sources, source_id_map, default_source_id = _build_sources(pages, machine_id)

    # 4. MachineFact
    facts = extract_machine_facts(
        pages=pages,
        machine_id=machine_id,
        machine_name=meta["name"],
        source_id_map=source_id_map,
        default_source_id=default_source_id,
        baseline_facts=meta.get("baselineFacts", []),
    )

    # 5. MachineEvent
    events = extract_machine_events(
        pages=pages,
        machine_id=machine_id,
        machine_name=meta["name"],
        source_id_map=source_id_map,
        default_source_id=default_source_id,
        baseline_events=meta.get("baselineEvents", []),
    )

    # 6. MachineImage
    images, images_catalog = extract_machine_images(
        pages=pages,
        machine_id=machine_id,
        machine_name=meta["name"],
        machine_slug=norm_slug,
    )

    dataset = {
        "metadata": {
            "slug": norm_slug,
            "machineName": meta["name"],
            "schemaVersion": SCHEMA_VERSION,
            "spatialZone": get_spatial_zone(norm_slug),
            "generatedAt": ts,
        },
        "data": {
            "CelestialBody": celestial_bodies,
            "Machine": [machine],
            "MachineSource": sources,
            "MachineFact": facts,
            "MachineEvent": events,
            "MachineImage": images,
        },
    }

    return dataset, images_catalog
