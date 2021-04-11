const Campground = require("../models/camps/campground");
const User = require("../models/camps/user");
const { cloudinary } = require("../cloudinary");

const mbxGeocode = require("@mapbox/mapbox-sdk/services/geocoding");
const mapKey = process.env.MAPBOX_TOKEN;
const geoCodeService = mbxGeocode({ accessToken: mapKey });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new");
};
module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find the campground, try again.");
    return res.redirect("/campgrounds");
  }
  res.render("item", { campground });
};

module.exports.postCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  const mapResult = await geoCodeService
    .forwardGeocode({
      query: campground.location,
      limit: 1,
    })
    .send();
  if (!mapResult.body.features.length) {
    req.flash("error", "No place found!");
    return res.redirect("/campgrounds/new");
  }
  campground.geometry = mapResult.body.features[0].geometry;

  campground.author = req.user._id;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const user = await User.findById(req.user._id);
  user.campgrounds.push(campground);
  await campground.save();
  await user.save();
  req.flash("info", "You sucessfully added the campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground does not exist");
    return res.redirect("/campgrounds");
  }
  res.render("edit", { campground });
};

module.exports.putCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    {
      runValidators: true,
      new: true,
    }
  );
  const imagesFromReq = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...imagesFromReq);
  await campground.save();

  console.log(campground.images);

  if (req.body.deleteImages) {
    for (let f of req.body.deleteImages) {
      await cloudinary.uploader.destroy(f);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("info", "You successfully changed the campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("info", "You successfully deleted the campground!");
  res.redirect("/campgrounds");
};
