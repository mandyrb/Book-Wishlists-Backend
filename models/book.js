"use strict";

const db = require("../db");
const { ExpressError} = require("../expressError");

class Book {

//   Given a book isbn, return book
//    
//   Returns { isbn, bestsellersDate }
//   
//   Throws error if not found
//    

static async get(isbn) {
    console.log(isbn);
    const bookRes = await db.query(
        `SELECT * FROM books 
         WHERE isbn = $1`, [isbn]);
  
    console.log(bookRes.rows[0])
    const book = bookRes.rows[0];
  
    if (!book) throw new ExpressError(`No book: ${isbn}`);
  
    return book;
  }


//  Add book to booklist (from data), update db, return new book
//
//  Data should be { bestsellersDate, booklistId }
//
//  Returns { isbn, bestsellersDate }


static async add(data) {
    const isbn = data.isbn.toString();
    const bookExists = await db.query(
          `SELECT * FROM books 
           WHERE isbn = $1`, [isbn]);
    
    if(!bookExists.rows[0]){
        await db.query(
            `INSERT INTO books (isbn,
                                bestsellers_date)
            VALUES ($1, $2)`,
            [
            isbn,
            data.bestsellersDate
            ]);
    }

    const bookOnList = await db.query(
        `SELECT * FROM books_on_lists 
         WHERE isbn = $1 AND booklist_id = $2`, [isbn, data.booklistId]);

    if (!bookOnList.rows[0]){
        await db.query(
            `INSERT INTO books_on_lists (isbn,
                                booklist_id)
            VALUES ($1, $2)`,
            [
            isbn,
            data.booklistId
            ]);
    }

    const result = await db.query(
        `SELECT books.isbn AS isbn, bestsellers_date AS bestsellersDate
           FROM books JOIN books_on_lists ON books.isbn = books_on_lists.isbn
           JOIN booklists ON booklists.id = books_on_lists.booklist_id
           WHERE books.isbn = $1`, [isbn]);
    
    const book = result.rows[0];

    return book;

  }

//   Delete given book from booklist
//
//   Data should be
//    
//  Throws error if list not found
//    

static async remove(isbn, booklistId) {
    const isbnString = isbn.toString();
    const result = await db.query(
          `DELETE
           FROM books_on_lists
           WHERE isbn = $1 AND booklist_id = $2
           RETURNING isbn`, [isbnString, booklistId]);
    const book = result.rows[0];

    if (!book) throw new ExpressError(`Book not found`);
  }
}

module.exports = Book;



