const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
