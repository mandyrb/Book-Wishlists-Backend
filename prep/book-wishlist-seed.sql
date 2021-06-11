-- testuser has the password "password"

INSERT INTO users (username, password, first_name)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test');

INSERT INTO booklists (name, description, username)
VALUES ('First booklist', 'Fun books to read when relaxing', 'testuser'),
       ('Second booklist', 'Books I heard good things about', 'testuser');

INSERT INTO books (isbn, title, author, bestsellers_date, type)
VALUES ('9780316492935', 'HOW THE WORD IS PASSED', 'Clint Smith', '2021-06-05', 'nonfiction'),
       ('9781728251059', 'FREED', 'E.L. James', '2021-06-05', 'fiction'),
       ('9781538748169', 'THE BOY FROM THE WOODS', 'Harlan Coben', '2020-03-21', 'fiction'),
       ('9780385348713', 'THE SPLENDID AND THE VILE', 'Erik Larson', '2020-03-21', 'nonfiction');

INSERT INTO books_on_lists (isbn, booklist_id)
VALUES ('9780316492935', 1),
       ('9781538748169', 1),
       ('9781728251059', 2),
       ('9780385348713', 2);

       
       
