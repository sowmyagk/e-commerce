const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    // ===============================
    // 🟥 HEADER (LIKE NETFLIX STYLE)
    // ===============================
    doc
      .fontSize(20)
      .fillColor("#e50914")
      .text("FirstCry Clone", { align: "left" });

    doc
      .fontSize(10)
      .fillColor("black")
      .text("Kochi, India", { align: "right" })
      .text("support@firstcryclone.com", { align: "right" });

    doc.moveDown();

    // ===============================
    // 🧾 TITLE
    // ===============================
    doc
      .fontSize(18)
      .fillColor("black")
      .text("Payment Receipt", { align: "left" });

    doc.moveDown();

    // ===============================
    // 📄 ORDER DETAILS
    // ===============================
    doc.fontSize(12);

    doc.text(`Invoice ID: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Customer: ${order.email}`);

    doc.moveDown();

    // ===============================
    // 🛒 TABLE HEADER
    // ===============================
    const tableTop = doc.y;

    doc
      .fontSize(12)
      .text("Item", 50, tableTop)
      .text("Description", 120, tableTop)
      .text("Unit Cost", 300, tableTop)
      .text("Qty", 380, tableTop)
      .text("Line Total", 430, tableTop);

    doc.moveDown();

    // ===============================
    // 🛍️ PRODUCTS LIST
    // ===============================
    let y = doc.y;

    order.items.forEach((item, i) => {
      const lineTotal = item.price * item.quantity;

      doc
        .fontSize(11)
        .text(i + 1, 50, y)
        .text(item.name || "Product", 120, y)
        .text(`₹${item.price}`, 300, y)
        .text(item.quantity, 380, y)
        .text(`₹${lineTotal}`, 430, y);

      y += 20;
    });

    doc.moveDown();

    // ===============================
    // 💰 TOTALS
    // ===============================
    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    doc.moveDown();

    doc.text(`Subtotal: ₹${subtotal}`, { align: "right" });
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, { align: "right" });

    doc
      .fontSize(14)
      .text(`Total Amount: ₹${total.toFixed(2)}`, {
        align: "right",
      });

    doc.moveDown();

    // ===============================
    // 🙏 FOOTER
    // ===============================
    doc
      .fontSize(12)
      .text("Thank you for shopping with us!", { align: "center" });

    doc.end();
  });
}

module.exports = generateInvoice;