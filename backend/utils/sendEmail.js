const nodemailer = require("nodemailer");

const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("✅ OTP Email Sent");
  } catch (err) {
    console.log("❌ EMAIL ERROR:", err);
    throw err;
  }
};

module.exports = sendEmailOTP;