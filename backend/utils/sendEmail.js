const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, otp) {
  return await resend.emails.send({
    from: "My App <onboarding@resend.dev>",
    to: to,
    subject: "OTP Verification",
    html: `<h2>Your OTP is: ${otp}</h2>`
  });
}

module.exports = sendEmail;