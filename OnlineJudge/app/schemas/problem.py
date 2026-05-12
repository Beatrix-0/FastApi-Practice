from pydantic import BaseModel
from typing import List, Optional

class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str
    is_hidden: int = 0

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseInDB(TestCaseBase):
    id: int
    problem_id: int

    class Config:
        from_attributes = True

class ProblemBase(BaseModel):
    title: str
    description: str
    time_limit: float = 1.0
    memory_limit: int = 256
    difficulty: str = "Easy"
    explanation: Optional[str] = None

class ProblemCreate(ProblemBase):
    test_cases: List[TestCaseCreate] = []

class ProblemUpdate(ProblemBase):
    title: Optional[str] = None
    description: Optional[str] = None
    test_cases: Optional[List[TestCaseCreate]] = None

class ProblemInDB(ProblemBase):
    id: int

    class Config:
        from_attributes = True

class ProblemDetail(ProblemInDB):
    test_cases: List[TestCaseInDB] = []
