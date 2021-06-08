
DROP DATABASE IF EXISTS book_wishlist;
CREATE DATABASE book_wishlist;
\connect book_wishlist

\i book-wishlist-schema.sql
\i book-wishlist-seed.sql

DROP DATABASE IF EXISTS book_wishlist_test;
CREATE DATABASE book_wishlist_test;
\connect book_wishlist_test

\i book-wishlist-schema.sql
