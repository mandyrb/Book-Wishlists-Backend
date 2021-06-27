# Book Wishlists - Backend

[Deployed on Heroku](https://book-wishlists.herokuapp.com)

**Book Wishlists** is a web application for creating custom booklists, based on searches of the New York Times Bestsellers lists. This repository includes the backend for the application; the frontend repository can be found [here](https://github.com/mandyrb/book-wishlist-frontend)

**Features and Routes**: The application backend includes routes for user login and registration, each returning a JWT token that can be used as an authorization header to authenticate future requests. An authenticated user can access a GET route to view their own user details, as well as a DELETE route to delete their account. They can make GET requests to obtain a list of ten books from a New York Times bestsellers list, given a list date and type (fiction or nonfiction), or to retrieve book details using the book's ISBN, list date, and type. They can make POST requests to create custom booklists and to add books to those lists, and they can make DELETE requests to delete booklists or to remove books from a given list.

**API Information**: This project
uses the [New York Times Books API](https://developer.nytimes.com/docs/books-product/1/overview), which provides information about book reviews and The New York Times Best Sellers lists. Developers must create an account and register an app in order to obtain an API key. Information about additional API's provided by the New York Times, as well as terms and requirements, can be found [here](https://developer.nytimes.com/)

**Technology Stack**: PostgreSQL, Node/Express, jest

**Project Setup**: If you clone this repository and would like to run the backend locally, follow these steps to get started:

- Within the root directory, install dependencies:
     - `npm install`
- Create the app and test databases, including seed data:
     - `cd prep`
     - `psql -f book-wishlist.sql`
- Create a .env file in the root directory with the following contents:
     - `API_KEY=YOUR_API_KEY`
- Launch the server from the root directory:
     - `node server.js`
- If desired, run tests that were created during development:
     - `jest -i`