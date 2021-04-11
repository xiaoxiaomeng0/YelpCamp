const Campground = require("../models/camps/campground");
const User = require("../models/camps/user");

module.exports.registerForm = (req, res) => {
  res.render("user/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, (error) => {
      if (error) {
        return next(error);
      }
      req.flash("info", `Welcome ${newUser.username}`);
      return res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("user/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("info", `Welcome, ${req.body.username}`);
  const returnedUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(returnedUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
};
