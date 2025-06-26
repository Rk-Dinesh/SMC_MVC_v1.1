const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    packagename: String,
    price: Number,
    inr: Number,
    course: Number,
    tax: Number,
    subtopic: String,
    coursetype: String,
    paymentId: String,
    duration: String,
    preCourses: {
      type: String,
      enum: ["Yes", "No"],
    },
    quizAccess: {
      type: String,
      enum: ["Yes", "No"],
    },
    studyGroupAccess: {
      type: String,
      enum: ["Yes", "No"],
    },
    date: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);
module.exports = SubscriptionPlan;
