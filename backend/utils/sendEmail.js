const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, otp, pdfBuffer = null) {
  try {
    const response = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",
      to: to,
      subject: otp ? "OTP Verification" : "Your GST Invoice",
      html: otp
        ? `<h2>Your OTP is: ${otp}</h2>`
        : `<h2>Your Invoice is attached</h2>`,

      attachments: pdfBuffer
        ? [
            {
              filename: "invoice.pdf",
              content: pdfBuffer,
            },
          ]
        : [],
    });

    console.log("📩 Email sent:", response);
    return response;

  } catch (error) {
    console.error("❌ Email error:", error);
    return { error };
  }
}

module.exports = sendEmail;     
// =====================================
// ✅ SEND INVOICE EMAIL
// =====================================
async function sendInvoiceEmail(to, pdfBuffer) {
  try {
    const response = await resend.emails.send({
      from: "My App <onboarding@resend.dev>",
      to,
      subject: "Your GST Invoice",
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your GST invoice is attached.</p>
      `,

      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer, // ✅ correct (buffer)
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

module.exports = {
  sendOTPEmail,
  sendInvoiceEmail,
};