from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.user import User
from app.models.submission import Submission
from app.api.deps import get_current_user
from app.api.endpoints.leaderboard import get_leaderboard

router = APIRouter()

@router.get("/me/stats")
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Solved count
    solve_count = db.query(func.count(func.distinct(Submission.problem_id))).filter(
        Submission.user_id == current_user.id,
        Submission.status == "Accepted"
    ).scalar() or 0

    # Rank calculation
    # Get all users and their solve counts
    solved_counts = (
        db.query(
            Submission.user_id,
            func.count(func.distinct(Submission.problem_id)).label("solve_count")
        )
        .filter(Submission.status == "Accepted")
        .group_by(Submission.user_id)
        .subquery()
    )

    all_ranks = (
        db.query(
            User.id,
            func.coalesce(solved_counts.c.solve_count, 0).label("solve_count")
        )
        .outerjoin(solved_counts, User.id == solved_counts.c.user_id)
        .order_by(func.coalesce(solved_counts.c.solve_count, 0).desc())
        .all()
    )

    my_rank = 0
    for idx, row in enumerate(all_ranks):
        if row.id == current_user.id:
            my_rank = idx + 1
            break

    return {
        "solve_count": solve_count,
        "rank": my_rank,
        "total_users": len(all_ranks),
        "contests": 0 # Placeholder for now
    }
