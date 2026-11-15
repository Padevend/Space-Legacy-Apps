# Stage 2: Data Processing (`data-processing`)

The `data-processing` module is the 2nd stage of the **SPACE LEGACY** data pipeline. It reads raw crawled JSON data from `data-ingestion/results/json/`, extracts verified machines, celestial bodies, mission timeline events, technical specifications/facts, media images, and sources, normalizes and cleans markdown text, and outputs strict bulk datasets adhering to `schema.prisma`.

---

## Core Principles & Guarantees

1. **Strict Raw Data Provenance (Zero Fabrication)**:
   - Every single data point (machine name, descriptions, timeline events, specifications, media) is extracted strictly from the raw data files produced by Stage 1 and verified NASA mission records.
   - Absolutely zero fictional content.
   - Zero null values across the 6 considered core models: all required and optional columns (`stateSince`, `launchYear`, `arrivalYear`, `coordinates`, `units`, `dateIso`) are populated wherever determinable.

2. **Full Prisma Schema Compliance (6 Core Models)**:
   - **`CelestialBody` (`celestial_bodies`)**: 5 canonical bodies (Moon, Mars, Ceres, 433 Eros, Deep Space).
   - **`Machine` (`machines`)**: 13 cataloged spacecraft/machines with complete narrative fields (`summary`, `description`, `missionPurpose`, `howItWorked`, `discoveries`, `currentStatusNote`, `latitude`, `longitude`, `launchYear`, `arrivalYear`).
   - **`MachineSource` (`machine_sources`)**: Authoritative NASA source URLs for each machine.
   - **`MachineFact` (`machine_facts`)**: Technical specifications, measurements, and metrics with parsed units.
   - **`MachineEvent` (`machine_events`)**: Chronological timeline milestones with ISO 8601 timestamps (`dateIso`).
   - **`MachineImage` (`machine_images`)**: Authentic mission images categorized by `MediaLabel` (`REAL_PHOTO`, `RECONSTRUCTION`, `DATA_CHART`).

3. **Markdown Sanitization & Image Registry**:
   - Strips raw markdown image tags (`![alt](url)`), link wrappers (`[text](url)` $\rightarrow$ `text`), and crawler navigation boilerplate.
   - Outputs both:
     - `results/<slug>/spacecraft_bulk.json` (bulk relational models)
     - `results/<slug>/images.json` (standalone image catalog)

4. **Zero External Dependencies**:
   - Implemented exclusively using the Python standard library (`json`, `re`, `uuid`, `pathlib`, `urllib`, `datetime`, `decimal`, `hashlib`, `logging`).

---

## Directory Structure

```text
data-processing/
├── config.py           # Inherits from global_config.py (paths, UUID namespace, thresholds)
├── main.py             # CLI orchestrator & validation summary reporter
├── knowledge_base.py   # Baseline verified NASA metadata for 13 machines & 5 celestial bodies
├── extractors/         # Domain-specific feature extractors
│   ├── facts.py        # Technical specs, measurements, and unit extraction
│   ├── events.py       # Timeline milestones & ISO date parser
│   └── media.py        # Authentic NASA image extractor (skips icons/thumbnails)
├── processors/
│   └── spacecraft_processor.py # Primary orchestrator per spacecraft
├── validators/
│   └── output_validator.py     # Strict Prisma schema validator (UUID v5, Enums, FKs)
└── utils/
    ├── dates.py        # Multi-format date parsing & ISO string generation
    ├── enums.py        # MachineKind, MachineState, MediaLabel enum mappers
    ├── ids.py          # Deterministic UUID v5 generator
    └── text.py         # Markdown cleaner, slugifier, domain extractor
```

---

## Usage

```bash
# Process all 13 cataloged spacecraft
python3 data-processing/main.py

# Process specific zones or targets
python3 data-processing/main.py --zone MOON MARS
python3 data-processing/main.py --target ingenuity apollo-lunar-modules
```
