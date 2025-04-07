const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    user: String,
    fname: String,
    lname: String,
    phone: String,
    email: String,
    ticketId: String,
    category: String,
    subject: String,
    desc1: String,
    desc2: { type: String, default: null },
    priority: String,
    status: { type: String, default: null },
    team: { type: String, default: null },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
