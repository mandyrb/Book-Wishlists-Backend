"use strict";

const { ExpressError } = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("username1", "password1");
    expect(user).toEqual({
      username: "username1"
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password1");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("username1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    username: "new",
    firstName: "Test"
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with duplicate data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "username1",
        firstName: "UserFirst1",
      },
      {
        username: "username2",
        firstName: "UserFirst2",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("username1");
    expect(user).toEqual({
          "username": "username1",
          "firstName": "UserFirst1",
          "booklists": [
            {
              "id": testBooklistIds[0],
              "name": "First booklist",
              "description": "Fun books to read when relaxing",
              "books": [
                {
                  "isbn": "9780316492935",
                  "title": "HOW THE WORD IS PASSED",
                  "author": "Clint Smith",
                  "bestsellersDate": "2021-06-05",
                  "type": "nonfiction"
                }
              ]
            },
            {
              "id": 2,
              "name": "Second booklist",
              "description": "Books I heard good things about",
              "books": []
            }
          ]
      });
  });

  test("error if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("username1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='username1'");
    expect(res.rows.length).toEqual(0);
  });

  test("error if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof ExpressError).toBeTruthy();
    }
  });
});
