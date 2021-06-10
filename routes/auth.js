"use strict";

const jsonschema = require("jsonschema");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { ExpressError } = require("../expressError");

// Return a signed JWT from user data

function createToken(user) {
  let payload = {
    username: user.username,
  };

  return jwt.sign(payload, SECRET_KEY);
}

//  POST /auth/login:  { username, password } => { token }
//
//  Returns JWT token which can be used to authenticate further requests.

router.post("/login", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new ExpressError(errs, 400);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);

    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

//  POST /auth/register:   { username, password, firstName } => { token }
//
//  Returns JWT token which can be used to authenticate further requests.

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new ExpressError(errs, 400);
    }

    const newUser = await User.register({ ...req.body});
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
