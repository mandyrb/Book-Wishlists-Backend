"use strict";

const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const Booklist = require("../models/booklist");
const Book = require("../models/book");

const testBooklistIds = [];

function createToken(user) {
    let payload = {
      username: user.username,
    };
  
    return jwt.sign(payload, SECRET_KEY);
}

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM booklists");
  await db.query("DELETE FROM books");
  await db.query("DELETE FROM books_on_lists");
  await db.query("ALTER SEQUENCE booklists_id_seq RESTART WITH 1");

  await User.register(
      {
        username: "username1",
        password: "password1",
        firstName: "UserFirst1"
      });
  await User.register(
      {
        username: "username2",
        password: "password2",
        firstName: "UserFirst2"
      });

  testBooklistIds[0] = (await Booklist.create(
      { name: "First booklist", description: "Fun books to read when relaxing"}, "username1")).id;
  testBooklistIds[1] = (await Booklist.create(
      { name: "Second booklist", description: "Books I heard good things about"}, "username1" )).id;

  await Book.add({
    isbn: "9780399589010",
    title: "ZERO FAIL",
    author: "Carol Leonnig",
    bestsellersDate: "2021-06-06",
    type: "nonfiction"
  }, testBooklistIds[0], "username1");

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const username1Token = createToken({ username: "username1" });
const username2Token = createToken({ username: "username2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBooklistIds,
  username1Token,
  username2Token
};
