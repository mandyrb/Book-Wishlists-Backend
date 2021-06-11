"use strict";

const db = require("../db");
const { ExpressError} = require("../expressError");

class Book {

//   Given a book isbn, return book
//    
//   Returns { isbn, title, author, bestsellersDate, type }
//   
//   Throws error if not found
//    
//   This method is not currently in use in the app, but 
//   was created since likely would be useful in future if
//   new features are added

static async get(isbn) {
    console.log(isbn);
    const bookRes = await db.query(
        `SELECT * FROM books 
         WHERE isbn = $1`, [isbn]);
  
    console.log(bookRes.rows[0])
    const book = bookRes.rows[0];
  
    if (!book) throw new ExpressError(`No book: ${isbn}`, 404);
  
    return book;
  }


//  Add book to booklist (from data), update db, return new book
//
//  Data should be { isbn, title, author, bestsellersDate, type }
//
//  Returns { isbn, title, author, bestsellersDate, type, booklistId }


static async add(data, booklistId) {
    const isbn = data.isbn.toString();
    const bookExists = await db.query(
          `SELECT * FROM books 
           WHERE isbn = $1`, [isbn]);
    
    if(!bookExists.rows[0]){
        await db.query(
            `INSERT INTO books (isbn, title, author, bestsellers_date, type)
            VALUES ($1, $2, $3, $4, $5)`,
            [
            isbn,
            data.title,
            data.author,
            data.bestsellersDate,
            data.type
            ]);
    }

    const bookOnList = await db.query(
        `SELECT * FROM books_on_lists 
         WHERE isbn = $1 AND booklist_id = $2`, [isbn, booklistId]);

    if (!bookOnList.rows[0]){
        await db.query(
            `INSERT INTO books_on_lists (isbn,
                                booklist_id)
            VALUES ($1, $2)`,
            [
            isbn,
            booklistId
            ]);
    }

    const result = await db.query(
        `SELECT books.isbn AS isbn, title, author, bestsellers_date AS bestsellersDate, type, booklists.id AS booklistId
           FROM books JOIN books_on_lists ON books.isbn = books_on_lists.isbn
           JOIN booklists ON booklists.id = books_on_lists.booklist_id
           WHERE books.isbn = $1`, [isbn]);
    
    const book = result.rows[0];

    return book;

  }

//   Delete a book with given isbn from a user's booklist
//    
//   Throws error if book not found
//    

static async remove(isbn, booklistId) {
    const isbnString = isbn.toString();
    const result = await db.query(
          `DELETE
           FROM books_on_lists
           WHERE isbn = $1 AND booklist_id = $2
           RETURNING isbn`, [isbnString, booklistId]);
    const book = result.rows[0];

    if (!book) throw new ExpressError(`Book not found on list ${booklistId}`, 404);
  }
}

module.exports = Book;



