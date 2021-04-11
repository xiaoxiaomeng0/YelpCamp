const express = require("express");
const campRoute = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isAuthenticated,
  isCampOwner,
  campJoiValidate,
} = require("../middleware");
const campgrounds = require("../controllers/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

campRoute
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isAuthenticated,
    upload.array("image"),
    campJoiValidate,
    catchAsync(campgrounds.postCampground)
  );
// .post(upload.array("image"), (req, res) => {
//   console.log(req.files, req.body);
//   res.send("it works");
// });

campRoute.get("/new", isAuthenticated, campgrounds.renderNewForm);

campRoute
  .route("/:id")
  .get(catchAsync(campgrounds.show))
  .put(
    isAuthenticated,
    isCampOwner,
    upload.array("image"),
    campJoiValidate,
    catchAsync(campgrounds.putCampground)
  )
  .delete(
    isAuthenticated,
    isCampOwner,
    catchAsync(campgrounds.deleteCampground)
  );

campRoute.get(
  "/:id/edit",
  isAuthenticated,
  isCampOwner,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = campRoute;
