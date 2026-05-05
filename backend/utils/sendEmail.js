const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================
// ✅ SEND OTP EMAIL
// =====================================
async function sendOTPEmail(to, otp) {
  try {
    const response = await resend.emails.send({
      from: "My App <onboarding@resend.dev>", // change later
      to: to,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    console.log("📩 OTP Email sent:", response);
    return response;

  } catch (error) {
    console.error("❌ OTP Email error:", error);
    return { error };
  }
}

// =====================================
// ✅ SEND INVOICE EMAIL
// =====================================
async function sendInvoiceEmail(to, pdfBuffer) {
  try {
    const response = await resend.emails.send({
      from: "My App <onboarding@resend.dev>", // change later
      to: to,
      subject: "Your GST Invoice",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your GST invoice is attached.</p>
      `,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("📩 Invoice Email sent:", response);
    return response;

  } catch (error) {
    console.error("❌ Invoice Email error:", error);
    return { error };
  }
}

// ✅ EXPORT BOTH (ONLY ONCE)
module.exports = {
  sendOTPEmail,
  sendInvoiceEmail,
};