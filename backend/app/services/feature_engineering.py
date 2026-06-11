import json
from pathlib import Path

# Absolute path to team_stats.json — works no matter where uvicorn is launched from
DATA_PATH = Path(__file__).parent.parent / "data" / "team_stats.json"

with open(DATA_PATH, "r") as f:
    team_stats = json.load(f)


def feature_engineering(data) -> dict:
    team1 = data.team1
    team2 = data.team2
    venue = data.venue
    city = data.city
    event = data.event
    format_type=data.format

    team1_stats = team_stats.get(team1, {})
    team2_stats = team_stats.get(team2, {})
    
    def get_format_elo(team_stats_dict, format_name):
        format_elo_data = team_stats_dict.get("format_elo", 1500)
        
        # If it's already a dict (future structure)
        if isinstance(format_elo_data, dict):
            return format_elo_data.get(format_name, 1500)
        
        # If it's a single value (current structure)
        return format_elo_data

    # Get format-specific Elos
    format_elo_team1 = get_format_elo(team1_stats, format_type)
    format_elo_team2 = get_format_elo(team2_stats, format_type)

    features = {
        "team1": team1,
        "team2": team2,
        "event": event,
        "venue": venue,
        "city": city,
        "format":format_type,

        # TEAM ELO
        "team1_elo": team1_stats.get("elo", 1500),
        "team2_elo": team2_stats.get("elo", 1500),

        # LAST 10 FORM
        "team1_last10_form": team1_stats.get("last10_form", 0.5),
        "team2_last10_form": team2_stats.get("last10_form", 0.5),

        # FORMAT ELO
        "team1_format_elo": team1_stats.get("format_elo", 1500),
        "team2_format_elo": team2_stats.get("format_elo", 1500),

        # CITY EXPERIENCE
        "team1_city_experience": team1_stats.get("city_experience", 0),
        "team2_city_experience": team2_stats.get("city_experience", 0),
    }

    # DERIVED DIFFERENCE FEATURES
    features["format_elo_difference"] = (
        features["team1_format_elo"] - features["team2_format_elo"]
    )
    features["city_experience_difference"] = (
        features["team1_city_experience"] - features["team2_city_experience"]
    )
    features["last10_form_difference"] = (
        features["team1_last10_form"] - features["team2_last10_form"]
    )

    return features