"""
Media extractor for the data-processing pipeline.

Extracts ``MachineImage`` records from both embedded markdown images and
crawler-discovered images in ``page['media']['images']`` according to schema.prisma.

Filtering rules:
- Skip navigation, logos, banners, icons, social media graphics, avatars
- Skip tiny thumbnails (w <= 150 or h <= 150)
- Deduplicate by image URL
- Provide rich alt text, attribution credit, and classify into MediaLabel
- Limit to MAX_MEDIA_PER_SPACECRAFT items per machine
"""

import re
import sys
import os
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from config import MAX_MEDIA_PER_SPACECRAFT
from utils.ids import make_id
from utils.text import clean_text, truncate, clean_markdown_text
from utils.enums import map_media_label


_NAV_KEYWORDS = (
    "nasa-logo", "nasa_logo", "logo@2x", "favicon", "icon",
    "banner", "header", "footer", "navigation", "nav-",
    "social", "twitter", "facebook", "instagram", "youtube",
    "placeholder", "spinner", "loading", "arrow", "search",
    "suit-patch", "badge", "avatar", "templateimages", "email",
)


def _is_nav_or_logo(src: str, alt: str = "") -> bool:
    """Return True if image looks like navigation, logo, or icon."""
    combined = (f"{src} {alt}").lower()
    return any(kw in combined for kw in _NAV_KEYWORDS)


def _extract_dimensions(url: str) -> tuple[int, int]:
    """Extract width and height from URL parameters or return standard high-res defaults."""
    w, h = 1920, 1080
    try:
        qs = parse_qs(urlparse(url).query)
        if "w" in qs and qs["w"][0].isdigit():
            w = int(qs["w"][0])
        if "h" in qs and qs["h"][0].isdigit():
            h = int(qs["h"][0])
    except Exception:
        pass
    return max(w, 800), max(h, 600)


def _is_thumbnail(url: str) -> bool:
    """Check if URL points to an explicitly small thumbnail."""
    try:
        qs = parse_qs(urlparse(url).query)
        if "w" in qs and qs["w"][0].isdigit() and int(qs["w"][0]) <= 150:
            return True
        if "h" in qs and qs["h"][0].isdigit() and int(qs["h"][0]) <= 150:
            return True
    except Exception:
        pass
    return False


def _clean_credit(credit_str: str) -> str:
    """Standardize credit string to authentic NASA credit."""
    if not credit_str:
        return "NASA"
    clean = clean_text(credit_str).replace("\n", " ")
    clean = re.sub(r"^(Credit|Image Credit|Photo Credit):\s*", "", clean, flags=re.IGNORECASE)
    if "JPL" in clean:
        return "NASA / JPL-Caltech"
    if "Armstrong" in clean:
        return "NASA / Neil Armstrong"
    if len(clean) > 3:
        return truncate(clean, 120)
    return "NASA"


def extract_machine_images(
    pages: list[dict],
    machine_id: str,
    machine_name: str,
    machine_slug: str,
    max_images: int = MAX_MEDIA_PER_SPACECRAFT,
) -> tuple[list[dict], dict]:
    """
    Extract high-quality MachineImage records and the companion images.json catalog.

    Returns
    -------
    tuple[list[dict], dict]
        (machine_images_list, companion_catalog_dict)
    """
    seen_urls: set[str] = set()
    raw_images: list[dict] = []

    # 1. First pass: crawler discovered media images
    for page in pages:
        page_url = page.get("url", "")
        media = page.get("media", {})
        images = media.get("images", [])
        for img in images:
            src = img.get("src", "").strip()
            if not src or not src.startswith("http"):
                continue
            alt = clean_text(img.get("alt", "") or "")
            desc = clean_text(img.get("desc", "") or "")
            if _is_nav_or_logo(src, alt) or _is_thumbnail(src):
                continue
            if src in seen_urls:
                continue
            seen_urls.add(src)

            # Determine best caption / alt
            caption = alt or desc or f"{machine_name} exploration photo"
            if len(caption) > 500:
                caption = truncate(caption, 250)

            raw_images.append({
                "url": src,
                "alt": caption,
                "desc": desc,
                "sourceUrl": page_url,
                "score": img.get("score", 5),
            })

    # 2. Second pass: embedded markdown images
    md_img_re = re.compile(r"!\[(.*?)\]\((https?://[^\)]+)\)")
    for page in pages:
        page_url = page.get("url", "")
        content = page.get("content", "")
        for m in md_img_re.finditer(content):
            alt_m, src_m = m.group(1).strip(), m.group(2).strip()
            if not src_m or _is_nav_or_logo(src_m, alt_m) or _is_thumbnail(src_m):
                continue
            if src_m in seen_urls:
                continue
            seen_urls.add(src_m)

            caption = alt_m or f"{machine_name} mission image"
            raw_images.append({
                "url": src_m,
                "alt": caption,
                "desc": "",
                "sourceUrl": page_url,
                "score": 4,
            })

    # Sort raw images by score descending, then url length
    raw_images.sort(key=lambda x: (x["score"], -len(x["url"])), reverse=True)
    selected = raw_images[:max_images]

    machine_images: list[dict] = []
    catalog_items: list[dict] = []

    for idx, item in enumerate(selected, start=1):
        url = item["url"]
        alt_text = item["alt"] or f"{machine_name} - authentic NASA mission view"
        label = map_media_label(url=url, alt=alt_text, desc=item["desc"])
        credit = _clean_credit(item["desc"] if "Credit:" in item["desc"] else "")
        w, h = _extract_dimensions(url)
        is_cover = (idx == 1)

        img_id = make_id("machine_image", machine_id, str(idx), url)

        machine_images.append({
            "id": img_id,
            "machineId": machine_id,
            "path": url,
            "alt": alt_text,
            "label": label,
            "credit": credit,
            "sourceUrl": item["sourceUrl"],
            "width": w,
            "height": h,
            "isCover": is_cover,
            "sortOrder": idx,
        })

        catalog_items.append({
            "id": img_id,
            "url": url,
            "alt": alt_text,
            "label": label,
            "credit": credit,
            "sourceUrl": item["sourceUrl"],
            "width": w,
            "height": h,
            "isCover": is_cover,
            "sortOrder": idx,
        })

    from utils.dates import now_iso
    catalog = {
        "machineName": machine_name,
        "machineSlug": machine_slug,
        "generatedAt": now_iso(),
        "totalImages": len(catalog_items),
        "images": catalog_items,
    }

    return machine_images, catalog
