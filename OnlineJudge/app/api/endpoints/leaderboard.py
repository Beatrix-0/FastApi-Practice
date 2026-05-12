from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.user import User
from app.models.submission import Submission
from typing import List

router = APIRouter()

@router.get("/")
def get_leaderboard(db: Session = Depends(get_db)):
    # Count unique problems solved by each user
    solved_counts = (
        db.query(
            Submission.user_id,
            func.count(func.distinct(Submission.problem_id)).label("solve_count")
        )
        .filter(Submission.status == "Accepted")
        .group_by(Submission.user_id)
        .subquery()
    )

    # Join with users to get usernames
    leaderboard = (
        db.query(
            User.username,
            func.coalesce(solved_counts.c.solve_count, 0).label("solve_count"),
            func.count(Submission.id).label("total_submissions")
        )
        .outerjoin(solved_counts, User.id == solved_counts.c.user_id)
        .outerjoin(Submission, User.id == Submission.user_id)
        .group_by(User.id, User.username, solved_counts.c.solve_count)
        .order_by(func.coalesce(solved_counts.c.solve_count, 0).desc())
        .all()
    )

    return [
        {
            "username": row.username,
            "solve_count": row.solve_count,
            "total_submissions": row.total_submissions
        }
        for row in leaderboard
    ]
