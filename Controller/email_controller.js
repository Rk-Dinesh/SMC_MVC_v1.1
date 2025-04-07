const EmailService = require("../Service/email_service");

exports.sendEmail = async (req, res, next) => {
    try {
        const receivedData = req.body;

        if (!receivedData.to || !receivedData.subject || !receivedData.html) {
            return res.status(400).json({
                success: false,
                error: "MISSING_FIELDS",
                message: "Missing required fields: 'to', 'subject', or 'html'",
            });
        }

        const emailResponse = await EmailService.sendEmail(receivedData);

        res.status(200).json({
            success: true,
            message: "Email sent successfully",
            data: emailResponse,
        });
    } catch (error) {
        next(error);
    }
};