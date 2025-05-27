const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,    // candlesandcapital@gmail.com
      pass: process.env.EMAIL_PASS     // your 16-char app password, no spaces
    },
  });

  // Define email options
  const mailOptions = {
    from: `Candles <candlesandcapital@gmail.com>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;