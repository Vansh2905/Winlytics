from fastapi import APIRouter,HTTPException
from app.services.prediction_service import run_prediction,get_all_teams
import asyncio
from datetime import datetime
from app.db.mongo import predictions_col
from app.services.schedule_service import get_upcoming_matches
from app.services.cache import get_cached, set_cached
from app.services.model_registry import registry
from app.schemas.user import User

router=APIRouter()

@router.get('/teams')
def get_teams():
    return {
        "teams":get_all_teams()
    }

@router.get("/schedule")
def get_schedule():
    return {"matches": get_upcoming_matches()}

@router.post('/predict')
async def predict(data: User):  # ← Made async for MongoDB
    # 1. Validation
    valid_teams = get_all_teams()
    if data.team1 not in valid_teams:
        raise HTTPException(status_code=400, detail=f"Invalid Team1: {data.team1}")
    if data.team2 not in valid_teams:
        raise HTTPException(status_code=400, detail=f"Invalid Team2: {data.team2}")
    
    # 2. Check cache first  
    payload = data.model_dump()
    cached_result = get_cached(payload)
    if cached_result:
        return {**cached_result, "cached": True}
    
    # 3. Run fresh prediction
    try:
        result = run_prediction(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    # 4. Cache the result
    set_cached(payload, result)
    
    # 5. Log to MongoDB (fire-and-forget, non-blocking)
    if predictions_col is not None:
        log_data = {        
            **payload,       
            **result,         
            "timestamp": datetime.utcnow(),
            "actual_winner": None,
            "model_version": registry.list_versions()["active"]
        }
        try:
            await predictions_col.insert_one(log_data)
        except Exception as e:
            print(f"MongoDB logging failed: {e}")

    # 6. Return result with cache flag
    return {**result, "cached": False}

# Model registry endpoints
@router.get('/models')
def list_models():
    """List available model versions"""
    return registry.list_versions()

@router.post('/models/activate/{version}')
def activate_model(version: str):
    """Switch active model version"""
    try:
        registry.set_active(version)
        return {"activated": version}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
