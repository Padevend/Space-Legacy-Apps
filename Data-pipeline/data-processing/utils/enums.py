"""
Enum mapping utilities for the data-processing pipeline.

Maps free-form text clues and machine metadata to valid Prisma schema enums:
- MachineKind: LANDER, ROVER, HELICOPTER, LANDING_CRAFT_STAGE, INSTRUMENT, ORBITER, OTHER
- MachineState: STILL_ACTIVE, STOPPED_ANSWERING, JOB_FINISHED, LEFT_ON_PURPOSE, UNKNOWN
- MediaLabel: REAL_PHOTO, RECONSTRUCTION, AI_ILLUSTRATION, DATA_CHART

Pure Python standard library only.
"""

from typing import Any

# ---------------------------------------------------------------------------
# MachineKind Enum
# ---------------------------------------------------------------------------
MACHINE_KINDS = {
    "LANDER",
    "ROVER",
    "HELICOPTER",
    "LANDING_CRAFT_STAGE",
    "INSTRUMENT",
    "ORBITER",
    "OTHER",
}

def map_machine_kind(slug: str, text: str = "") -> str:
    """
    Map spacecraft slug and descriptive text clues to a valid MachineKind enum.
    """
    norm_slug = (slug or "").lower().replace("_", "-")
    combined = (norm_slug + " " + (text or "")).lower()

    if "helicopter" in combined or "ingenuity" in norm_slug or "rotorcraft" in combined:
        return "HELICOPTER"
    if "lunar-roving" in norm_slug or "spirit" in norm_slug or "opportunity" in norm_slug or "rover" in combined:
        return "ROVER"
    if "apollo-lunar-modules" in norm_slug or "descent stage" in combined or "landing craft" in combined:
        return "LANDING_CRAFT_STAGE"
    if "alsep" in norm_slug or "experiment package" in combined or "instrument package" in combined or "seismometer" in combined:
        return "INSTRUMENT"
    if "dawn" in norm_slug or "kepler" in norm_slug or "telescope" in combined or "orbiter" in combined:
        return "ORBITER"
    if any(k in norm_slug for k in ["surveyor", "viking", "insight", "mars-pathfinder", "near-shoemaker"]) or "lander" in combined:
        return "LANDER"
    if "pioneer" in norm_slug or "flyby" in combined:
        return "OTHER"

    return "OTHER"


# ---------------------------------------------------------------------------
# MachineState Enum
# ---------------------------------------------------------------------------
MACHINE_STATES = {
    "STILL_ACTIVE",
    "STOPPED_ANSWERING",
    "JOB_FINISHED",
    "LEFT_ON_PURPOSE",
    "UNKNOWN",
}

def map_machine_state(slug: str, text: str = "") -> str:
    """
    Map spacecraft slug and text clues to a valid MachineState enum.
    """
    norm_slug = (slug or "").lower().replace("_", "-")
    t = (norm_slug + " " + (text or "")).lower()

    if any(k in norm_slug for k in ["apollo-lunar-modules", "lunar-roving-vehicles"]):
        return "LEFT_ON_PURPOSE"
    if any(k in norm_slug for k in ["alsep-packages", "surveyor-3", "dawn", "near-shoemaker", "kepler", "ingenuity"]):
        return "JOB_FINISHED"
    if any(k in norm_slug for k in ["insight", "spirit-opportunity", "viking-1", "mars-pathfinder", "pioneer-10"]):
        return "STOPPED_ANSWERING"

    if "still active" in t or "operational" in t or "in service" in t:
        return "STILL_ACTIVE"
    if "stopped answering" in t or "lost contact" in t or "signal lost" in t or "ceased operations" in t:
        return "STOPPED_ANSWERING"
    if "completed" in t or "job finished" in t or "decommissioned" in t or "mission ended" in t:
        return "JOB_FINISHED"
    if "left on purpose" in t or "parked" in t:
        return "LEFT_ON_PURPOSE"

    return "UNKNOWN"


# ---------------------------------------------------------------------------
# MediaLabel Enum
# ---------------------------------------------------------------------------
MEDIA_LABELS = {
    "REAL_PHOTO",
    "RECONSTRUCTION",
    "AI_ILLUSTRATION",
    "DATA_CHART",
}

def map_media_label(url: str = "", alt: str = "", desc: str = "") -> str:
    """
    Classify an image into MediaLabel: REAL_PHOTO, RECONSTRUCTION, AI_ILLUSTRATION, DATA_CHART.
    """
    combined = (f"{url} {alt} {desc}").lower()

    # Data charts, maps, diagrams
    chart_keywords = [
        "chart", "diagram", "graph", "plot", "map", "schematic",
        "telemetry", "spectrogram", "curve", "spectrum", "trajectory",
        "cad", "cross-section", "cut-away", "blueprint"
    ]
    if any(k in combined for k in chart_keywords):
        return "DATA_CHART"

    # AI illustrations
    if "ai " in combined or "ai-generated" in combined or "artificial intelligence" in combined or "midjourney" in combined:
        return "AI_ILLUSTRATION"

    # Reconstructions, artist concepts, 3D renderings
    recon_keywords = [
        "concept", "illustration", "artist", "rendering", "reconstruction",
        "3d", "model", "simulation", "depiction", "render", "animated", "animation"
    ]
    if any(k in combined for k in recon_keywords):
        return "RECONSTRUCTION"

    # Default to authentic photographic media from NASA
    return "REAL_PHOTO"


# ---------------------------------------------------------------------------
# Legacy compatibility helpers
# ---------------------------------------------------------------------------
def map_source_type(url: str, title: str = "") -> str:
    """Determine publication source type."""
    combined = (f"{url} {title}").lower()
    if "nssdc" in combined or "archive" in combined:
        return "ARCHIVE"
    if "news" in combined or "press" in combined:
        return "NEWS"
    if "jpl.nasa.gov" in combined or "science.nasa.gov" in combined:
        return "MISSION_PAGE"
    return "PRIMARY_SOURCE"
