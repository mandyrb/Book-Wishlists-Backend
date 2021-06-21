"use strict";

const axios = require('axios')
const { API_KEY } = require("../config.js");
const jsonschema = require("jsonschema");
const express = require("express");
const { ExpressError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Book = require("../models/book");
const bookNewSchema = require("../schemas/bookNew.json");
const router = express.Router();

//  GET [type] / [date] / [isbn] => { bookDetails }
//
//  Get book details from the New York Times Bestsellers API
//      where bookDetails is { title, author, description, coverUrl, amazonLink }
//
//  Authorization required: none

router.get("/:type/:date/:isbn/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/${req.params.date}/combined-print-and-e-book-${req.params.type}.json?api-key=${API_KEY}`);
    const booksData = result.data.results.books;
    let bookDetails = {};
    let bookFound = false;
    for (let book of booksData){
      if (book.primary_isbn13 === req.params.isbn){
        bookFound=true;
        bookDetails["title"] = book.title;
        bookDetails["author"] = book.author;
        bookDetails["description"] = book.description;
        bookDetails["coverUrl"] = book.book_image;
        bookDetails["amazonLink"] = book.amazon_product_url;
      }
    }
    if (bookFound === false) return next(new ExpressError("No book found with that isbn for that bestsellers list date", 404));
    return res.json({ bookDetails });
    
  } catch (err) {
    if(err.response.status === 404) return next(new ExpressError("No list found for list name and/or date provided", 404));
    else if (err.response.status === 400) return next(new ExpressError("Invalid data format", 400))
    else return next(err);
  }
});


// POST /[username] [booklistId] { book } => { book }
//
// Add book to booklist: data should be { isbn, title, author, bestsellersDate, type }
//
// Returns book: { isbn, title, author, bestsellersDate, type, booklistId }
//
// Authorization required: same username as logged in user

router.post("/:username/:booklistId", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, bookNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new ExpressError(errs, 400);
    }

    const book = await Book.add(req.body, req.params.booklistId, req.params.username);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});


//  DELETE /[username][booklistId] => deleted: isbn
//  
//  Remove book from booklist: data should be { isbn }
//  
//  Authorization required: same username as logged in user
//  

router.delete("/:username/:booklistId", ensureCorrectUser, async function (req, res, next) {
    try {
      if(!req.body.isbn) throw new ExpressError("isbn required", 400);
      await Book.remove(req.body.isbn, req.params.booklistId, req.params.username);
      return res.json({ deleted: +req.body.isbn });
    } catch (err) {
      return next(err);
    }
  });
  


module.exports = router;
