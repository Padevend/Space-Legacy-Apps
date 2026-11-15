"""
Date parsing utilities for the data-processing pipeline.

All functions operate on plain strings and return values compatible
with the Prisma schema (ISO 8601 date/datetime strings + DatePrecision
enum values).

No third-party libraries — stdlib only.
"""

import re
from datetime import datetime, timezone


# ---------------------------------------------------------------------------
# Public constants (DatePrecision enum values as strings)
# ---------------------------------------------------------------------------
PRECISION_EXACT = "EXACT"
PRECISION_ESTIMATED = "ESTIMATED"
PRECISION_YEAR_ONLY = "YEAR_ONLY"
PRECISION_MONTH_ONLY = "MONTH_ONLY"
PRECISION_UNKNOWN = "UNKNOWN"


# ---------------------------------------------------------------------------
# Month name → number mapping (handles full names and common abbreviations)
# ---------------------------------------------------------------------------
_MONTH_MAP: dict[str, int] = {
    "january": 1, "jan": 1, "jan.": 1,
    "february": 2, "feb": 2, "feb.": 2,
    "march": 3, "mar": 3, "mar.": 3,
    "april": 4, "apr": 4, "apr.": 4,
    "may": 5,
    "june": 6, "jun": 6, "jun.": 6,
    "july": 7, "jul": 7, "jul.": 7,
    "august": 8, "aug": 8, "aug.": 8,
    "september": 9, "sep": 9, "sep.": 9, "sept": 9, "sept.": 9,
    "october": 10, "oct": 10, "oct.": 10,
    "november": 11, "nov": 11, "nov.": 11,
    "december": 12, "dec": 12, "dec.": 12,
}

# Regex fragments
_MONTH_RE = r"(?:Jan(?:uary)?\.?|Feb(?:ruary)?\.?|Mar(?:ch)?\.?|Apr(?:il)?\.?|May|June?\.?|July?\.?|Aug(?:ust)?\.?|Sep(?:t(?:ember)?)?\.?|Oct(?:ober)?\.?|Nov(?:ember)?\.?|Dec(?:ember)?\.?)"
_DAY_RE = r"(\d{1,2})"
_YEAR_RE = r"(\d{4})"

# ISO date: "1969-07-16"
_ISO_DATE_RE = re.compile(r"\b(\d{4})-(\d{2})-(\d{2})\b")

# ISO month: "1969-07"
_ISO_MONTH_RE = re.compile(r"\b(\d{4})-(\d{2})\b")

# Full date (US format): "July 30, 2020" / "Jan. 25, 2024" / "March 2, 1972"
_FULL_DATE_US_RE = re.compile(
    rf"({_MONTH_RE})\s+{_DAY_RE},?\s+{_YEAR_RE}",
    re.IGNORECASE,
)

# Full date (Day Month Year): "21 July 1969" / "20 July 1976" / "23 January 2003"
_FULL_DATE_INTL_RE = re.compile(
    rf"{_DAY_RE}\s+({_MONTH_RE}),?\s+{_YEAR_RE}",
    re.IGNORECASE,
)

# Month + year: "Feb. 1976" / "February 1976"
_MONTH_YEAR_RE = re.compile(
    rf"({_MONTH_RE})\s+{_YEAR_RE}",
    re.IGNORECASE,
)

# Year only: standalone 4-digit year
_YEAR_ONLY_RE = re.compile(r"\b(\d{4})\b")


def _parse_month(token: str) -> int | None:
    """Return 1-based month number for *token*, or None if unrecognised."""
    return _MONTH_MAP.get(token.lower().rstrip("."))


def parse_date(text: str) -> tuple[str | None, str]:
    """
    Parse a human-readable date string and return an (ISO-date, precision) tuple.

    Parameters
    ----------
    text:
        Free-form date text, e.g. ``"July 30, 2020"``, ``"1969-07-16"``,
        ``"21 July 1969"``, ``"Feb. 1976"``, ``"1972"``,
        ``"approximately March 2024"``.

    Returns
    -------
    tuple[str | None, str]
        - ISO date string (``"YYYY-MM-DD"`` or ``"YYYY-MM-01"`` for month/year only)
          or ``None`` if unparseable.
        - DatePrecision value (``"EXACT"``, ``"ESTIMATED"``,
          ``"YEAR_ONLY"``, ``"MONTH_ONLY"``, ``"UNKNOWN"``).
    """
    if not text:
        return None, PRECISION_UNKNOWN

    text = text.strip()
    is_estimated = bool(re.search(r"\bapprox(?:imately)?\b|\bcirca\b|~", text, re.IGNORECASE))

    # 1. ISO date: YYYY-MM-DD
    m_iso = _ISO_DATE_RE.search(text)
    if m_iso:
        y, mo, d = int(m_iso.group(1)), int(m_iso.group(2)), int(m_iso.group(3))
        if 1 <= mo <= 12 and 1 <= d <= 31:
            iso = f"{y:04d}-{mo:02d}-{d:02d}"
            precision = PRECISION_ESTIMATED if is_estimated else PRECISION_EXACT
            return iso, precision

    # 2. US full date: Month Day, Year
    m = _FULL_DATE_US_RE.search(text)
    if m:
        month_str, day_str, year_str = m.group(1), m.group(2), m.group(3)
        month = _parse_month(month_str)
        if month:
            try:
                iso = f"{int(year_str):04d}-{month:02d}-{int(day_str):02d}"
                precision = PRECISION_ESTIMATED if is_estimated else PRECISION_EXACT
                return iso, precision
            except ValueError:
                pass

    # 3. International full date: Day Month Year (e.g. 21 July 1969)
    m_intl = _FULL_DATE_INTL_RE.search(text)
    if m_intl:
        day_str, month_str, year_str = m_intl.group(1), m_intl.group(2), m_intl.group(3)
        month = _parse_month(month_str)
        if month:
            try:
                iso = f"{int(year_str):04d}-{month:02d}-{int(day_str):02d}"
                precision = PRECISION_ESTIMATED if is_estimated else PRECISION_EXACT
                return iso, precision
            except ValueError:
                pass

    # 4. Month + year (e.g. Feb. 1976)
    m = _MONTH_YEAR_RE.search(text)
    if m:
        month_str, year_str = m.group(1), m.group(2)
        month = _parse_month(month_str)
        if month:
            iso = f"{int(year_str):04d}-{month:02d}-01"
            return iso, PRECISION_MONTH_ONLY

    # 5. Year only (e.g. 1972)
    m = _YEAR_ONLY_RE.search(text)
    if m:
        year = int(m.group(1))
        if 1950 <= year <= 2100:
            return f"{year:04d}-01-01", PRECISION_YEAR_ONLY

    return None, PRECISION_UNKNOWN


def now_iso() -> str:
    """Return the current UTC datetime as an ISO 8601 string."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def today_iso() -> str:
    """Return the current UTC date as an ISO 8601 string (``"YYYY-MM-DD"``)."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")
