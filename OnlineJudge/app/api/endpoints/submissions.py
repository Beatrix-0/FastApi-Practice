from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.submission import Submission
from app.models.problem import Problem
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionInDB
from app.api.deps import get_current_user
from app.services.judge import judge_submission

router = APIRouter()

from app.db.session import SessionLocal

def run_judge_task(submission_id: int):
    db = SessionLocal()
    try:
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            return

        problem = db.query(Problem).filter(Problem.id == submission.problem_id).first()
        if not problem:
            submission.status = "Problem Not Found"
            db.commit()
            return

        submission.status = "Running"
        db.commit()

        status, exec_time = judge_submission(
            submission.code,
            submission.language,
            problem.test_cases,
            problem.time_limit
        )

        submission.status = status
        submission.execution_time = exec_time
        db.commit()
    finally:
        db.close()

@router.post("/", response_model=SubmissionInDB)
def create_submission(
    submission_in: SubmissionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(Problem.id == submission_in.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    db_submission = Submission(
        user_id=current_user.id,
        problem_id=submission_in.problem_id,
        contest_id=submission_in.contest_id,
        code=submission_in.code,
        language=submission_in.language,
        status="Pending"
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)

    background_tasks.add_task(run_judge_task, db_submission.id)

    return db_submission

@router.get("/", response_model=List[SubmissionInDB])
def list_submissions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Submission).filter(Submission.user_id == current_user.id).all()

@router.get("/{submission_id}", response_model=SubmissionInDB)
def get_submission(submission_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission
