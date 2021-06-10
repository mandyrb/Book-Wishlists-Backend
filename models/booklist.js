"use strict";

const db = require("../db");
const { ExpressError} = require("../expressError");

class Booklist {

//  Create a booklist (from data), update db, return new booklist
//
//  Data should be { name, description, username }
//
//  Returns { id, name, description, username }


  static async create(data, username) {
    const result = await db.query(
          `INSERT INTO booklists (name,
                             description,
                             username)
           VALUES ($1, $2, $3)
           RETURNING id, name, description, username`,
        [
          data.name,
          data.description,
          username
        ]);

    let booklist = result.rows[0];

    return booklist;
  }

//   Given a booklist id, return books on booklist
//    
//   Returns [{ isbn, bestsellersDate, booklistId }, ...]
//   
//   Throws error if not found
//    

  static async getBooks(id) {

    const booklistRes = await db.query(
          `SELECT books.isbn AS isbn, bestsellers_date AS bestsellersDate, booklist_id AS booklistID
           FROM books JOIN books_on_lists ON books.isbn = books_on_lists.isbn
           JOIN booklists ON booklists.id = books_on_lists.booklist_id
           WHERE booklists.id = $1`, [id]);

    const booklist = booklistRes.rows;

    if (!booklist) throw new ExpressError(`No booklist: ${id}`);

    return booklist;
  }

//  Add book to booklist (from data), update db, return new book
//
//  Data should be { isbn, bestsellersDate }
//
//  Returns { isbn, bestsellersDate, booklistId }


static async addBook(booklistId, data) {
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
        `SELECT books.isbn AS isbn, bestsellers_date AS bestsellersDate
           FROM books JOIN books_on_lists ON books.isbn = books_on_lists.isbn
           JOIN booklists ON booklists.id = books_on_lists.booklist_id
           WHERE books.isbn = $1`, [isbn]);
    
    const book = result.rows[0];
    book.booklistId = booklistId;

    return book;

  }


//   /** Delete given job from database; returns undefined.
//    *
//    * Throws NotFoundError if company not found.
//    **/

//   static async remove(id) {
//     const result = await db.query(
//           `DELETE
//            FROM jobs
//            WHERE id = $1
//            RETURNING id`, [id]);
//     const job = result.rows[0];

//     if (!job) throw new NotFoundError(`No job: ${id}`);
//   }
}

module.exports = Booklist;
