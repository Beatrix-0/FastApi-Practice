from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=True)
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    status = Column(String, default="Pending") # AC, WA, TLE, CE, RE, Pending, Running
    execution_time = Column(Float, nullable=True)
    memory_used = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    problem = relationship("Problem", back_populates="submissions")
    contest = relationship("Contest", back_populates="submissions")
