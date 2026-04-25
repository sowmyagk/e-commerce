const PDFDocument = require("pdfkit");

const generateInvoice = (order, userEmail) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

   
    doc.fontSize(20).text("GST INVOICE", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Customer: ${userEmail}`);

    doc.moveDown();
    doc.text("Items:");

  
    order.items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} - ₹${item.price} x ${item.quantity}`
      );
    });

    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    doc.moveDown();
    doc.text(`Subtotal: ₹${subtotal}`);
    doc.text(`GST (18%): ₹${gst}`);
    doc.text(`Total: ₹${total}`);

    doc.end();
  });
};

module.exports = generateInvoice;