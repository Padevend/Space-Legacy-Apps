"""
Locations extractor for the data-processing pipeline.

Extracts ``Location`` and ``CelestialBody`` records from crawled content.

No third-party libraries — stdlib only.
"""

import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import clean_text, truncate
from utils.enums import map_celestial_body_type, map_location_type


# ---------------------------------------------------------------------------
# Known celestial bodies (name → type)
# ---------------------------------------------------------------------------
_KNOWN_CELESTIAL_BODIES: list[tuple[str, str]] = [
    ("Mars", "PLANET"),
    ("Moon", "MOON"),
    ("Luna", "MOON"),
    ("Jupiter", "PLANET"),
    ("Saturn", "PLANET"),
    ("Uranus", "PLANET"),
    ("Neptune", "PLANET"),
    ("Earth", "PLANET"),
    ("Sun", "STAR"),
    ("Vesta", "ASTEROID"),
    ("Ceres", "DWARF_PLANET"),
    ("Eros", "ASTEROID"),
    ("Pluto", "DWARF_PLANET"),
    ("Titan", "MOON"),
    ("Europa", "MOON"),
]

# ---------------------------------------------------------------------------
# Known launch sites
# ---------------------------------------------------------------------------
_LAUNCH_SITES: list[tuple[str, str]] = [
    ("Cape Canaveral Air Force Station", "Cape Canaveral Air Force Station, Florida"),
    ("Cape Canaveral Space Force Station", "Cape Canaveral Space Force Station, Florida"),
    ("Kennedy Space Center", "Kennedy Space Center, Florida"),
    ("Vandenberg Air Force Base", "Vandenberg Air Force Base, California"),
    ("Vandenberg Space Force Base", "Vandenberg Space Force Base, California"),
    ("Baikonur Cosmodrome", "Baikonur Cosmodrome, Kazakhstan"),
]

# ---------------------------------------------------------------------------
# Known landing sites (pattern → (name, celestial body))
# ---------------------------------------------------------------------------
_LANDING_SITES: list[tuple[str, str, str]] = [
    # pattern, location_name, body
    (r"Jezero Crater", "Jezero Crater", "Mars"),
    (r"Gusev Crater", "Gusev Crater", "Mars"),
    (r"Meridiani Planum", "Meridiani Planum", "Mars"),
    (r"Elysium Planitia", "Elysium Planitia", "Mars"),
    (r"Chryse Planitia", "Chryse Planitia", "Mars"),
    (r"Ares Vallis", "Ares Vallis", "Mars"),
    (r"Fra Mauro", "Fra Mauro Highlands", "Moon"),
    (r"Mare Tranquillitatis|Sea of Tranquility", "Mare Tranquillitatis", "Moon"),
    (r"Descartes Highlands", "Descartes Highlands", "Moon"),
    (r"Hadley[- ]Apennine", "Hadley–Apennine", "Moon"),
    (r"Taurus[- ]Littrow", "Taurus-Littrow Valley", "Moon"),
    (r"Surveyor[ -]III|Oceanus Procellarum", "Oceanus Procellarum", "Moon"),
    (r"Marius Hills", "Marius Hills", "Moon"),
    (r"Utopia Planitia", "Utopia Planitia", "Mars"),
    (r"Vesta", "Vesta", "Vesta"),
    (r"Ceres", "Ceres", "Ceres"),
    (r"433 Eros|Eros", "433 Eros", "Eros"),
]


def _get_or_create_celestial_body(name: str, body_type: str) -> dict:
    """Create a CelestialBody dict."""
    return {
        "celestialBodyId": make_id("celestial_body", name.lower()),
        "name": name,
        "bodyType": body_type,
        "description": None,
    }


def _get_or_create_location(
    name: str,
    location_type: str,
    celestial_body_id: str | None,
    description: str | None = None,
) -> dict:
    """Create a Location dict."""
    return {
        "locationId": make_id("location", name.lower()),
        "celestialBodyId": celestial_body_id,
        "name": name,
        "locationType": location_type,
        "latitude": None,
        "longitude": None,
        "altitude": None,
        "referenceSystem": None,
        "description": description,
    }


def extract_locations(combined_content: str) -> tuple[list[dict], list[dict]]:
    """
    Extract ``Location`` and ``CelestialBody`` records from content.

    Parameters
    ----------
    combined_content:
        Concatenated text of the top-scored pages.

    Returns
    -------
    tuple[list[dict], list[dict]]
        (locations, celestial_bodies) — each list may be empty.
    """
    locations: list[dict] = []
    celestial_bodies: list[dict] = []
    seen_body_ids: set[str] = set()
    seen_location_ids: set[str] = set()

    def add_body(name: str, body_type: str) -> str | None:
        """Add a CelestialBody and return its ID (or None if duplicate)."""
        body_id = make_id("celestial_body", name.lower())
        if body_id not in seen_body_ids:
            seen_body_ids.add(body_id)
            celestial_bodies.append(_get_or_create_celestial_body(name, body_type))
        return body_id

    def add_location(
        name: str,
        location_type: str,
        celestial_body_id: str | None,
        description: str | None = None,
    ) -> None:
        loc_id = make_id("location", name.lower())
        if loc_id not in seen_location_ids:
            seen_location_ids.add(loc_id)
            locations.append(
                _get_or_create_location(name, location_type, celestial_body_id, description)
            )

    # --- 1. Detect celestial bodies mentioned in content ---
    for body_name, body_type in _KNOWN_CELESTIAL_BODIES:
        # Look for the body name as a standalone word (not part of "Marshall" etc.)
        if re.search(rf"\b{re.escape(body_name)}\b", combined_content, re.IGNORECASE):
            add_body(body_name, body_type)

    # --- 2. Detect launch sites ---
    for pattern, full_name in _LAUNCH_SITES:
        if re.search(re.escape(pattern), combined_content, re.IGNORECASE):
            earth_id = add_body("Earth", "PLANET")
            add_location(full_name, "LAUNCH_SITE", earth_id)

    # --- 3. Detect landing sites ---
    for pattern, loc_name, body_name in _LANDING_SITES:
        if re.search(pattern, combined_content, re.IGNORECASE):
            body_type = map_celestial_body_type(body_name)
            body_id = add_body(body_name, body_type)
            add_location(loc_name, "LANDING_SITE", body_id)

    # --- 4. Detect orbit mentions ---
    orbit_patterns = [
        (r"\bMars orbit\b|\borbit(?:ing)? Mars\b", "Mars Orbit", "Mars"),
        (r"\bEarth orbit\b|\borbit(?:ing)? Earth\b", "Earth Orbit", "Earth"),
        (r"\bJupiter orbit\b|\borbit(?:ing)? Jupiter\b", "Jupiter Orbit", "Jupiter"),
        (r"\bSaturn orbit\b|\borbit(?:ing)? Saturn\b", "Saturn Orbit", "Saturn"),
        (r"\bVesta orbit\b|\borbit(?:ing)? Vesta\b", "Vesta Orbit", "Vesta"),
        (r"\bCeres orbit\b|\borbit(?:ing)? Ceres\b", "Ceres Orbit", "Ceres"),
    ]
    for pattern, loc_name, body_name in orbit_patterns:
        if re.search(pattern, combined_content, re.IGNORECASE):
            body_type = map_celestial_body_type(body_name)
            body_id = add_body(body_name, body_type)
            add_location(loc_name, "ORBIT", body_id)

    return locations, celestial_bodies
