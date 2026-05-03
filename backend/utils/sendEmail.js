const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, otp) {
  try {
    const response = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",  // ✅ working default sender
      to: to,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2>`,   // ✅ better than text
    });

    console.log("📩 Resend response:", response);

  } catch (error) {
    console.error("❌ Resend Error:", error);
    throw error; // important so server.js catches it
  }
}

module.exports = sendEmail;