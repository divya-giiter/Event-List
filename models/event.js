const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  organiser: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Event", EventSchema);
