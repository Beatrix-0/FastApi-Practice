from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.contest import Contest
from app.models.problem import Problem
from app.models.submission import Submission
from app.schemas.contest import Contest as ContestSchema, ContestCreate, ContestStanding
from app.api.deps import get_current_user, get_current_active_admin, get_current_user_optional
from app.models.user import User, UserRole
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[ContestSchema])
def list_contests(db: Session = Depends(get_db)):
    return db.query(Contest).order_by(Contest.start_time.desc()).all()

@router.post("/", response_model=ContestSchema)
def create_contest(
    contest_in: ContestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    
    db_contest = Contest(
        title=contest_in.title,
        description=contest_in.description,
        start_time=contest_in.start_time,
        end_time=contest_in.end_time,
        created_by=current_user.id
    )
    
    for idx, p_id in enumerate(contest_in.problem_ids):
        problem = db.query(Problem).filter(Problem.id == p_id).first()
        if problem:
            db_contest.problems.append(problem)
            # Update order in association table
            # Note: This is a bit tricky with secondary relationship. 
            # Better to use association object for order, but for now we just append.
    
    db.add(db_contest)
    db.commit()
    db.refresh(db_contest)
    return db_contest

@router.get("/{contest_id}", response_model=ContestSchema)
def get_contest(
    contest_id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    # Check if user is admin
    is_admin = False
    if current_user:
        # Check role - handle both Enum and string comparison just in case
        user_role = getattr(current_user, 'role', None)
        if hasattr(user_role, 'value'): # It's an Enum
            is_admin = user_role.value == UserRole.ADMIN.value
        else:
            is_admin = str(user_role) == UserRole.ADMIN.value
    
    # Use Pydantic model for response
    # Problems are now public as requested
    res = ContestSchema.from_orm(contest)
    res.participant_ids = [p.id for p in contest.participants]
    return res

@router.post("/{contest_id}/join")
def join_contest(
    contest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    if current_user in contest.participants:
        return {"message": "Already joined"}
    
    contest.participants.append(current_user)
    db.commit()
    return {"message": "Joined successfully"}

@router.get("/{contest_id}/standings", response_model=List[ContestStanding])
def get_standings(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    # Only include users who joined the contest
    user_stats = {} # user_id -> stats
    for p in contest.participants:
        user_stats[p.id] = {
            "user_id": p.id,
            "username": p.username,
            "solved": 0,
            "penalty": 0,
            "problem_results": {} # prob_id -> {solved: bool, penalty: int, attempts: int}
        }
    
    # Fetch all submissions for this contest within time range
    submissions = db.query(Submission).filter(
        Submission.contest_id == contest_id,
        Submission.created_at >= contest.start_time,
        Submission.created_at <= contest.end_time
    ).order_by(Submission.created_at.asc()).all()
    
    for s in submissions:
        # Only process submissions from registered participants
        if s.user_id not in user_stats:
            continue
            
        stats = user_stats[s.user_id]
        if s.problem_id not in stats["problem_results"]:
            stats["problem_results"][s.problem_id] = {"solved": False, "penalty": 0, "attempts": 0}
            
        res = stats["problem_results"][s.problem_id]
        if res["solved"]:
            continue # Already solved
            
        if s.status == "Accepted":
            res["solved"] = True
            # Penalty = (submission_time - start_time) in minutes + attempts * 20
            time_penalty = int((s.created_at - contest.start_time).total_seconds() / 60)
            res["penalty"] = time_penalty + (res["attempts"] * 20)
            stats["solved"] += 1
            stats["penalty"] += res["penalty"]
        else:
            if s.status not in ["Pending", "Running", "Compile Error"]:
                res["attempts"] += 1
                
    # Convert to list and sort by solved (desc) and penalty (asc)
    standings = list(user_stats.values())
    standings.sort(key=lambda x: (-x["solved"], x["penalty"]))
    
    return standings

@router.put("/{contest_id}", response_model=ContestSchema)
def update_contest(
    contest_id: int,
    contest_in: ContestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    db_contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not db_contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    db_contest.title = contest_in.title
    db_contest.description = contest_in.description
    db_contest.start_time = contest_in.start_time
    db_contest.end_time = contest_in.end_time
    
    # Update problems
    db_contest.problems = []
    for p_id in contest_in.problem_ids:
        problem = db.query(Problem).filter(Problem.id == p_id).first()
        if problem:
            db_contest.problems.append(problem)
            
    db.commit()
    db.refresh(db_contest)
    return db_contest

@router.delete("/{contest_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contest(
    contest_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_admin)
):
    db_contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not db_contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    db.delete(db_contest)
    db.commit()
    return None
