from books import BOOKS

from fastapi import APIRouter
from unicodedata import category

app = APIRouter()

# fetch all books
@app.get("/books")
async def firstApi():
    return BOOKS

# static endpoint will get priority then synamic end point
@app.get("/books/book 3")
async def firstApi():
    return BOOKS[0]

# fetch specefic books (path parameter)
@app.get("/books/{book_title}")
async def firstApi(book_title: str):
    listBook = []
    ok = False
    for book in BOOKS:
        if book.get('title').casefold() == book_title.casefold():
            ok = True
            listBook.append(book)
    if not ok:
        return {"message": "Book not found"}
    else :
        return listBook

# query parameter
@app.get("/books/")
async def firstApi(inCategory: str):
    boolList = []
    for book in BOOKS:
        if book.get('category').casefold() == inCategory.casefold():
            boolList.append(book)
    return boolList
# path + query parameter
@app.get("/books/{inTitle}/")
async def firstApi(inTitle: str , inCategory : str):
    bookList = []
    for book in BOOKS:
        if book.get('title').casefold() == inTitle.casefold() and book.get('category').casefold() == inCategory.casefold():
            bookList.append(book)
    return bookList
