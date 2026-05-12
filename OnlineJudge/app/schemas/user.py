from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import UserRole

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.USER

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None
