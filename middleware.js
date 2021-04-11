const {
  campJoiSchema,
  reviewJoiSchema,
  userJoiSchema,
} = require("./utils/joiSchema");
const Campground = require("./models/camps/campground");
const Review = require("./models/camps/review");
const AsyncError = require("./utils/error");

module.exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must sign in.");
    return res.redirect("/login");
  } else {
    next();
  }
};

module.exports.isCampOwner = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized ");
    return res.redirect(`/campgrounds/${campground._id}`);
  } else {
    next();
  }
};

module.exports.isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized ");
    return res.redirect(`/campgrounds/${id}`);
  } else {
    next();
  }
};

module.exports.campJoiValidate = (req, res, next) => {
  const result = campJoiSchema.validate(req.body);
  if (result.error) {
    const { details } = result.error;
    const message = details.map((el) => el.message).join(",");
    throw new AsyncError(400, message);
  } else {
    next();
  }
};

module.exports.reviewJoiValidate = (req, res, next) => {
  const result = reviewJoiSchema.validate(req.body);
  if (result.error) {
    const { details } = result.error;
    const message = details.map((el) => el.message).join(",");
    throw new AsyncError(400, message);
  } else {
    next();
  }
};

module.exports.userJoiValidate = (req, res, next) => {
  const result = userJoiSchema.validate(req.body);
  if (result.error) {
    const { details } = result.error;
    const message = details.map((el) => el.message).join(",");
    throw new AsyncError(400, message);
  } else {
    next();
  }
};
