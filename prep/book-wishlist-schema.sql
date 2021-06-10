
CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL
);

CREATE TABLE booklists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  username VARCHAR(25) NOT NULL
    REFERENCES users ON DELETE CASCADE
);

CREATE TABLE books (
  isbn VARCHAR(25) PRIMARY KEY,
  bestsellers_date  TEXT NOT NULL
);

CREATE TABLE books_on_lists (
  isbn VARCHAR(25)
    REFERENCES books ON DELETE CASCADE,
  booklist_id INTEGER
    REFERENCES booklists ON DELETE CASCADE,
  PRIMARY KEY (isbn, booklist_id)
);
