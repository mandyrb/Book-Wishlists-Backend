"use strict";

const axios = require('axios')
const { API_KEY } = require("../config.js");
const jsonschema = require("jsonschema");
const express = require("express");
const { ExpressError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Booklist = require("../models/booklist");
const booklistNewSchema = require("../schemas/booklistNew.json");
const router = express.Router();


//  GET / => { books }
//  
//  Get new books from the New York Times bestseller API
//     where books is [ { isbn, title, author, bestsellersDate, type },... ]
//  
//  Authorization required: none
//  

router.get("/:type/:date/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const result = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/${req.params.date}/combined-print-and-e-book-${req.params.type}.json?api-key=${API_KEY}`);
    const booksData = result.data.results.books;
    const books = [];
    for (let i=0; i<10; i++){
      let book = {
        isbn: booksData[i].primary_isbn13, 
        title: booksData[i].title, 
        author: booksData[i].author, 
        bestsellersDate: result.data.results.published_date,
        type: req.params.type}
      books.push(book);
    }
    return res.json({ books });
  } catch (err) {
    if(err.response.status === 404) return next(new ExpressError("No list found for list name and/or date provided", 404));
    else if (err.response.status === 400) return next(new ExpressError("Invalid date format", 400))
    else return next(err);
  }
});


// POST /[username] { booklist } => { booklist }
//
// Create a new booklist: booklist should be { name, description }
//
// Returns { id, name, description }
//
// Authorization required: same username as logged in user
//
// Throws an error if user already has booklist with that name

router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, booklistNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new ExpressError(errs, 400);
    }

    const booklist = await Booklist.create(req.body, req.params.username);
    return res.status(201).json({ booklist });
  } catch (err) {
    return next(err);
  }
});


//  DELETE /[username]/[id] => deleted: id
//  
//  Delete booklist
//  
//  Authorization required: same username as logged in user
//  

router.delete("/:username/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Booklist.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
