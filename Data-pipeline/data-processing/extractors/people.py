"""
People extractor for the data-processing pipeline.

Extracts ``Person``, ``MissionPerson``, and ``EquipmentPerson`` records
when identifiable people (astronauts, program managers, scientists)
are explicitly referenced in the raw data.

No third-party libraries — stdlib only.
"""

import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.ids import make_id
from utils.text import clean_text, truncate


def extract_people(
    content: str,
    mission_id: str,
    equipment_id: str,
) -> tuple[list[dict], list[dict], list[dict]]:
    """
    Extract Person, MissionPerson, and EquipmentPerson records.

    Parameters
    ----------
    content:
        Primary page text content.
    mission_id:
        UUID of the associated Mission.
    equipment_id:
        UUID of the associated Equipment.

    Returns
    -------
    tuple[list[dict], list[dict], list[dict]]
        (people, mission_people, equipment_people)
    """
    people: list[dict] = []
    mission_people: list[dict] = []
    equipment_people: list[dict] = []
    seen_names: set[str] = set()

    # 1. Astronauts in Apollo descriptions
    # Matches: Commander Neil A. Armstrong and LM pilot Edwin E. "Buzz" Aldrin, Jr.
    a_match = re.search(
        r"two astronauts,\s+Commander\s+([^,]+?)\s+and\s+LM\s+pilot\s+([^,]+(?:,\s*Jr\.)?),\s*the",
        content,
    )
    if a_match:
        commander = clean_text(a_match.group(1).strip())
        pilot = clean_text(a_match.group(2).strip())
        astronaut_pairs = [
            (commander, "Commander"),
            (pilot, "Lunar Module Pilot"),
        ]
        for name, role in astronaut_pairs:
            if name and name not in seen_names:
                seen_names.add(name)
                pid = make_id("person", name)
                people.append(
                    {
                        "personId": pid,
                        "fullName": name,
                        "biography": None,
                        "affiliation": "NASA",
                    }
                )
                mission_people.append(
                    {
                        "missionId": mission_id,
                        "personId": pid,
                        "roleInMission": role,
                    }
                )
                equipment_people.append(
                    {
                        "equipmentId": equipment_id,
                        "personId": pid,
                        "roleInEquipment": role,
                    }
                )

    # 2. NSSDC Personnel table
    # Pattern: ## Personnel \n | Name | Role | Affiliation | Email |
    t_match = re.search(
        r"## Personnel\s*\n\s*\|[^\n]+\|\s*\n\s*\|[^\n]+\|\s*\n((?:\|[^\n]+\|\s*\n)+)",
        content,
    )
    if t_match:
        for row in t_match.group(1).strip().split("\n"):
            cols = [c.strip() for c in row.strip("|").split("|")]
            if not cols or not cols[0]:
                continue
            raw_name = cols[0]
            clean_name = re.sub(r"^(Mr\.|Dr\.|Ms\.|Mrs\.)\s+", "", raw_name).strip()
            role = cols[1] if len(cols) > 1 and cols[1] else "Personnel"
            affil = cols[2] if len(cols) > 2 and cols[2] else "NASA"
            if clean_name and clean_name not in seen_names:
                seen_names.add(clean_name)
                pid = make_id("person", clean_name)
                people.append(
                    {
                        "personId": pid,
                        "fullName": clean_name,
                        "biography": None,
                        "affiliation": affil,
                    }
                )
                mission_people.append(
                    {
                        "missionId": mission_id,
                        "personId": pid,
                        "roleInMission": role,
                    }
                )
                equipment_people.append(
                    {
                        "equipmentId": equipment_id,
                        "personId": pid,
                        "roleInEquipment": role,
                    }
                )

    return people, mission_people, equipment_people
