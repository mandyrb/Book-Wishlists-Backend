"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBooklistIds,
  username1Token,
  username2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** GET /users */

describe("GET /users", function () {
  test("works", async function () {
    const resp = await request(app).get("/users");
    expect(resp.body).toEqual({
      users: [
        {
          username: "username1",
          firstName: "UserFirst1"
        },
        {
          username: "username2",
          firstName: "UserFirst2"
        },
      ],
    });
  });


  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // but dropping the table will cause it to fail & allow testing of error handler
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
        .get("/users");
    expect(resp.statusCode).toEqual(500);
  });
});

// /************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
        .get(`/users/username1`)
        .set("authorization", `${username1Token}`);
    expect(resp.body).toEqual({
        user: {
          username: "username1",
          firstName: "UserFirst1",
          booklists: [
            {
              id: testBooklistIds[0],
              name: "First booklist",
              description: "Fun books to read when relaxing",
              books: [
                {
                  isbn: "9780399589010",
                  title: "ZERO FAIL",
                  author: "Carol Leonnig",
                  bestsellersDate: "2021-06-06",
                  type: "nonfiction"
                }
              ]
            },
            {
              id: 2,
              name: "Second booklist",
              description: "Books I heard good things about",
              books: []
            }
          ]
        }
      });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
        .get(`/users/username1`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/username1`);
    expect(resp.statusCode).toEqual(401);
  });
});



// /************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {

  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/users/username1`)
        .set("authorization", `${username1Token}`);
    expect(resp.body).toEqual({ deleted: "username1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/username1`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/username1`);
    expect(resp.statusCode).toEqual(401);
  });
});


