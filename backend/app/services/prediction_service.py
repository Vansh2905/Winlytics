import pandas as pd
from typing import List, Iterable
from collections.abc import Iterable as IterableABC
from app.schemas.user import User
from app.services.feature_engineering import feature_engineering, team_stats
from app.services.model_registry import registry


def confidence_tier(prob: float) -> str:
    """Convert probability to confidence tier (contract-compliant)"""
    if prob >= 0.70:
        return "high"
    elif prob >= 0.58:
        return "moderate"
    else:
        return "low"


def run_prediction(data: User) -> dict:
    """Run prediction with confidence scoring using model registry"""
    # Generate features
    features = feature_engineering(data)
    df = pd.DataFrame([features])
    
    # Get active model components from registry
    model, features_name, cat_features = registry.active
    
    # Fix the type issue: ensure features_name is a list
    feature_columns: List[str]
    if callable(features_name):
        result = features_name()
        if isinstance(result, (list, tuple)):
            feature_columns = [str(item) for item in result]
        elif isinstance(result, IterableABC) and not isinstance(result, str):
            try:
                feature_columns = [str(item) for item in result]
            except (TypeError, AttributeError):
                feature_columns = []
        else:
            feature_columns = []
    elif isinstance(features_name, (list, tuple)):
        feature_columns = [str(item) for item in features_name]
    elif isinstance(features_name, IterableABC) and not isinstance(features_name, str):
        try:
            feature_columns = [str(item) for item in features_name]
        except (TypeError, AttributeError):
            feature_columns = []
    else:
        feature_columns = []
    
    # Reindex with proper type
    df = df.reindex(columns=feature_columns, fill_value=0)
    
    # Make predictions
    predict = model.predict(df)[0]
    prob = model.predict_proba(df)[0]
    
    # Calculate confidence
    team1_prob = float(prob[1])  
    team2_prob = float(prob[0])  
    confidence_score = max(team1_prob, team2_prob)
    
    # Determine winner
    predicted_winner = data.team1 if team1_prob > team2_prob else data.team2
    
    return {
        "team1": data.team1,
        "team2": data.team2,
        "team1_probability": round(team1_prob, 4),
        "team2_probability": round(team2_prob, 4),
        "predicted_winner": predicted_winner,
        "confidence": confidence_tier(confidence_score),
        "confidence_score": round(confidence_score, 4)
    }


def get_all_teams() -> list:
    """Return sorted list of teams"""
    return sorted(list(team_stats.keys()))
