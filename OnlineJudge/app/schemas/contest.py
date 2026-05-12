from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.schemas.problem import ProblemInDB

class ContestBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime

class ContestCreate(ContestBase):
    problem_ids: List[int]

class Contest(ContestBase):
    id: int
    created_at: datetime
    created_by: int
    problems: List[ProblemInDB] = []
    participant_ids: List[int] = []

    class Config:
        from_attributes = True

class ContestStanding(BaseModel):
    user_id: int
    username: str
    solved: int
    penalty: int
    problem_results: dict # {problem_id: {solved: bool, penalty: int, attempts: int}}

