const nodemailer = require("nodemailer");

async function sendEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // ✅ use this instead of host
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;