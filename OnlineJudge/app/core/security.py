from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ----------------------------
# JWT TOKEN
# ----------------------------
def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    expire = datetime.utcnow() + (
        expires_delta if expires_delta
        else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode = {
        "exp": expire,
        "sub": str(subject)
    }

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# ----------------------------
# PASSWORD VERIFY
# ----------------------------
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ----------------------------
# PASSWORD HASH (FIXED)
# ----------------------------
def get_password_hash(password: str) -> str:
    # 🔥 FIX: bcrypt has 72-byte limit → avoid crash
    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        # safe workaround: pre-hash using SHA256
        password = hashlib.sha256(password_bytes).hexdigest()

    return pwd_context.hash(password)