if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
// const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || "mongodb://0.0.0.0:27017/Event-List";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.secret || "secret";

// const store = new MongoDBStore({
//   url: dbUrl,
//   secret,
//   touchAfter: 24 * 60 * 60,
// });

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  // store,
  //: MongoDBStore.create({
  //   url: dbUrl,
  // }),
};
app.use(session(sessionConfig));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", userRoutes);
app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).send(message);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
