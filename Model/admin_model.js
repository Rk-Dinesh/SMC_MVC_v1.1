const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    fname: String,
    lname: String,
    phone: String,
    dob: String,
    designation: String,
    password: String,
    type: { type: String, required: true },
    total: { type: Number, default: 0 },
    terms: { type: String, default: "" },
    privacy: { type: String, default: "" },
    cancel: { type: String, default: "" },
    refund: { type: String, default: "" },
    billing: { type: String, default: "" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    verifyToken: { type: String, default: null },
    verifyTokenExpires: { type: Date, default: null },
    verified: { type: Boolean, default: true },
  });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
