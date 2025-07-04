const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  language: {
    type: String,
  },
  type: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: true,
  },
});

const certificateCourse = mongoose.model('Certificate', certificateSchema);
module.exports = certificateCourse;