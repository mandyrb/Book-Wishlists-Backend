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

/************************************** POST /booklists/:username */

describe("POST /booklists/:username", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
        .post(`/booklists/username1`)
        .send({
          name: "New List",
          description: "New List Description"
        })
        .set("authorization", `${username1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      booklist: {
        id: expect.any(Number),
        name: "New List",
        description: "New List Description"
      },
    });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
        .post(`/booklists/username1`)
        .send({
          name: "New List",
          description: "New List Description"
        })
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    try{
        await request(app)
        .post(`/booklists/username1`)
        .send({
          description: "New List Description"
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
        .post(`/booklists/username1`)
        .send({
          name: 6,
          description: "New List Description"
        })
        .set("authorization", `${username1Token}`); 
    } 
    catch (err) {
        expect(err instanceof ExpressError).toBeTruthy();
    }
  });

});

/************************************** GET /:type/:date/:username */

describe("GET /:type/:date/:username", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
        .get(`/booklists/fiction/2020-04-05/username1`)
        .set("authorization", `${username1Token}`);

    expect(resp.body).toEqual({
          books: [
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
            {
              isbn: expect.any(String), 
              title: expect.any(String),
              author: expect.any(String), 
              bestsellersDate: expect.any(String),
              type: "fiction"},
          ],
        },
    );
  });

  test("unauthorized if not logged in user", async function () {
    const resp = await request(app)
        .get(`/booklists/fiction/2020-04-05/username1`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("fails with wrong parameters", async function () {
    const resp = await request(app)
        .get(`/booklists/miction/20200405/username1`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).not.toEqual(200);
  });
});



/************************************** DELETE /booklists/:username/:id */

describe("DELETE /booklists/:username/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app)
        .delete(`/booklists/username1/${testBooklistIds[0]}`)
        .set("authorization", `${username1Token}`);
    expect(resp.body).toEqual({ deleted: testBooklistIds[0] });
  });

  test("unauth for wrong user", async function () {
    const resp = await request(app)
        .delete(`/booklists/username1/${testBooklistIds[0]}`)
        .set("authorization", `${username2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/booklists/username1/${testBooklistIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such booklist", async function () {
    const resp = await request(app)
        .delete(`/booklists/username1/0`)
        .set("authorization", `${username1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
