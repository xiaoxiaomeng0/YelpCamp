const express = require("express");
const userRoute = express.Router();
const passport = require("passport");

const { userJoiValidate } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/user");

userRoute
  .route("/register")
  .get(users.registerForm)
  .post(userJoiValidate, catchAsync(users.registerUser));

userRoute
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    users.loginUser
  );

userRoute.get("/logout", users.logoutUser);

module.exports = userRoute;
