const mongoose = require("mongoose");

const DormSchema = new mongoose.Schema({
  name: String,
  location: String,
  capacity: Number,
  year: Number,
  floors: Number,
  link: String,
  review: Number,
  overallRating: Number,

  image: [
    {
      type: String,
    },
  ],
  reviews: [
    {
      grade: String,
      location: Number,
      size: Number,
      social: Number,
      noise: Number,
      proximity: Number,
      message: String,
    },
  ],
});

module.exports = mongoose.model("Dorm", DormSchema);
