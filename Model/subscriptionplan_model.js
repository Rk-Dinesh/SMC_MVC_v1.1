const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema({
  packagename: String,
  price: Number,
  inr: Number,
  course: Number,
  tax: Number,
  subtopic: String,
  coursetype: String,
  stripeId: String,
  duration:String,
});

const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);
module.exports = SubscriptionPlan;
