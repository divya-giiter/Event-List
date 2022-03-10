const mongoose = require("mongoose");
const Event = require("../models/event");

mongoose.connect("mongodb://0.0.0.0:27017/Event-List", {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Event.deleteMany({});
  const e = new Event({
    name: "Divya's First Event",
    email: "singhdivya76999@gmail.com",
    organiser: "Divya",
    location: "Pune",
    description: "First Event by Divya",
  });
  await e.save();
};

seedDB().then(() => {
  mongoose.connection.close();
});
