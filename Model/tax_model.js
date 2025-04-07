const mongoose = require("mongoose");

const TaxSchema = new mongoose.Schema({
  taxname: String,
  percentage: String,
});

const Tax = mongoose.model("Tax", TaxSchema);
module.exports = Tax;
