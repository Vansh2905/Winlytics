import os 
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_env_path)
import logging 

logger=logging.getLogger(__name__)

_client=None
_db=None
predictions_col=None
users_col=None

def get_mongo_client():
    #Creating the client
    global _client, _db, predictions_col, users_col
    
    if _client is None:
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            logger.warning("MONGO_URI environment variable not set")
            return None
            
        try:
            _client = AsyncIOMotorClient(mongo_uri)
            _db = _client["winlytics"]
            predictions_col = _db["predictions"]
            users_col = _db["users"]
            logger.info("MongoDB connected successfully")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            _client = None
            predictions_col = None
            users_col = None
            
    return _client


try:
    get_mongo_client()
except Exception as e:
    logger.error(f"MongoDB initialization failed: {e}")
    predictions_col = None
    users_col = None