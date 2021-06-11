"use strict";

const db = require("../db");
const { ExpressError} = require("../expressError");

class Booklist {

//   Given a booklist id, return books on a user's booklist
//    
//   Returns [{ isbn, title, author, bestsellersDate, type }, ...]
//   
//   Throws error if not found
//    
//   This method is not currently in use in the app, but 
//   was created since likely would be useful in future if
//   new features are added

static async get(id) {

  const booklistRes = await db.query(
        `SELECT books.isbn AS isbn, bestsellers_date AS bestsellersDate, booklist_id AS booklistID
         FROM books JOIN books_on_lists ON books.isbn = books_on_lists.isbn
         JOIN booklists ON booklists.id = books_on_lists.booklist_id
         WHERE booklists.id = $1`, [id]);

  const booklist = booklistRes.rows;

  if (!booklist) throw new ExpressError(`No booklist: ${id}`, 404);

  return booklist;
}


//  Create a booklist (from data), update db, return new booklist
//
//  Data should be { name, description }
//
//  Returns { id, name, description }
//
//  Throws an error if user already has booklist with that name


  static async create(data, username) {
    const duplicateCheck = await db.query(
      `SELECT name
       FROM booklists
       WHERE name = $1 AND username = $2`,
       [data.name, username],
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`You already have a booklist with name: ${data.name}`, 400);
    }
    const result = await db.query(
          `INSERT INTO booklists (name,
                             description,
                             username)
           VALUES ($1, $2, $3)
           RETURNING id, name, description`,
        [
          data.name,
          data.description,
          username
        ]);

    let booklist = result.rows[0];

    return booklist;
  }


//   Delete a booklist from database; returns undefined.
//    
//   Throws error if list not found
//    

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM booklists
           WHERE id = $1
           RETURNING id`, [id]);
    const booklist = result.rows[0];

    if (!booklist) throw new ExpressError(`No booklist: ${id}`, 404);
  }
}

module.exports = Booklist;
