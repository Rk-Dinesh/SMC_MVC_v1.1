const TicketSupportService = require("../Service/ticketsupport_service");
const fs = require("fs");
const { gfs } = require("../Config/db");

// Upload Files
exports.uploadFiles = async (req, res, next) => {
  try {
    const files = req.files;
    const { user, ticketId, createdby } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    if (files.length > 5) {
      return res.status(400).json({ message: "File count exceeds the limit of 5" });
    }

    const attachments = await TicketSupportService.uploadFiles(files, user, ticketId, createdby);

    // Clean up temporary files
    for (const file of files) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json(attachments);
  } catch (error) {
    next(error);
  }
};

// Get Attachments by Ticket ID
exports.getAttachmentsByTicketId = async (req, res, next) => {
  try {
    const { ticketId } = req.query;

    const attachments = await TicketSupportService.getAttachmentsByTicketId(ticketId);

    res.status(200).json({ success: true, attachments });
  } catch (error) {
    next(error);
  }
};

// Get File by Filename
exports.getFileByFilename = async (req, res, next) => {
  try {
    const { filename } = req.params;

    const file = await TicketSupportService.getFileByFilename(filename);

    const readStream = gfs.openDownloadStream(file._id);
    res.set("Content-Type", file.contentType);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
};