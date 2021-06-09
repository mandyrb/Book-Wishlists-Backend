"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {ExpressError} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {

//  Authenticate a user with username and password
//
//  Returns { username, first_name, booklists}
//
//  Throws error is user not found or wrong password

  static async authenticate(username, password) {

    const userRes = await db.query(
        `SELECT username, password, first_name AS "firstName"
         FROM users
         WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (user) {
        const userBooklistRes = await db.query(
            `SELECT id, name, description
             FROM booklists
             WHERE username = $1`, [username]);
    
        user.booklists = userBooklistRes.rows;

        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
            delete user.password;
            return user;
        }      
    }

    throw new ExpressError("Invalid username or password");
  }

//   Register a user with data
//
//   Returns  { username, firstName}
//
//   Throws error if username already used


  static async register(
      { username, password, firstName }) {
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new ExpressError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name)
           VALUES ($1, $2, $3)
           RETURNING username, first_name AS "firstName"`,
        [
          username,
          hashedPassword,
          firstName
        ],
    );

    const user = result.rows[0];

    return user;
  }

//   Find all users 
//
//   Returns [{ username, firstName }, ...]


  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  first_name AS "firstName"
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }
  
//   Given a username, returns detail data about the user
//
//   Returns { username, firstName, booklists }
//     where booklists is { id, name, description }
//
//   Throws error if user not found


  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  first_name AS "firstName"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new ExpressError(`No user: ${username}`);

    const userBooklistRes = await db.query(
          `SELECT id, name, description
           FROM booklists
           WHERE username = $1`, [username]);

    user.booklists = userBooklistRes.rows;
    return user;
  }

// Delete given user from database; returns undefined. */

static async remove(username) {
  let result = await db.query(
      `DELETE FROM users WHERE username = $1 RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new ExpressError(`No user: ${username}`);
  }
}



module.exports = User;
