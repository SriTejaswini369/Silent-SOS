
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info.messageId);

        return true;

    } catch (error) {
        console.error("Email sending failed:", error.message);

        return false;
    }
};

module.exports = sendEmail;