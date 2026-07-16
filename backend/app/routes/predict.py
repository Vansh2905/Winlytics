"""
Winlytics prediction routes.

Endpoints:
  GET  /teams                      — list valid team names
  GET  /schedule                   — upcoming fixtures (cached)
  POST /predict                    — run AI win-probability prediction
  GET  /models                     — list model versions
  POST /models/activate/{version}  — switch active model (auth required)
  GET  /history                    — user prediction history (auth required)
  GET  /analytics/{team}           — team performance stats
"""

import os
from datetime import datetime, timezone
from jose import jwt, JWTError
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.prediction_service import run_prediction, get_all_teams
from app.db.mongo import predictions_col
from app.services.schedule_service import get_upcoming_matches
from app.services.cache import get_cached, set_cached
from app.services.feature_engineering import feature_engineering, team_stats
from app.services.model_registry import registry
from app.schemas.user import User
from app.routes.auth import get_current_user

router = APIRouter()
optional_bearer = HTTPBearer(auto_error=False)


# ── Teams ─────────────────────────────────────────────────────────────────────

@router.get("/teams", tags=["prediction"])
def get_teams():
    return {"teams": get_all_teams()}


# ── Schedule ──────────────────────────────────────────────────────────────────

@router.get("/schedule", tags=["schedule"])
def get_schedule():
    return {"matches": get_upcoming_matches()}


# ── Predict ───────────────────────────────────────────────────────────────────

@router.post("/predict", tags=["prediction"])
async def predict(
    data: User,
    credentials: HTTPAuthorizationCredentials = Depends(optional_bearer),
):
    """
    Run a win-probability prediction for two teams.

    Authentication is optional — if a valid Bearer token is provided the
    prediction is associated with that user and logged to MongoDB history.
    Unauthenticated predictions still work but are not logged per-user.
    """
    # 1. Optionally resolve user_id from the token (non-blocking if invalid)
    user_id = None
    if credentials:
        try:
            payload = jwt.decode(
                credentials.credentials,
                os.getenv("JWT_SECRET", "winlytics-secret-change-in-prod"),
                algorithms=["HS256"],
            )
            user_id = payload.get("sub")
        except JWTError:
            pass  # Invalid token is silently ignored for optional auth

    # 2. Validate team names
    valid_teams = get_all_teams()
    if data.team1 not in valid_teams:
        raise HTTPException(status_code=400, detail=f"Invalid Team1: {data.team1}")
    if data.team2 not in valid_teams:
        raise HTTPException(status_code=400, detail=f"Invalid Team2: {data.team2}")

    # 3. Check cache
    payload = data.model_dump()
    cached_result = get_cached(payload)
    if cached_result:
        return {**cached_result, "cached": True}

    # 4. Run prediction
    try:
        result = run_prediction(data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(exc)}")

    # 5. Store in cache
    set_cached(payload, result)

    # 6. Log to MongoDB (fire-and-forget; never blocks the response)
    if predictions_col is not None:
        log_data = {
            **payload,
            **result,
            "user_id": user_id,
            "timestamp": datetime.now(timezone.utc),
            "actual_winner": None,
            "model_version": registry.list_versions()["active"],
        }
        try:
            await predictions_col.insert_one(log_data)
        except Exception as exc:
            # Log the error but never surface it to the caller
            import logging
            logging.getLogger(__name__).warning("MongoDB logging failed: %s", exc)

    return {**result, "cached": False}


# ── Model registry ────────────────────────────────────────────────────────────

@router.get("/models", tags=["admin"])
def list_models():
    """List available model versions and the currently active one."""
    return registry.list_versions()


@router.post("/models/activate/{version}", tags=["admin"])
def activate_model(version: str, current_user=Depends(get_current_user)):
    """
    Switch the active prediction model version.

    Requires a valid authenticated session. Only logged-in users can
    trigger a model switch — this prevents anonymous model-swapping attacks.

    Note: full admin-role gating can be added here when role fields are
    added to the user schema.
    """
    try:
        registry.set_active(version)
        return {"activated": version, "activated_by": current_user["email"]}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


# ── History ───────────────────────────────────────────────────────────────────

@router.get("/history", tags=["history"])
async def get_history(limit: int = 20, current_user=Depends(get_current_user)):
    """Retrieve the authenticated user's prediction history."""
    if predictions_col is None:
        return {"history": []}
    docs = (
        await predictions_col.find(
            {"user_id": current_user["_id"]}, {"_id": 0}
        )
        .sort("timestamp", -1)
        .limit(limit)
        .to_list(limit)
    )
    return {"history": docs}


# ── Analytics ─────────────────────────────────────────────────────────────────

@router.get("/analytics/{team}", tags=["analytics"])
def get_team_analytics(team: str):
    """
    Return performance stats for a specific team.

    The 'history' array contains simulated trend data derived from the team's
    current ELO rating. It is NOT sourced from real match-by-match records.
    The 'simulated' flag in the response makes this explicit so callers can
    display the appropriate disclaimer to end users.
    """
    stats = team_stats.get(team)
    if not stats:
        raise HTTPException(
            status_code=404, detail=f"Analytics not found for team: {team}"
        )

    base_elo = stats.get("elo", 1500)
    last10 = stats.get("last10_form", 0.5)

    # Five-point simulated ELO / win-rate trend centred on the team's current ELO.
    # This illustrates trajectory shape; it is not derived from historical records.
    history_data = [
        {"match": "M1", "elo": round(base_elo - 40, 2), "win_rate": 0.45},
        {"match": "M2", "elo": round(base_elo - 20, 2), "win_rate": 0.48},
        {"match": "M3", "elo": round(base_elo + 10, 2), "win_rate": 0.52},
        {"match": "M4", "elo": round(base_elo + 5, 2),  "win_rate": 0.50},
        {"match": "M5", "elo": round(base_elo, 2),       "win_rate": round(last10, 4)},
    ]

    return {
        "team": team,
        "current_elo": round(base_elo, 2),
        "form": round(last10, 4),
        "city_experience": stats.get("city_experience", 0),
        # format_elo is a scalar float (the team's primary format ELO rating)
        "formats": stats.get("format_elo", 1500),
        "history": history_data,
        # Consumers should treat 'history' as illustrative, not factual records
        "simulated": True,
    }