from app.db.session import Base, engine

from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.contest import Contest

Base.metadata.create_all(bind=engine)

print("All tables created!")