const mongoose = require("mongoose");

const policiesSchema = new mongoose.Schema({
  terms: { type: String, default: "" },
  privacy: { type: String, default: "" },
  cancel: { type: String, default: "" },
  refund: { type: String, default: "" },
  billing: { type: String, default: "" },
  refer: { type: String, default: "" },
});

const Policies = mongoose.model("Policy", policiesSchema);
module.exports = Policies;
