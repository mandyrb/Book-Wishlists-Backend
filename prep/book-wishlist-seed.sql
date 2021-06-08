-- testuser has the password "password"

INSERT INTO users (username, password, first_name)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test');

INSERT INTO booklists (name, description, username)
VALUES ('First booklist', 'Fun books to read when relaxing', 'testuser'),
       ('Second booklist', 'Books I heard good things about', 'testuser');

INSERT INTO books (isbn, booklist_id)
VALUES ('9781250272942', 1),
       ('9781501171369', 1),
       ('9780593333136', 2),
       ('9780385547680', 2);

       
       
