import os
import json
import logging
import hashlib
import numpy as np
from typing import Optional

logger = logging.getLogger(__name__)

# Redis caching disabled - chat app has priority
logger.info("🔄 Redis caching disabled - chat app priority mode")

class _NumpySafeEncoder(json.JSONEncoder):
    """Handles numpy scalar types that CatBoost may return.""" 
    def default(self, obj):
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.integer):
            return int(obj)
        return super().default(obj)

def make_key(payload: dict) -> str:
    """Create cache key (for logging/debugging only)"""
    json_str = json.dumps(payload, sort_keys=True)
    return "predict:" + hashlib.sha256(json_str.encode()).hexdigest()

def get_cached(payload: dict) -> Optional[dict]:
    """Cache disabled - always return None"""
    return None

def set_cached(payload: dict, result: dict) -> None:
    """Cache disabled - do nothing"""
    pass

# Cache stats for monitoring
def get_cache_stats():
    """Return cache status"""
    return {
        "status": "disabled",
        "reason": "chat_app_priority", 
        "mode": "no_cache",
        "performance": "predictions_work_normally"
    }