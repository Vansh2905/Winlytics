import os
import uuid
import bcrypt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.schemas.auth import RegisterRequest, LoginRequest, UserResponse
from app.db.mongo import users_col

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("JWT_SECRET", "winlytics-secret-change-in-prod")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 72

bearer = HTTPBearer()


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def _verify(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def _make_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/register")
async def register(data: RegisterRequest):
    if users_col is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    if await users_col.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    await users_col.insert_one({
        "_id": user_id,
        "name": data.name,
        "email": data.email,
        "password": _hash(data.password),
        "created_at": datetime.now(timezone.utc),
    })

    return {"token": _make_token(user_id), "user": {"id": user_id, "name": data.name, "email": data.email}}


@router.post("/login")
async def login(data: LoginRequest):
    if users_col is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    user = await users_col.find_one({"email": data.email})
    if not user or not _verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"token": _make_token(user["_id"]), "user": {"id": user["_id"], "name": user["name"], "email": user["email"]}}


@router.get("/me", response_model=UserResponse)
async def me(current_user=Depends(get_current_user)):
    return {"id": current_user["_id"], "name": current_user["name"], "email": current_user["email"]}
