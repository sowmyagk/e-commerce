const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();

    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // 🧾 GST Invoice Content
    doc.fontSize(20).text("GST INVOICE", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.email}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    // 🛒 Products
    doc.text("Products:");
    order.items.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.name} - ₹${item.price} x ${item.qty}`);
    });

    doc.moveDown();

    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    doc.text(`Subtotal: ₹${subtotal}`);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`);
    doc.text(`Total: ₹${total.toFixed(2)}`);

    doc.moveDown();
    doc.text("Thank you for shopping with us!");

    doc.end();
  });
}

module.exports = generateInvoice;