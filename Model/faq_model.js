const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);
module.exports = Faq;
