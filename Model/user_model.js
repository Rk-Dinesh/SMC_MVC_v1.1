const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  fname: String,
  lname: String,
  phone: String,
  dob: String,
  password: String,
  type: String,
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  verifyToken: { type: String, default: null },
  verifyTokenExpires: { type: Date, default: null },
  verified: { type: Boolean, default: false },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral', default: null }, // Referral document ID
  referrerName: { type: String, default: null },
  isPaid: { type: Boolean, default: false } // Payment status
});

const User = mongoose.model("User", userSchema);
module.exports = User;
