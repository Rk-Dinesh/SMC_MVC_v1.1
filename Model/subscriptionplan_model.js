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
    stripeId: String,
    duration: String,
    preCourses: {
      type: Boolean,
      default: false,
    },
    quizAccess: {
      type: Boolean,
      default: false,
    },
    studyGroupAccess: {
      type: Boolean,
      default: false,
    },
    date: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admin",
    //   required: true,
    // },
  },
  { timestamps: true }
);

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);
module.exports = SubscriptionPlan;
