from fastapi import APIRouter
from fastapi.params import Body

from books import BOOKS

app = APIRouter()
@app.put("/books/updateBooks")
async def updateBooks(updateBook = Body()):
    for i in range(len(BOOKS)):
        if BOOKS[i].get("title").casefold() == updateBook.get("title").casefold():
            BOOKS[i] = updateBook