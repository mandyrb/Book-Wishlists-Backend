"use strict";

const { ExpressError } = require("../expressError");
const db = require("../db.js");
const Booklist = require("./booklist.js");
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

describe("create", function () {
  let newBooklist = {
    name: "New List",
    description: "A great list",
  };

  test("works", async function () {
    let book = await Booklist.create(newBooklist, "username1");
    expect(book).toEqual({
        id: 3,
        ...newBooklist
    });
  });
});


/************************************** get */

describe("get", function () {
  test("works", async function () {
    let booklist = await Booklist.get(testBooklistIds[0]);
    expect(booklist).toEqual([{
      isbn: "9780316492935",
      title: "HOW THE WORD IS PASSED",
      author: "Clint Smith",
      bestsellersDate: "2021-06-05",
      type: "nonfiction"
    }]);
  });

  test("not found if no such booklist", async function () {
    try {
      await Booklist.get(9999);
    //   fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});


/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Booklist.remove(testBooklistIds[0]);
    const res = await db.query(
        "SELECT * FROM booklists WHERE id=$1", [testBooklistIds[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if booklist doesn't exist", async function () {
    try {
      await Booklist.remove(9999);
    //   fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});
