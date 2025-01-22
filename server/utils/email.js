const nodemailer = require('nodemailer');
require('dotenv').config(); 

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Correct service for Gmail
    port: 465,        // SMTP port for TLS
    logger: true,  // Enable logging
    debug: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to the server:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

const sendVerificationEmail = async (email, code) => {
    console.log('Email:', process.env.EMAIL_USER);
console.log('Password:', process.env.USER_PASS);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    };  
    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
