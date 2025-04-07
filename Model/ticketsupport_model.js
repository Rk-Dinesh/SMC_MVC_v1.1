const mongoose = require("mongoose");

const HelpSchema = new mongoose.Schema(
  {
    user: String,
    ticketId: String,
    createdby: String,
    attachment: String,
    attachment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GridFSBucket",
    },
  },
  { timestamps: true }
);

const Help = mongoose.model("Help", HelpSchema);
module.exports = Help;
