from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

# Association table for Contests and Problems
contest_problems = Table(
    "contest_problems",
    Base.metadata,
    Column("contest_id", Integer, ForeignKey("contests.id"), primary_key=True),
    Column("problem_id", Integer, ForeignKey("problems.id"), primary_key=True),
    Column("problem_order", Integer, default=0) # Order of problem in contest (A, B, C...)
)

# Association table for Contests and Participants (Users)
contest_participants = Table(
    "contest_participants",
    Base.metadata,
    Column("contest_id", Integer, ForeignKey("contests.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("joined_at", DateTime, default=datetime.utcnow)
)

class Contest(Base):
    __tablename__ = "contests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"))

    # Relationships
    problems = relationship("Problem", secondary=contest_problems, order_by="contest_problems.c.problem_order")
    submissions = relationship("Submission", back_populates="contest")
    participants = relationship("User", secondary=contest_participants, backref="enrolled_contests")

