const mongoose = require("mongoose");

const preGenCourseSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    type: String,
    mainTopic: String,
    photo: String,
    lang: { type: String },
    completed: { type: Boolean, default: false },
    category: String,
    subCategory1 : String,
    subCategory2 : String,
    user: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completed: { type: Boolean, default: false },
        startDate: { type: Date, default: Date.now },
        endDate : { type: Date, default: '' },
        quizMarks: { type: String, default: "" },
        quizPassed: { type: Boolean, default: false },
      }
    ]
  },
  { timestamps: true }
);
const PreCourse = mongoose.model("PreCourse", preGenCourseSchema);
module.exports = PreCourse;