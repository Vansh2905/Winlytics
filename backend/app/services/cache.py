"""
Winlytics Redis cache service.

Provides a thin caching layer over Redis for prediction results.

Design decisions:
- Deterministic keys via MD5 of the sorted JSON payload
- Graceful fallback: all operations are no-ops when Redis is unavailable
  so prediction never fails because of a cache miss / connectivity issue
- TTL default: 3600 s (1 hour) — predictions are stable enough for this
- Connection is established lazily and reused across requests
"""

import os
import json
import hashlib
import logging
from typing import Optional

logger = logging.getLogger(__name__)

_redis_client = None


def _get_redis():
    """
    Return a shared Redis client, creating it on first call.
    Returns None if REDIS_URL is not set or the connection fails.
    """
    global _redis_client
    if _redis_client is not None:
        return _redis_client

    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        logger.warning("REDIS_URL not set — caching disabled")
        return None

    try:
        import redis as redis_lib
        _redis_client = redis_lib.from_url(redis_url, decode_responses=True)
        # Validate the connection immediately so we fail fast at startup
        _redis_client.ping()
        logger.info("Redis connected successfully")
    except Exception as exc:
        logger.warning("Redis connection failed: %s — caching disabled", exc)
        _redis_client = None

    return _redis_client


def _make_key(payload: dict) -> str:
    """
    Build a deterministic cache key from the prediction payload.
    Sorting keys ensures identical payloads always map to the same key
    regardless of insertion order.
    """
    canonical = json.dumps(payload, sort_keys=True, ensure_ascii=True)
    digest = hashlib.md5(canonical.encode()).hexdigest()
    return f"winlytics:pred:{digest}"


def get_cached(payload: dict) -> Optional[dict]:
    """
    Return the cached prediction result for the given payload, or None.
    Never raises — Redis errors are logged and treated as cache misses.
    """
    r = _get_redis()
    if r is None:
        return None
    try:
        raw = r.get(_make_key(payload))
        return json.loads(raw) if raw else None
    except Exception as exc:
        logger.warning("Cache GET failed: %s", exc)
        return None


def set_cached(payload: dict, result: dict, ttl: int = 3600) -> None:
    """
    Store a prediction result in Redis with the given TTL (seconds).
    Never raises — Redis errors are logged and silently ignored.
    """
    r = _get_redis()
    if r is None:
        return
    try:
        r.setex(_make_key(payload), ttl, json.dumps(result))
    except Exception as exc:
        logger.warning("Cache SET failed: %s", exc)