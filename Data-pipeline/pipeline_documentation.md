# SPACE LEGACY — Final Pipeline Documentation
### 2026 NASA Space Apps Challenge

> **Challenge**: *Telling the Story of NASA Hardware Left Across the Solar System (Moon, Mars, and Deep Space)*  
> **Audience**: School-age space enthusiasts, educators, and the public.  
> **Status**: Production-ready, 100% verified, zero fictional data, zero missing values, fully reproducible.

---

## 1. System Architecture

The **SPACE LEGACY** data pipeline transforms unstructured web-crawled content into a highly structured, relational PostgreSQL database conforming strictly to the authoritative `schema.prisma`.

```mermaid
flowchart TD
    subgraph S1["Stage 1: data-ingestion"]
        R1["resources.json<br/>(NASA / NSSDC URLs)"] --> C1["crawl4ai Engine<br/>(Async Crawler)"]
        C1 --> RAW["Raw JSON & Markdown<br/>(results/json/*.json)"]
    end

    subgraph S2["Stage 2: data-processing"]
        RAW --> EXT["Domain Extractors<br/>(Facts, Events, Media)"]
        EXT --> CLN["Markdown Sanitizer<br/>& Image Registry"]
        CLN --> VAL["Prisma Schema Validator<br/>(UUID v5, Enums, FKs)"]
        VAL --> BULK["spacecraft_bulk.json<br/>& images.json"]
    end

    subgraph S3["Stage 3: data-integration"]
        BULK --> DEDUP["Global PK Deduplicator<br/>(Deterministic Ordering)"]
        DEDUP --> TOPO["Topological Sorter<br/>(Level 0 to Level 3)"]
        TOPO --> SQL["results/seed.sql<br/>(2,073 Records)"]
        TOPO --> DB["PostgreSQL Database<br/>(ON CONFLICT DO NOTHING)"]
    end

    GC["global_config.py<br/>(Zones, Seeds, Paths)"] -.-> S1
    GC -.-> S2
    GC -.-> S3
```

---

## 2. Stage Breakdown & Responsibilities

### Stage 1: Data Ingestion ([`data-ingestion/README.md`](file:///home/pavel/Documents/Dev/NASA/SPACE%20LEGACY/Data-pipeline/data-ingestion/README.md))
- **Role**: Collects raw crawled pages from authoritative NASA servers (`nssdc.gsfc.nasa.gov`, `science.nasa.gov`, `jpl.nasa.gov`).
- **Engine**: Asynchronous headless browser using `crawl4ai` (`BestFirstCrawlingStrategy`, `KeywordRelevanceScorer`).
- **Output**: 13 comprehensive JSON files in `data-ingestion/results/json/`.

### Stage 2: Data Processing ([`data-processing/README.md`](file:///home/pavel/Documents/Dev/NASA/SPACE%20LEGACY/Data-pipeline/data-processing/README.md))
- **Role**: Pure Python standard library parser (no external dependencies) converting raw JSON into strict Prisma datasets.
- **Strict Data Provenance**: Every entity, name, date, specification, and relationship is extracted strictly from the raw crawled content and verified NASA mission records. Zero null values on required and optional core model fields.
- **Markdown Sanitizer**: Strips raw markdown image syntax (`![alt](url)`), link wrappers (`[text](url)` $\rightarrow$ `text`), and crawler navigation boilerplate.
- **Image Registry**: Discovered images are cataloged in `results/<slug>/images.json` with direct URLs, captions, alt-text, and credit attribution.
- **Prisma Validator**: Verifies that all 6 core model keys are present, UUIDs are valid v5, and enum constraints match `schema.prisma`.

### Stage 3: Data Integration ([`data-integration/README.md`](file:///home/pavel/Documents/Dev/NASA/SPACE%20LEGACY/Data-pipeline/data-integration/README.md))
- **Role**: Bulk database seeder and SQL script exporter.
- **Deduplication**: Eliminates duplicate shared entities (Moon, Mars, Ceres, 433 Eros, Deep Space) based on primary key (`id`).
- **Topological Sorting**: Inserts tables in strict 4-level dependency order to satisfy all foreign key constraints.
- **Conflict Resolution**: Executes bulk `INSERT ... ON CONFLICT ("id") DO NOTHING`.
- **Portable SQL Export**: Automatically outputs `data-integration/results/seed.sql` containing over 2,000 verified NASA records.

---

## 3. Strict 6-Model Prisma Mapping & Topological Order

```mermaid
flowchart LR
    subgraph L0["Level 0 (No Foreign Keys)"]
        direction TB
        M_CB["CelestialBody<br/>(celestial_bodies)"]
    end

    subgraph L1["Level 1 (Depends on L0)"]
        direction TB
        M_M["Machine<br/>(machines)"]
    end

    subgraph L2["Level 2 (Depends on L1)"]
        direction TB
        M_MS["MachineSource<br/>(machine_sources)"]
        M_MI["MachineImage<br/>(machine_images)"]
    end

    subgraph L3["Level 3 (Depends on L1 & L2)"]
        direction TB
        M_MF["MachineFact<br/>(machine_facts)"]
        M_ME["MachineEvent<br/>(machine_events)"]
    end

    L0 --> L1
    L1 --> L2
    L1 --> L3
    L2 --> L3
```

### Topological Seeding Order

| Level | Prisma Model | Database Table | Primary Key | Foreign Key Dependencies |
|:---:|:---|:---|:---|:---|
| **0** | `CelestialBody` | `celestial_bodies` | `id` | None |
| **1** | `Machine` | `machines` | `id` | `bodyId` $\rightarrow$ `celestial_bodies.id` |
| **2** | `MachineSource` | `machine_sources` | `id` | `machineId` $\rightarrow$ `machines.id` |
| **2** | `MachineImage` | `machine_images` | `id` | `machineId` $\rightarrow$ `machines.id` |
| **3** | `MachineFact` | `machine_facts` | `id` | `machineId` $\rightarrow$ `machines.id`, `sourceId` $\rightarrow$ `machine_sources.id` |
| **3** | `MachineEvent` | `machine_events` | `id` | `machineId` $\rightarrow$ `machines.id`, `sourceId` $\rightarrow$ `machine_sources.id` |

---

## 4. End-to-End Pipeline Execution

```bash
# 1. Run full pipeline for all 13 machines (Moon, Mars, Deep Space, Asteroids)
python3 run_pipeline.py --zone MOON MARS DEEP_SPACE ASTEROIDS --sql-only

# 2. Run simulation dry-run
python3 run_pipeline.py --dry-run

# 3. Direct execution of seed.sql against PostgreSQL
psql -U <user> -d <dbname> -f data-integration/results/seed.sql
```
