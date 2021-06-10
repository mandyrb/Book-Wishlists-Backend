"use strict";


const jsonschema = require("jsonschema");
const express = require("express");
const { ExpressError } = require("../expressError");
const { ensureCorrectUser } = require("../middleware/auth");
const Booklist = require("../models/booklist");
const booklistNewSchema = require("../schemas/booklistNew.json");
const bookNewSchema = require("../schemas/bookNew.json");
const router = express.Router();
// const router = express.Router({ mergeParams: true });


// POST /[username] { booklist } => { booklist }
//
// Create a new booklist: booklist should be { name, description, username }
//
// Returns { id, name, description, username }
//
// Authorization required: same username as logged in user

router.post("/new/:username", ensureCorrectUser, async function (req, res, next) {
    console.log("in :/username route for posting new list")
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

// POST /[id][username] { book } => { book }
//
// Add book to booklist: book should be { isbn, bestsellersDate, username }
//
// Returns { isbn, bestsellersDate, booklistId, username }
//
// Authorization required: same username as logged in user

router.post("/:id/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, bookNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new ExpressError(errs);
      }
      const book = await Booklist.addBook(req.params.id, req.body);
      return res.status(201).json({ book });
    } catch (err) {
      return next(err);
    }
});

//  GET /[id][username] => { booklist }
//  
//  Get all books on a booklist
//
//  { books: [ { isbn, bestsellersDate, booklistId }, ...] }
//  
//  Authorization required: same username as logged in user
//  

router.get("/:id/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const books = await Booklist.getBooks(req.params.id);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});


// router.delete("/:id", ensureAdmin, async function (req, res, next) {
//   try {
//     await Job.remove(req.params.id);
//     return res.json({ deleted: +req.params.id });
//   } catch (err) {
//     return next(err);
//   }
// });


module.exports = router;
