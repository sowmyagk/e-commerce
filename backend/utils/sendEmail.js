const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}`,
    html: `<h2>Your OTP is: ${otp}</h2>`,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;