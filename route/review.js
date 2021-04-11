const express = require("express");
const reviewRoute = express.Router({ mergeParams: true });
const reviews = require("../controllers/review");
const catchAsync = require("../utils/catchAsync");

const {
  isAuthenticated,
  isReviewOwner,
  reviewJoiValidate,
} = require("../middleware");

reviewRoute.post(
  "/",
  isAuthenticated,
  reviewJoiValidate,
  catchAsync(reviews.postReview)
);

reviewRoute.delete(
  "/reviews/:reviewId",
  isAuthenticated,
  isReviewOwner,
  catchAsync(reviews.deleteReview)
);

module.exports = reviewRoute;
