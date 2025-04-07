const mongoose = require("mongoose");
const examSchema = new mongoose.Schema(
  {
    course: String,
    exam: String,
    marks: String,
    passed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;