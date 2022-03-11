const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Event = require("../models/event");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isAuthor } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const events = await Event.find({});
    res.render("events/index", { events });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("events/new");
});

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const event = new Event(req.body.event);
    await event.save();
    res.redirect(`/events/${event._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id).populate("author");
    res.render("events/show", { event });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.render("events/edit", { event });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, {
      ...req.body.event,
    });
    res.redirect(`/events/${event._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.redirect("/events");
  })
);

module.exports = router;
