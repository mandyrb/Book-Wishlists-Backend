const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testBooklistIds = [];

async function commonBeforeAll() {

  await db.query("DELETE FROM users");
  await db.query("DELETE FROM booklists");
  await db.query("DELETE FROM books");
  await db.query("DELETE FROM books_on_lists");
  await db.query("ALTER SEQUENCE booklists_id_seq RESTART WITH 1");
  
  await db.query(`
    INSERT INTO users(username, password, first_name)
    VALUES  ('username1', $1, 'UserFirst1'),
            ('username2', $2, 'UserFirst2')
    RETURNING username`,
    [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]);

  const resultsBooklists = await db.query(`
    INSERT INTO booklists (name, description, username)
    VALUES ('First booklist', 'Fun books to read when relaxing', 'username1'),
           ('Second booklist', 'Books I heard good things about', 'username1')
    RETURNING id`);
    testBooklistIds.splice(0, 0, ...resultsBooklists.rows.map(r => r.id));

  await db.query(`
    INSERT INTO books (isbn, title, author, bestsellers_date, type)
    VALUES  ('9780316492935', 'HOW THE WORD IS PASSED', 'Clint Smith', '2021-06-05', 'nonfiction'),
            ('9781728251059', 'FREED', 'E.L. James', '2021-06-05', 'fiction')
    RETURNING isbn`);

  await db.query(`
    INSERT INTO books_on_lists(isbn, booklist_id)
    VALUES ('9780316492935', $1)`,
    [testBooklistIds[0]]);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testBooklistIds,
};