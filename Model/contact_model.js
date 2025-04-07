const mongoose = require("mongoose");

const contactShema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    phone: Number,
    msg: String,
    date: { type: Date, default: Date.now },
  });

const Contact = mongoose.model("Contact", contactShema);
module.exports = Contact;
