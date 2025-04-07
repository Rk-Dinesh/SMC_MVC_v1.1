const Ticket = require("../Model/ticket_model");
const transporter = require("./transporter_service");

exports.createTicket = async (ticketData) => {
  console.log(ticketData);
  
  ticketData.status = "New Ticket";

  const newTicket = new Ticket(ticketData);
  await newTicket.save();

  return newTicket;
};

exports.updateTicket = async (ticketId, updateData) => {
  return await Ticket.findOneAndUpdate({ ticketId }, updateData, { new: true });
};

exports.deleteTicket = async (ticketId) => {
  return await Ticket.findOneAndDelete({ ticketId });
};

exports.getAllTickets = async () => {
  return await Ticket.find();
};

exports.getTicketById = async (ticketId) => {
  return await Ticket.findOne({ ticketId });
};

exports.getTicketsByUserId = async (user) => {
  return await Ticket.find({ user });
};
