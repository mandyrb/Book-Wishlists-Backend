-- testuser has the password "password"

INSERT INTO users (username, password, first_name)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test');

INSERT INTO booklists (name, description, username)
VALUES ('First booklist', 'Fun books to read when relaxing', 'testuser'),
       ('Second booklist', 'Books I heard good things about', 'testuser');

INSERT INTO books (isbn, bestsellers_date)
VALUES ('9781250178602', '2021-04-10'),
       ('9781982139131', '2021-03-13'),
       ('9780525559474', '2021-04-10'),
       ('9780655697077', '2021-03-13');

INSERT INTO books_on_lists (isbn, booklist_id)
VALUES ('9781250178602', 1),
       ('9781982139131', 1),
       ('9780525559474', 2),
       ('9780655697077', 2);

       
       
