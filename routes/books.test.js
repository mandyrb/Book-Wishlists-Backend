"use strict";

const request = require("supertest");

const app = require("../app");

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

/************************************** POST /:username/:booklistId */

describe("POST /:username/:booklistId", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
        .post(`/books/username1/${testBooklistIds[0]}`)
        .send({
            isbn: "9780440001560",
            title: "SMOKE BITTEN",
            author: "Patricia Briggs",
            bestsellersDate: "2020-03-21",
            type: "fiction"
          })
        .set("authorization", `${username1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      book: {
        isbn: "9780440001560",
        title: "SMOKE BITTEN",
        author: "Patricia Briggs",
        bestsellersDate: "2020-03-21",
        type: "fiction",
        booklistId: testBooklistIds[0]
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
        .post(`/books/username1/${testBooklistIds[0]}`)
        .send({
            isbn: "9780440001560",
            title: "SMOKE BITTEN",
            author: "Patricia Briggs",
            bestsellersDate: "2020-03-21",
            type: "fiction"
          })
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    try{
        await request(app)
        .post(`/books/username1/${testBooklistIds[0]}`)
        .send({
            isbn: "9780440001560",
            title: "SMOKE BITTEN",
            author: "Patricia Briggs",
            bestsellersDate: "2020-03-21"
          })
        .set("authorization", `${username1Token}`);
    }
    catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
    }
  });

  test("bad request with invalid data", async function () {
    try{
        await request(app)
        .post(`/books/username1/${testBooklistIds[0]}`)
        .send({
            isbn: "9780440001560",
            title: "SMOKE BITTEN",
            author: "Patricia Briggs",
            bestsellersDate: "2020-03-21",
            type:5
          })
        .set("authorization", `${username1Token}`);
    } 
    catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
    }
  });

});

/************************************** GET /:type/:date/:isbn/:username */

describe("GET /:type/:date/:isbn/:username", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
        .get(`/books/nonfiction/2021-06-06/9780399589010/username1`)
        .set("authorization", `${username1Token}`);

    expect(resp.body).toEqual({
          bookDetails: 
              { title: "ZERO FAIL", 
                author: "Carol Leonnig", 
                description: expect.any(String), 
                coverUrl: expect.any(String), 
                amazonLink: expect.any(String) },
        },
    );
  });

  test("unauthorized if not logged in user", async function () {
    const resp = await request(app)
        .get(`/books/nonfiction/2021-06-06/9780399589010/username1`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("fails with wrong parameters", async function () {
    const resp = await request(app)
        .get(`/books/mmmiction/20200606/9780399589010/username1`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).not.toEqual(200);
  });
});



/************************************** DELETE :username/:booklistId */

describe("DELETE /:username/:booklistId", function () {
  test("works for same user", async function () {
    const resp = await request(app)
    .delete(`/books/username1/${testBooklistIds[0]}`)
    .send({isbn: "9780399589010"})
    .set("authorization", `${username1Token}`);
    expect(resp.body).toEqual({ deleted: 9780399589010 });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
    .delete(`/books/username1/${testBooklistIds[0]}`)
    .send({isbn: "9780399589010"})
    .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
    .delete(`/books/username1/${testBooklistIds[0]}`)
    .send({isbn: "9780399589010"});
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such book", async function () {
    const resp = await request(app)
    .delete(`/books/username1/${testBooklistIds[0]}`)
    .send({isbn: "1000000000000"})
    .set("authorization", `${username1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
