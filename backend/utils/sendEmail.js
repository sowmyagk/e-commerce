const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, otp) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: to,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  });
}

module.exports = sendEmail;