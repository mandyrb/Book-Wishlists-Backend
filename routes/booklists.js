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


//  GET / => { booklist }
//  
//  Get new books from the New York Times bestseller API
//
//  
//  Authorization required: none
//  

router.get("/:type/:date", async function (req, res, next) {
  try {
    const result = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/${req.params.date}/combined-print-and-e-book-${req.params.type}.json?api-key=${API_KEY}`);
    const books = result.data.results.books;
    console.log("bestsellersDate is " + result.data.results.bestsellers_date);
    for (let i=0; i<10; i++){
      console.log("BOOK NUMBER " + i);
      console.log("isbn is " + books[i].primary_isbn13);
      console.log("description is" + books[i].description);
      console.log("title is " + books[i].title);
      console.log("author is " + books[i].author);
      console.log("cover url is " + books[i].book_image);
      console.log("amazon link is " + books[i].amazon_product_url);
    }
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});


//  GET /[username][id] => { booklist }
//  
//  Get all books on a booklist
//
//  { books: [ { isbn, bestsellersDate, booklistId }, ...] }
//  
//  Authorization required: same username as logged in user
//  

// router.get("/:username/:id", ensureCorrectUser, async function (req, res, next) {
//   try {
//     const books = await Booklist.get(req.params.id);
//     return res.json({ books });
//   } catch (err) {
//     return next(err);
//   }
// });


// POST /[username] { booklist } => { booklist }
//
// Create a new booklist: booklist should be { name, description }
//
// Returns { id, name, description, username }
//
// Authorization required: same username as logged in user

router.post("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, booklistNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new ExpressError(errs);
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
