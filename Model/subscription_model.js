const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: String,
  recieptId: String,
  fname: String,
  lname: String,
  phone: String,
  email: String,
  amount: String,
  course: Number,
  subscription: String,
  subscriberId: String,
  plan: String,
  method: String,
  tax: Number,
  duration:String,
  date: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
