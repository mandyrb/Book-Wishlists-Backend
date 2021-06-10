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

// GET/isbn => book
//
// Get book details from the New York Times Bestsellers API
//
//
//  Authorization required: none
/////////////////////////////////////
// Need to work on getting book details based on isbn from results
/////////////////////////////////////

router.get("/:type/:/bestsellers-date/:isbn", async function (req, res, next) {
    try {
    const result = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/${req.params.bestsellers-date}/combined-print-and-e-book-${req.params.type}.json?api-key=${API_KEY}`);
    const books = result.data.results.books;
    console.log("bestsellersDate is " + result.data.results.bestsellers_date);
    return res.json({ books });
    } catch (err) {
      return next(err);
    }
});


//  GET /[isbn] => { book }
//  
//  Get a book from isbn
//
//  returns: { isbn, bestsellersDate }
//  
//  Authorization required: none
//  

// router.get("/:isbn", async function (req, res, next) {
//   try {
//     const book = await Book.get(req.params.isbn);
//     return res.json({ book });
//   } catch (err) {
//     return next(err);
//   }
// });

// POST /[isbn] { book } => { book }
//
// Add book to booklist: data should be { isbn, bestsellersDate, booklistId }
//
// Returns { id, name, description, username }
//
// Authorization required: same username as logged in user

router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, bookNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new ExpressError(errs);
    }

    const book = await Book.add(req.body, req.params.username);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});


//  DELETE /[username] => deleted: isbn
//  
//  Remove book from booklist: data should be { isbn, booklistId }
//  
//  Authorization required: same username as logged in user
//  

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      await Book.remove(req.body.isbn, req.body.booklistId);
      return res.json({ deleted: +req.body.isbn });
    } catch (err) {
      return next(err);
    }
  });
  


module.exports = router;
