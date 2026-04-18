from fastapi import APIRouter
from books import BOOKS

app = APIRouter()
@app.delete("/books/deleteBook/{inTitle}")
async def func(inTitle : str):
    for i in range(len(BOOKS)):
        if BOOKS[i].get('title').casefold() == inTitle.casefold():
            BOOKS.pop(i)
            break