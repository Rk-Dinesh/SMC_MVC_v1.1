const mongoose = require("mongoose");

const prioritySchema = new mongoose.Schema({
  priority: String,
});

const Priority = mongoose.model("Priorty", prioritySchema);
module.exports = Priority;
