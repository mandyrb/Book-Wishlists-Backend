"use strict";


const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

//  GET / => { users: [ {username, firstName}, ... ] }
//
//  Returns list of all users
//
//  Authorization required
//
//  This route is not currently in use in the app, but 
//  was created since likely would be useful in future if
//  new features are added

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


//  GET /[username] => { user }
//
//  Returns { username, firstName }
//
//  Authorization required: same as current user 
//  Request Header should include Authorization: token


router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

//  DELETE /[username]  =>  { deleted: username }
//
//  Authorization required
//
//  This route is not currently in use in the app, but 
//  was created since likely would be useful in future if
//  new features are added

router.delete("/:username", async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
