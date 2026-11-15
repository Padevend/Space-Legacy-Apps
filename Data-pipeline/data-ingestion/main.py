
import asyncio
import json
import re

from pathlib import Path
from datetime import datetime, timezone

from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CrawlerRunConfig
)

from crawl4ai.deep_crawling import BestFirstCrawlingStrategy
from crawl4ai.deep_crawling.scorers import KeywordRelevanceScorer


# ==========================================
# CONFIGURATION
# ==========================================

INPUT_FILE = Path("resources.json")

OUTPUT_DIR = Path("results")

MAX_DEPTH = 3
MAX_PAGES = 50

# ==========================================
# STORAGE
# ==========================================

def prepare_storage():

    for directory in [
        OUTPUT_DIR / "markdown",
        OUTPUT_DIR / "json",
        OUTPUT_DIR / "logs"
    ]:
        directory.mkdir(parents=True, exist_ok=True)


def save_json(data, path):

    with open(path, "w", encoding="utf-8") as file:

        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=4,
            default=str
        )


def save_markdown(content, path):

    with open(path, "w", encoding="utf-8") as file:
        file.write(content)


def get_markdown(result):

    markdown = result.markdown

    if markdown is None:
        return ""

    if hasattr(markdown, "raw_markdown"):
        return markdown.raw_markdown

    return str(markdown)


# ==========================================
# INPUT
# ==========================================

def load_resources():

    with open(INPUT_FILE, "r", encoding="utf-8") as file:

        resources = json.load(file)

    if not isinstance(resources, list):
        raise ValueError("Le fichier JSON doit contenir un tableau.")

    for index, resource in enumerate(resources):

        if not isinstance(resource, dict):
            raise ValueError(f"Ressource invalide à l'index {index}")

        if not resource.get("link"):
            raise ValueError(f"URL manquante à l'index {index}")

        if not resource.get("output_name"):
            raise ValueError(f"output_name manquant à l'index {index}")

        if not isinstance(resource.get("target"), list):
            raise ValueError(f"target doit être un tableau à l'index {index}")

        if not all(isinstance(tag, str) for tag in resource["target"]):
            raise ValueError(f"Les mots-clés doivent être des chaînes à l'index {index}")

    return resources


# ==========================================
# CRAWLING ENGINE
# ==========================================

async def crawl_resource(crawler, resource):

    url = resource["link"]
    targets = resource["target"]

    output_name = resource["output_name"]

    # Sécurisation du nom de sortie
    if not re.fullmatch(r"[a-zA-Z0-9_-]+", output_name):
        raise ValueError(f"Nom de sortie invalide : {output_name}")

    print(f"\n{'=' * 60}")
    print(f"RESOURCE : {output_name}")
    print(f"URL      : {url}")
    print(f"TARGETS  : {targets}")
    print(f"{'=' * 60}")

    # Scoring des pages
    scorer = KeywordRelevanceScorer(
        keywords=targets,
        weight=0.7
    )

    # Stratégie de crawling
    strategy = BestFirstCrawlingStrategy(
        max_depth=MAX_DEPTH,
        include_external=False,
        max_pages=MAX_PAGES,
        url_scorer=scorer
    )

    # Configuration
    config = CrawlerRunConfig(
        deep_crawl_strategy=strategy,
        stream=True,
        word_count_threshold=10,
        page_timeout=45000,
        verbose=False
    )

    pages = []
    markdown_parts = []

    success_count = 0
    error_count = 0

    # Crawling
    results = await crawler.arun(
        url=url,
        config=config
    )

    async for result in results:

        page_data = {
            "url": result.url,
            "success": result.success,
            "status_code": result.status_code,
            "fetched_at": datetime.now(timezone.utc).isoformat()
        }

        if result.success:

            content = get_markdown(result)

            page_data.update({
                "title": result.metadata.get("title", "")
                if result.metadata else "",
                "score": result.metadata.get("score")
                if result.metadata else None,
                "content": content,
                "links": result.links,
                "media": result.media
            })

            markdown_parts.append(
                f"# {result.metadata.get('title', result.url) if result.metadata else result.url}\n\n"
                f"Source: {result.url}\n\n"
                f"{content}\n"
            )

            success_count += 1

            print(f"[OK] {result.url}")

        else:

            page_data["error"] = result.error_message

            error_count += 1

            print(f"[ERROR] {result.url}")
            print(result.error_message)

        pages.append(page_data)

    # ======================================
    # SAUVEGARDE
    # ======================================

    markdown_path = (
        OUTPUT_DIR / "markdown" / f"{output_name}.md"
    )

    json_path = (
        OUTPUT_DIR / "json" / f"{output_name}.json"
    )

    # Document Markdown consolidé
    save_markdown(
        "\n\n---\n\n".join(markdown_parts),
        markdown_path
    )

    # Document JSON structuré
    output_data = {
        "resource": {
            "link": url,
            "target": targets,
            "output_name": output_name
        },
        "crawling": {
            "max_depth": MAX_DEPTH,
            "max_pages": MAX_PAGES,
            "started_at": datetime.now(timezone.utc).isoformat()
        },
        "statistics": {
            "total_pages": len(pages),
            "successful_pages": success_count,
            "failed_pages": error_count
        },
        "pages": pages
    }

    save_json(output_data, json_path)

    print("\nRESULT")
    print(f"Pages récupérées : {success_count}")
    print(f"Pages échouées   : {error_count}")
    print(f"Markdown         : {markdown_path}")
    print(f"JSON             : {json_path}")


# ==========================================
# MAIN
# ==========================================

async def main():

    prepare_storage()

    resources = load_resources()

    print(f"Nombre de ressources : {len(resources)}")

    browser_config = BrowserConfig(
        headless=True,
        verbose=False
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:

        for resource in resources:

            try:

                await crawl_resource(crawler, resource)

            except Exception as error:

                print(
                    f"\n[RESOURCE ERROR] "
                    f"{resource.get('output_name')}: {error}"
                )

                save_json(
                    {
                        "resource": resource,
                        "error": str(error),
                        "failed_at": datetime.now(timezone.utc).isoformat()
                    },
                    OUTPUT_DIR / "logs" /
                    f"{resource['output_name']}.json"
                )


if __name__ == "__main__":

    asyncio.run(main())
