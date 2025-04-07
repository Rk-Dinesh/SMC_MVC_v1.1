require('dotenv').config();
const transporter = require("./transporter_service");

exports.sendEmail = async (emailData) => {
    const { to, subject, html } = emailData;

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw new Error("Failed to send email");
    }
};