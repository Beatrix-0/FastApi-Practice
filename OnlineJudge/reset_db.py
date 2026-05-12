from app.db.session import engine, Base
from app.models.problem import Problem, TestCase
from app.models.submission import Submission
from app.models.user import User

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Recreating tables with new schema...")
    Base.metadata.create_all(bind=engine)
    print("Database reset successfully!")

if __name__ == "__main__":
    reset_db()
