from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SubmissionBase(BaseModel):
    problem_id: int
    contest_id: Optional[int] = None
    code: str
    language: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionInDB(SubmissionBase):
    id: int
    user_id: int
    status: str
    execution_time: Optional[float] = None
    memory_used: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
