const mongoose = require("mongoose");
const Campground = require("../models/camps/campground");
const Review = require("../models/camps/review");
const User = require("../models/camps/user");
const { descriptors, places } = require("./campNames");
const location = require("./cities");

mongoose
  .connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Mongo Connection Open!!!");
  })
  .catch((err) => {
    console.log(err);
  });

randArray = (arrays) => arrays[Math.floor(Math.random() * arrays.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  //   const newCamp = new Campground({
  //     name: "something",
  //     location: "Dover, MA",
  //   });
  //   newCamp.save();
  for (let i = 0; i < 50; i++) {
    const randCity = randArray(location);
    const randPrice = Math.floor(Math.random() * 20) + 10;
    const newCamp = new Campground({
      name: `${randArray(descriptors)} ${randArray(places)}`,
      location: `${randCity.city}, ${randCity.state}`,
      images: [
        {
          url:
            "https://res.cloudinary.com/dwjqjlfgt/image/upload/v1617936854/Yelpcamp/nr6rmhdzsdepgjdt0s0d.jpg",
          filename: "Yelpcamp/nr6rmhdzsdepgjdt0s0d",
        },
        {
          url:
            "https://res.cloudinary.com/dwjqjlfgt/image/upload/v1617936854/Yelpcamp/hqyfp5htuipsvbamb8yb.jpg",
          filename: "Yelpcamp/hqyfp5htuipsvbamb8yb",
        },
        {
          url:
            "https://res.cloudinary.com/dwjqjlfgt/image/upload/v1617936854/Yelpcamp/g05n7s9horxzcrbmkayz.jpg",
          filename: "Yelpcamp/g05n7s9horxzcrbmkayz",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores in deleniti aliquid perspiciatis, est atque quas blanditiis nam obcaecati perferendis, praesentium maxime veritatis corrupti inventore! Eveniet minus eligendi nisi quis?",
      price: randPrice,
      author: "6068a1fe4f5319f5fbedc4f7",
      geometry: {
        type: "Point",
        coordinates: [randCity.longitude, randCity.latitude],
      },
    });
    const user = await User.findById("6068a1fe4f5319f5fbedc4f7");
    user.campgrounds.push(newCamp);
    newCamp.save();
    user.save();
  }
};
seedDB();
