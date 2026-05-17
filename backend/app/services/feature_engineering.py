import json 
with open('team_stats.json', 'r') as f:
    team_stats = json.load(f)

def feature_engineering(data):
    team1=data.team1
    team2=data.team2
    venue=data.venue
    city=data.city
    event=data.event

    team1_stats = team_stats.get(
    team1,
    {}
)
    team2_stats=team_stats.get(
    team2,
    {}
)

    features = {

    "team1": team1,

    "team2": team2,

    "event": event,

    "venue": venue,

    "city": city,

    # TEAM ELO
    "team1_elo":
        team1_stats.get(
            "elo",
            1500
        ),

    "team2_elo":
        team2_stats.get(
            "elo",
            1500
        ),

    # LAST 10 FORM
    "team1_last10_form":
        team1_stats.get(
            "last10_form",
            0.5
        ),

    "team2_last10_form":
        team2_stats.get(
            "last10_form",
            0.5
        ),

    # FORMAT ELO
    "team1_format_elo":
        team1_stats.get(
            "format_elo",
            1500
        ),

    "team2_format_elo":
        team2_stats.get(
            "format_elo",
            1500
        ),

    # CITY EXPERIENCE
    "team1_city_experience":
        team1_stats.get(
            "city_experience",
            0
        ),

    "team2_city_experience":
        team2_stats.get(
            "city_experience",
            0
        )
}
    features[
    "format_elo_difference"
] = (

    features["team1_format_elo"]

    -

    features["team2_format_elo"]
)


    features[
    "city_experience_difference"
] = (

    features[
        "team1_city_experience"
    ]

    -

    features[
        "team2_city_experience"
    ]
)


    features["last10_form_difference"] = (features["team1_last10_form"]-features["team2_last10_form"])
    return features