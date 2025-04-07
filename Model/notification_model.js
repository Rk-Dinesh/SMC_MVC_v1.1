const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: String,
    subject: String,
    description: String,
    read: String,
  },
  { timestamps: true }
);

const Notify = mongoose.model("Notify", NotificationSchema);
module.exports = Notify;
