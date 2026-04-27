from typing import Annotated
from database import sessionLocal
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from models import Users
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class createUserRequest(BaseModel):
    username : str
    email : str
    first_name : str
    last_name : str
    password : str
    role : str

def get_db():
    db = sessionLocal() 
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/auth", status_code=status.HTTP_201_CREATED)
async def create_user(db : db_dependency, userRequest : createUserRequest):
    tmpUserModel = Users(
        username = userRequest.username,
        email = userRequest.email,
        first_name = userRequest.first_name,
        last_name = userRequest.last_name,
        role = userRequest.role,
        hashed_password = bcrypt_context.hash(userRequest.password),
        is_active = True
    )
    db.add(tmpUserModel)
    db.commit()

def authenticate_user(username : str, password : str , db):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return True

@router.post("/token")
async def login_access_token(given_input : Annotated[OAuth2PasswordRequestForm, Depends()], db : db_dependency):
    user = authenticate_user(given_input.username, given_input.password, db)
    if not user:
        return {"Authentication failed"}
    return {"Authentication Successful"}