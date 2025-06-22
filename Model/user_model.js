const mongoose = require("mongoose");
const Category = require("./category_model");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  fname: String,
  lname: String,
  phone: { type: String, unique: true, required: true },
  dob: String,
  password: String,
  type: String,
  addressline1:{type:String,default:""},
  addressline2:{type:String, default:""},
  city:{type:String, default:""},
  state:{type:String, default:""},
  country:{type:String, default:""},
  zipcode:{type:String, default:""},
  about: { type: String, default: "" },
  facebook:{ type: String, default: "" },
  twitter:{ type: String, default: "" },
  instagram:{ type: String, default: "" },
  linkedIn:{ type: String, default: "" },
  goals: { type: String, default: "" },
  resource: { type: String, default: "" },
  experience: { type: String, default: "" },
  skills: { type: String, default: "" },
  areaOfInterest: { type: String, default: "" },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  verifyToken: { type: String, default: null },
  verifyTokenExpires: { type: Date, default: null },
  verified: { type: Boolean, default: false },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral', default: null }, // Referral document ID
  referrerName: { type: String, default: null },
  referralLink: { type: String, default: null },
  isPaid: { type: Boolean, default: false },
  totalCourses: { type: Number, default: 1 },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},{timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = User;

