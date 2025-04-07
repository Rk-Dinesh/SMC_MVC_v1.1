const TicketService = require("../Service/ticket_service");
const crypto = require("crypto");
const transporter = require("../Service/transporter_service");

exports.createTicket = async (req, res, next) => {
  const {
    user,
    category,
    subject,
    desc1,
    priority,
  } = req.body;
  const userDetails = await User.findOne({ _id: user })
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { fname, lname, email, phone } = userDetails;
  const token = crypto.randomBytes(2).toString("hex");
  const ticketId = `Ticket${token}`;
  try {
    const ticket = await TicketService.createTicket({
      ticketId: ticketId,
      user,
      fname,
      lname,
      email,
      phone,
      category,
      subject,
      desc1,
      priority,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "Ticket created successfully",
        ticketId: ticket.ticketId,
      });

    const mailOptions = {
      from: process.env.EMAIL,
      to: ticket.email,
      subject: `Your Seek My Course Support Ticket Has Been Received ${ticket.ticketId}`,
      html: `
                       <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          </head>
          <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
              <tr style="width:100%">
                <td>
                  <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Your Seek My Course Support Ticket  ${ticketId} ! </h1>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Hi <strong>${ticket.fname} ${ticket.lname}</strong>,</p>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">This email confirms that we've received your support <strong> ${ticket.ticketId} </strong></p>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Thank you for contacting <strong>Seek My Course</strong>  Support! We appreciate you reaching out to us.</p>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">We understand you're experiencing an issue with <strong> ${ticket.subject} </strong>. Our team is currently reviewing your request and will be in touch within 1 business day to assist you further</p>
                  <p style="font-size:14px;line-height:10px;margin:16px 0;color:rgb(0,0,0)">You may also find helpful information in our Help Center:</p>
                  <p style="margin-left:0px;margin-right:0px;margin-top:5px;margin-bottom:5px;padding:0px;font-size:14px;line-height:10px;margin:16px 0;color:rgb(78, 166, 226)"><a href="https://helpcenter.pickmycourseai.support/" target="_blank" >https://helpcenter.pickmycourseai.support/</a></p>
                  <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">We appreciate your patience and understanding.</p>
                  <p style="font-size:14px;line-height:10px;margin:16px 0;color:rgb(0,0,0)">Sincerely,</p>
                  <p style="font-size:14px;line-height:10px;margin:16px 0;color:rgb(0,0,0)">The <strong>Seek My Course</strong> Team</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.query;
    const { desc2, status, team } = req.body;
    const updatedTicket = await TicketService.updateTicket(ticketId, {
      desc2,
      status,
      team,
    });

    if (!updatedTicket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Ticket updated successfully",
        ticket: updatedTicket,
      });
  } catch (error) {
    next(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.query;
    const deletedTicket = await TicketService.deleteTicket(ticketId);

    if (!deletedTicket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Ticket deleted successfully",
        ticket: deletedTicket,
      });
  } catch (error) {
    next(error);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await TicketService.getAllTickets();
    res.status(200).json({ success: true, ticket:tickets });
  } catch (error) {
    next(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const { ticketId } = req.query;
    const ticket = await TicketService.getTicketById(ticketId);

    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });

    res.status(200).json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

exports.getTicketsByUserId = async (req, res, next) => {
  try {
    const { user } = req.query;
    const tickets = await TicketService.getTicketsByUserId(user);
    res.status(200).json({ success: true,ticket: tickets });
  } catch (error) {
    next(error);
  }
};
