-- testuser has the password "password"

INSERT INTO users (username, password, first_name)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test');

INSERT INTO booklists (name, description, username)
VALUES ('First booklist', 'Fun books to read when relaxing', 'testuser'),
       ('Second booklist', 'Books I heard good things about', 'testuser');

INSERT INTO books (isbn, title, author, bestsellers_date, type)
VALUES ('9780399589010', 'ZERO FAIL', 'Carol Leonnig', '2021-06-06', 'nonfiction'),
       ('9781501171369', 'THE LAST THING HE TOLD ME', 'Laura Dave', '2021-06-06', 'fiction'),
       ('9781250223180', 'WHAT HAPPENED TO YOU?', 'Bruce D. Perry and Oprah Winfrey', '2021-06-06', 'nonfiction'),
       ('9780385547680', 'SOOLEY', 'John Grisham', '2021-06-06', 'fiction');

INSERT INTO books_on_lists (isbn, booklist_id)
VALUES ('9780399589010', 1),
       ('9781501171369', 1),
       ('9781250223180', 2),
       ('9780385547680', 2);

       
       
