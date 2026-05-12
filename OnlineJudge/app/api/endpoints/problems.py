from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.problem import Problem, TestCase
from app.models.user import User
from app.schemas.problem import ProblemCreate, ProblemInDB, ProblemDetail, ProblemUpdate
from app.api.deps import get_current_active_admin

router = APIRouter()

@router.post("/", response_model=ProblemInDB)
def create_problem(
    problem_in: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    db_problem = Problem(
        title=problem_in.title,
        description=problem_in.description,
        time_limit=problem_in.time_limit,
        memory_limit=problem_in.memory_limit,
        difficulty=problem_in.difficulty,
        explanation=problem_in.explanation
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)

    for tc in problem_in.test_cases:
        db_tc = TestCase(
            problem_id=db_problem.id,
            input_data=tc.input_data,
            expected_output=tc.expected_output,
            is_hidden=tc.is_hidden
        )
        db.add(db_tc)
    
    db.commit()
    db.refresh(db_problem)
    return db_problem

@router.get("/", response_model=List[ProblemInDB])
def list_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()

@router.get("/{problem_id}", response_model=ProblemDetail)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(problem)
    db.commit()
    return None

@router.put("/{problem_id}", response_model=ProblemInDB)
def update_problem(
    problem_id: int,
    problem_in: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    db_problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not db_problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    db_problem.title = problem_in.title
    db_problem.description = problem_in.description
    db_problem.time_limit = problem_in.time_limit
    db_problem.memory_limit = problem_in.memory_limit
    db_problem.difficulty = problem_in.difficulty
    db_problem.explanation = problem_in.explanation

    # Replace test cases
    db.query(TestCase).filter(TestCase.problem_id == problem_id).delete()
    for tc in problem_in.test_cases:
        db_tc = TestCase(
            problem_id=db_problem.id,
            input_data=tc.input_data,
            expected_output=tc.expected_output,
            is_hidden=tc.is_hidden
        )
        db.add(db_tc)
    
    db.commit()
    db.refresh(db_problem)
    return db_problem
