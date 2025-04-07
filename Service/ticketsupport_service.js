const fs = require("fs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Help = require("../Model/ticketsupport_model");
const { gfs } = require("../Config/db");

// Upload Files
exports.uploadFiles = async (files, user, ticketId, createdby) => {
  const attachments = [];
  for (const file of files) {
    const randomName = crypto.randomBytes(10).toString("hex");
    const writeStream = gfs.openUploadStream(randomName, {
      _id: new mongoose.Types.ObjectId(),
    });
    fs.createReadStream(file.path).pipe(writeStream);

    const attachment = new Help({
      user,
      ticketId,
      createdby,
      attachment_id: writeStream.id,
      attachment: randomName,
    });
    await attachment.save();
    attachments.push(attachment);
  }
  return attachments;
};

// Get Attachments by Ticket ID
exports.getAttachmentsByTicketId = async (ticketId) => {
  const attachments = await Help.find({ ticketId });
  if (!attachments || attachments.length === 0) {
    throw new Error("No attachments found for this ticketId");
  }
  return attachments;
};

// Get File by Filename
exports.getFileByFilename = async (filename) => {
  const file = await gfs.find({ filename }).toArray();
  if (!file || file.length === 0) {
    throw new Error("File not found");
  }
  return file[0];
};