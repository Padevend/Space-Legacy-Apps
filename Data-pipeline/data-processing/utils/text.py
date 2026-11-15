"""
Text manipulation utilities for the data-processing pipeline.

All functions are pure and dependency-free (stdlib only).
"""

import re
from urllib.parse import urlparse, urlunparse


def slugify(text: str) -> str:
    """
    Convert *text* to a URL-safe slug.

    Rules:
    - Lowercase
    - Replace any run of non-alphanumeric characters with a single hyphen
    - Strip leading/trailing hyphens

    Examples
    --------
    >>> slugify("Mars 2020: Perseverance Rover")
    'mars-2020-perseverance-rover'
    >>> slugify("Ingenuity (Mars Helicopter)")
    'ingenuity-mars-helicopter'
    """
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text


def clean_text(text: str) -> str:
    """
    Strip excess whitespace from *text*.

    Collapses multiple spaces/tabs into one space and normalises
    line endings, while preserving intentional newlines.
    """
    if not text:
        return ""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    lines = [line.strip() for line in text.split("\n")]
    cleaned: list[str] = []
    prev_blank = False
    for line in lines:
        is_blank = line == ""
        if is_blank and prev_blank:
            continue
        cleaned.append(line)
        prev_blank = is_blank
    return "\n".join(cleaned).strip()


def truncate(text: str, max_len: int) -> str:
    """
    Truncate *text* to at most *max_len* characters.

    If truncation is needed, appends ``"…"`` (single unicode ellipsis
    character) so the total length stays at or below *max_len*.
    """
    if not text or len(text) <= max_len:
        return text
    return text[: max_len - 1] + "…"


def normalize_url(url: str) -> str:
    """
    Normalise a URL by stripping trailing slashes and fragments.
    """
    if not url:
        return url
    parsed = urlparse(url.strip())
    path = parsed.path.rstrip("/") or "/"
    normalised = parsed._replace(path=path, fragment="")
    return urlunparse(normalised)


def extract_domain(url: str) -> str:
    """Return the hostname/domain from a URL."""
    if not url:
        return ""
    parsed = urlparse(url)
    return parsed.netloc or url


def strip_markdown_links(text: str) -> str:
    """
    Remove markdown link syntax, keeping only the visible label.

    ``[label](url)`` → ``label``
    ``![alt](url)``  → ``alt``
    """
    # Images first
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    # Regular links
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return text


def strip_navigation_header(text: str) -> str:
    """
    Strip website header navigation and footer boilerplate from markdown text.

    Finds the first top-level heading (# ...) and trims everything before it.
    Also strips trailing footer sections (Discover More, Follow NASA, etc.).
    """
    if not text:
        return ""

    # Look for the primary H1 title
    m = re.search(r"^#\s+[A-Za-z0-9]", text, re.MULTILINE)
    if m:
        text = text[m.start():]

    # Strip footer sections
    footer_markers = [
        "## Discover More Topics",
        "### National Aeronautics and Space",
        "### Follow NASA",
        "Did you find what you were looking for?",
        "## Selected References",
        "## Personnel",
    ]
    for marker in footer_markers:
        pos = text.find(marker)
        if pos != -1:
            text = text[:pos]

    return text.strip()


def clean_markdown_text(text: str) -> str:
    """
    Thoroughly clean markdown content into clean, readable plain text.

    Removes:
    - Linked images: [![alt](img)](link)
    - Standalone images: ![alt](url)
    - Markdown links: [text](url) → text
    - Empty link syntax: [](url)
    - HTML tags
    - Table separator rows (|---|---|)
    - Heading hashes (###, ##, #)
    - Bold and italic markup (*, **, _)
    - Excessive empty lines and whitespace
    """
    if not text:
        return ""

    # Strip linked images first
    text = re.sub(r"\[!\[.*?\]\(.*?\)\]\(.*?\)", "", text)
    # Strip standalone images
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    # Strip markdown links, keeping visible text
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    # Strip empty link leftovers
    text = re.sub(r"\[\s*\]\([^\)]*\)", "", text)
    # Strip HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    # Strip markdown table borders and separator rows
    text = re.sub(r"^\s*\||\|\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-:\s|]{3,}\s*$", "", text, flags=re.MULTILINE)
    # Strip heading symbols
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    # Strip bold / italics
    text = re.sub(r"\*{1,3}|_{1,3}", "", text)
    # Strip horizontal rules
    text = re.sub(r"^[-*_]{3,}\s*$", "", text, flags=re.MULTILINE)
    # Clean up whitespace
    return clean_text(text)


def strip_markdown(text: str) -> str:
    """Alias for clean_markdown_text."""
    return clean_markdown_text(text)
