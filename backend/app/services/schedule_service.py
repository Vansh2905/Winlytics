"""
Winlytics schedule service.

Fetches upcoming cricket matches from the CricAPI and caches the response
for a configurable TTL. Uses cachetools.TTLCache instead of functools.lru_cache
so that the data is periodically refreshed rather than cached forever for the
lifetime of the server process.
"""

import os
import httpx
import logging
from typing import List, Dict, Any

from cachetools import TTLCache, cached

logger = logging.getLogger(__name__)

# Cache one result set for 1 hour (3600 s).
# Adjust SCHEDULE_CACHE_TTL env var to change this without a code deploy.
_SCHEDULE_TTL = int(os.getenv("SCHEDULE_CACHE_TTL", "3600"))
_schedule_cache: TTLCache = TTLCache(maxsize=1, ttl=_SCHEDULE_TTL)


def _infer_format(match_type: str) -> str:
    """Infer cricket format from match type string."""
    match_lower = match_type.lower()
    if "t20" in match_lower:
        return "T20"
    elif "odi" in match_lower:
        return "ODI"
    elif "test" in match_lower:
        return "Test"
    return "Other"


@cached(_schedule_cache)
def get_upcoming_matches(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Fetch upcoming matches from CricAPI.

    Results are cached for SCHEDULE_CACHE_TTL seconds (default 1 hour).
    The cache is shared across all requests but expires automatically,
    ensuring stale schedule data is never served indefinitely.

    Returns an empty list if CRICAPI_KEY is missing or the request fails
    — this is a non-critical feature and must never break predictions.
    """
    cricapi_key = os.getenv("CRICAPI_KEY")
    if not cricapi_key:
        logger.warning("CRICAPI_KEY not set — returning empty schedule")
        return []

    try:
        url = f"https://api.cricapi.com/v1/matches?apikey={cricapi_key}&offset=0"

        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            response.raise_for_status()

        data = response.json()
        matches = data.get("data", [])[:limit]

        formatted_matches: List[Dict[str, Any]] = []
        for match in matches:
            teams = match.get("teams", [])
            venue = match.get("venue", "Unknown Venue")

            # Extract city: last segment after the final comma in the venue string
            city_parts = venue.split(",")
            city = city_parts[-1].strip() if city_parts else "Unknown City"

            formatted_matches.append({
                "match_id": match.get("id", ""),
                "team1": teams[0] if len(teams) > 0 else "TBD",
                "team2": teams[1] if len(teams) > 1 else "TBD",
                "venue": venue,
                "city": city,
                "date": match.get("dateTimeGMT", ""),
                "format": _infer_format(match.get("matchType", "")),
            })

        logger.info("Fetched %d upcoming matches from CricAPI", len(formatted_matches))
        return formatted_matches

    except Exception as exc:
        logger.error("CricAPI request failed: %s", exc)
        return []
