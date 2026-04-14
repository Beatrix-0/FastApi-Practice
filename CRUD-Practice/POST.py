from fastapi.params import Body
from books import BOOKS
from fastapi import APIRouter

app = APIRouter()
@app.post("/books/createBook")
async def func(newBook = Body()):
    BOOKS.append(newBook)