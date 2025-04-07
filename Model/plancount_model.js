const mongoose = require("mongoose");

const planCountShema = new mongoose.Schema({
  user: String,
  count: Number,
});

const Count = mongoose.model("Count", planCountShema);
module.exports = Count;
