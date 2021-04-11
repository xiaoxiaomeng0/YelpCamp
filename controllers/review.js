const Campground = require("../models/camps/campground");
const Review = require("../models/camps/review");
const User = require("../models/camps/user");

module.exports.postReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const user = await User.findById(req.user._id);
  const review = new Review(req.body);
  campground.reviews.push(review);
  review.author = req.user._id;
  user.reviews.push(review);
  await campground.save();
  await review.save();
  await user.save();
  req.flash("info", "Successfully created review");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("info", "Successfully deleted review");
  res.redirect(`/campgrounds/${id}`);
};
