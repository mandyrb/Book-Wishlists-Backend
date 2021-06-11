"use strict";

// Middleware for authentication on various routes

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { ExpressError } = require("../expressError");


// If a token was provided, verify it, and, if valid, store the token payload
// on res.locals (this will include the username)


function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader;
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

// Middleware for when user must provide a valid token & be the user matching
// username provided as route param; if not, raises Unauthorized.

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (!user || !(user.username === req.params.username)) {
      throw new ExpressError("Unauthorized", 401);
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureCorrectUser
};
