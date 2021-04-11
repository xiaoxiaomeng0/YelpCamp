const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200,h_200");
});

const campSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [imageSchema],
    description: {
      type: String,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opts
);

campSchema.virtual("properties.popupText").get(function () {
  return `<a href="/campgrounds/${
    this._id
  }"><h6>${this.name}</h6></a> <p>${this.description.substring(0, 20)} ...</p>`;
});

campSchema.post("findOneAndDelete", async function (campground) {
  if (campground.reviews) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});
const Campground = mongoose.model("Campground", campSchema);

module.exports = Campground;
