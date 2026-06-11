import os
import httpx
from functools import lru_cache
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

def _infer_format(match_type: str) -> str:
    """Infer cricket format from match type string"""
    match_lower = match_type.lower()
    if "t20" in match_lower:
        return "T20"
    elif "odi" in match_lower:
        return "ODI"
    elif "test" in match_lower:
        return "Test"
    else:
        return "Other"

@lru_cache(maxsize=1)
def get_upcoming_matches(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Fetch upcoming matches from CricAPI with in-memory caching.
    Cache cleared on server restart.
    """
    cricapi_key = os.getenv("CRICAPI_KEY")
    if not cricapi_key:
        logger.warning("CRICAPI_KEY not found in environment variables")
        return []  
    
    try:
        url = f"https://api.cricapi.com/v1/matches?apikey={cricapi_key}&offset=0"
        
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            response.raise_for_status()
            
        data = response.json()
        matches = data.get("data", [])[:limit]
        
        formatted_matches = []
        for match in matches:
            teams = match.get("teams", [])
            venue = match.get("venue", "Unknown Venue")
            
            # Extract city from venue (last part after comma)
            city_parts = venue.split(",")
            city = city_parts[-1].strip() if city_parts else "Unknown City"
            
            formatted_match = {
                "match_id": match.get("id", ""),
                "team1": teams[0] if len(teams) > 0 else "TBD",
                "team2": teams[1] if len(teams) > 1 else "TBD", 
                "venue": venue,
                "city": city,
                "date": match.get("dateTimeGMT", ""),
                "format": _infer_format(match.get("matchType", ""))
            }
            formatted_matches.append(formatted_match)
            
        logger.info(f"Fetched {len(formatted_matches)} upcoming matches")
        return formatted_matches
        
    except Exception as e:
        logger.error(f"CricAPI error: {e}")
        return []  
