from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from app.routes.predict import router
from app.routes.auth import router as auth_router
import os

# Resolve path to app/.env
_env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_env_path)

app = FastAPI(
    title="Winlytics API",
    description="AI-powered cricket match prediction API",
    version="2.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Origins are read from ALLOWED_ORIGINS env var (comma-separated, no trailing
# slash). Falls back to localhost:3000 for local development.
#
# Note on allow_credentials: authentication uses Bearer JWT tokens sent in the
# Authorization header — NOT cookies. Cookie-based credentials are therefore not
# required and allow_credentials is intentionally left False. If you ever add
# cookie-based sessions, set allow_credentials=True and narrow allow_origins.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(router)
app.include_router(auth_router)


# ── Root ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["meta"])
def root():
    return {"message": "Winlytics API", "version": "2.0.0", "docs": "/docs"}


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["meta"])
async def health():
    """
    Lightweight health probe for deployment platforms (Render, Railway, etc.).
    Returns application status, active model version, and optional DB/cache
    connectivity — without exposing any secrets.
    """
    from app.services.model_registry import registry
    from app.db.mongo import predictions_col

    # Check Redis connectivity
    redis_ok: bool = False
    try:
        from app.services.cache import _get_redis
        r = _get_redis()
        if r:
            r.ping()
            redis_ok = True
    except Exception:
        redis_ok = False

    return {
        "status": "ok",
        "model": {
            "active": registry.list_versions().get("active"),
            "versions": registry.list_versions().get("versions"),
        },
        "db": {
            "mongodb": predictions_col is not None,
        },
        "cache": {
            "redis": redis_ok,
        },
    }