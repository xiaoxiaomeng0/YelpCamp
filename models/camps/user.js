const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
  username: String,
  password: String,
  email: String,
  campgrounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
