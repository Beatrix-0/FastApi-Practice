from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    time_limit = Column(Float, default=1.0)  # in seconds
    memory_limit = Column(Integer, default=256)  # in MB
    difficulty = Column(String, default="Easy")
    explanation = Column(Text, nullable=True)

    test_cases = relationship("TestCase", back_populates="problem", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="problem")

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    is_hidden = Column(Integer, default=0) # 0 for sample, 1 for hidden

    problem = relationship("Problem", back_populates="test_cases")
