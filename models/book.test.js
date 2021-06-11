"use strict";

const { ExpressError } = require("../expressError");
const db = require("../db.js");
const Book = require("./book.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBooklistIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** add */

describe("add", function () {
  let newBook = {
    isbn: "9781538748169",
    title: "THE BOY FROM THE WOODS",
    author: "Harlan Coben",
    bestsellersDate: "2020-03-21",
    type: "fiction"
  };

  test("works", async function () {
    let book = await Book.add(newBook, 1, "username1");
    expect(book).toEqual({
      ...newBook,
      booklistId: 1,
    });
  });
});


/************************************** get */

describe("get", function () {
  test("works", async function () {
    let book = await Book.get("9780316492935");
    expect(book).toEqual({
      isbn: "9780316492935",
      title: "HOW THE WORD IS PASSED",
      author: "Clint Smith",
      bestsellersDate: "2021-06-05",
      type: "nonfiction"
    });
  });

  test("not found if no such book", async function () {
    try {
      await Book.get(0);
    //   fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});


/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Book.remove("9780316492935", testBooklistIds[0], "username1");
    const res = await db.query(
        "SELECT * FROM books_on_lists WHERE isbn=$1 AND booklist_id=$2", ["9780316492935", testBooklistIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if book not on list", async function () {
    try {
      await Book.remove("9780316492935", testBooklistIds[1], "username1");
    //   fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});
