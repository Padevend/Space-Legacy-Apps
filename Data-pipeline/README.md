# SPACE LEGACY — Data Pipeline
### 2026 NASA Space Apps Challenge

> **Challenge Focus**: *Telling the Story of NASA Hardware Left Across the Solar System (Moon, Mars, and Deep Space)*  
> **Audience**: School-age space enthusiasts, educators, and the public.  
> **Objective**: Bringing silent and historic robotic explorers and surface monuments back to life through authentic historical data, clean markdown processing, and structured Prisma database integration.

---

## Architecture Overview

The pipeline is structured into three independent, decoupled, and 100% reproducible stages:

```
Data-pipeline/
├── global_config.py          # Central authority for zones, reproducibility seeds, and paths
├── run_pipeline.py           # Master runner orchestrating stages end-to-end
├── schema.prisma             # Authoritative Prisma database schema
│
├── data-ingestion/           # Stage 1: Collects raw crawling data from NASA/NSSDC
│   ├── README.md             # Stage 1 Documentation
│   ├── resources.json        # Seed URLs and keyword targets
│   ├── main.py               # Asynchronous crawl4ai crawler
│   └── results/json/         # Raw JSON files (13 spacecraft)
│
├── data-processing/          # Stage 2: Normalizes data, cleans markdown, generates images.json
│   ├── README.md             # Stage 2 Documentation
│   ├── config.py             # Inherits from global_config.py
│   ├── knowledge_base.py     # Authoritative metadata for 13 machines & 5 celestial bodies
│   ├── main.py               # Orchestrator & Prisma validator
│   ├── extractors/           # Domain extractors (facts, events, media)
│   ├── processors/           # Coordinates extraction and assembling
│   ├── validators/           # Strict Prisma schema validator
│   └── results/<slug>/
│       ├── spacecraft_bulk.json   # 6 core Prisma models with 100% authentic data
│       └── images.json            # Catalog of direct image URLs and captions
│
└── data-integration/         # Stage 3: Topologically ordered bulk PostgreSQL seeder
    ├── README.md             # Stage 3 Documentation
    ├── config.py             # Inherits from global_config.py & parses DB parameters
    ├── database.py           # Connection manager & execute_values bulk inserter
    ├── schema_meta.py        # Table mappings (@@map), PKs, topological order
    ├── seeder.py             # Global deduplicator & bulk SQL generator
    ├── main.py               # CLI entry point
    └── results/
        └── seed.sql          # 100% self-contained SQL script (2,073 records)
```

---

## The 3 Independent Pipeline Stages

### Stage 1: `data-ingestion`
Crawls NASA Science and NSSDC archives using headless browser scraping with `crawl4ai`. Produces 13 JSON files in `data-ingestion/results/json/`.

### Stage 2: `data-processing`
Parses raw JSON files using pure Python stdlib. Extracts:
- `CelestialBody` (Moon, Mars, Ceres, 433 Eros, Deep Space)
- `Machine` (13 cataloged machines)
- `MachineSource` (authoritative source links)
- `MachineFact` (technical specifications and measurements)
- `MachineEvent` (chronological timeline milestones with ISO dates)
- `MachineImage` (curated authentic mission photography)

### Stage 3: `data-integration`
Topologically deduplicates entities and generates `data-integration/results/seed.sql` for PostgreSQL bulk seeding with `ON CONFLICT ("id") DO NOTHING;`.

---

## Quick Start

```bash
# Generate full SQL seed script for all 13 machines across all 4 spatial zones:
python3 run_pipeline.py --zone MOON MARS DEEP_SPACE ASTEROIDS --sql-only

# Dry-run validation of the pipeline:
python3 run_pipeline.py --dry-run
```
