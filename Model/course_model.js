const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  user: String,
  fname: String,
  lname: String,
  phone: String,
  email: String,
  content: { type: String, required: true },
  type: String,
  mainTopic: String,
  photo: String,
  date: { type: Date, default: Date.now },
  end: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
