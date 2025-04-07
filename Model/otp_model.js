const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email:String,
    otp:Number,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '5m' 
    }
  });

const OTP = mongoose.model("otp",otpSchema);
module.exports = OTP;
