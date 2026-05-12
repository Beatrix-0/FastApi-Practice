from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.api.deps import get_current_active_admin

router = APIRouter()

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    total_problems = db.query(Problem).count()
    total_submissions = db.query(Submission).count()
    total_users = db.query(User).count()
    
    # Recent activity: last 5 submissions
    recent_submissions = db.query(Submission).order_by(Submission.created_at.desc()).limit(5).all()
    
    activity = []
    for s in recent_submissions:
        activity.append({
            "id": s.id,
            "message": f"New submission on problem #{s.problem_id}",
            "created_at": s.created_at
        })

    return {
        "total_problems": total_problems,
        "total_submissions": total_submissions,
        "total_users": total_users,
        "recent_activity": activity
    }
