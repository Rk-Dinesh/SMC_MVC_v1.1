const mongoose = require('mongoose');
const pvspSchema = new mongoose.Schema({
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
        required: false,
      },
    ],
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  pvspSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
  });
  
  pvspSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
  });
  
  const pvsp = mongoose.model("pvsp", pvspSchema);
  module.exports = pvsp;