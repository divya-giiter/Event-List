const Event = require("./models/event");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  // if (!event.author.equals(req.user._id)) {
  //   res.send("You do not have permission to do that!");
  //   return res.redirect(`/events/${id}`);
  // }
  next();
};
