from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine, Base
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.responses import HTMLResponse
from fastapi import Request

# Import all models to ensure they are registered for create_all
from app import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

# Import and include routers
from app.api.endpoints import auth, problems, submissions, admin, leaderboard, users, contests
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(problems.router, prefix="/api/problems", tags=["problems"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(contests.router, prefix="/api/contests", tags=["contests"])
