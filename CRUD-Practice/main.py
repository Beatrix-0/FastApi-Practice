from fastapi import FastAPI
from GET import app as getRouter
from POST import app as postRouter
from PUT import app as putRouter
from DELETE import app as deleteRouter

app = FastAPI()
app.include_router(getRouter)
app.include_router(postRouter)
app.include_router(putRouter)
app.include_router(deleteRouter)

# Command :
# python -m venv fastapienv
# fastapienv\Scripts\activate.bat
# pip install fastapi
# pip install "uvicorn[standard]"
# uvicorn main:app --reload
