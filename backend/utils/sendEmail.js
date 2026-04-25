const nodemailer = require("nodemailer");

const sendEmail = async (to, pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Your Order Invoice",
    text: "Thank you for your purchase. Please find attached invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer
      }
    ]
  });
};

module.exports = sendEmail;