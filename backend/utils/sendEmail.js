const nodemailer = require("nodemailer");

async function sendEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("✅ EMAIL SENT:", info.response);

  } catch (error) {
    console.log("❌ EMAIL ERROR FULL:", error);
  }
}

module.exports = sendEmail;