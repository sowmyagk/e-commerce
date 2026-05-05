const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // 🔴 BRAND NAME (TOP LEFT)
    doc
      .fillColor("red")
      .fontSize(20)
      .text("FirstCry Clone", 40, 40);

    // 📍 RIGHT SIDE INFO
    doc
      .fillColor("black")
      .fontSize(10)
      .text("Kochi, India", 400, 40, { align: "right" })
      .text("support@firstcryclone.com", 400, 55, { align: "right" });

    // 🔲 LINE
    doc.moveTo(40, 80).lineTo(550, 80).stroke();

    // 🧾 TITLE
    doc.fontSize(18).text("Payment Receipt", 40, 100);

    doc.moveTo(40, 125).lineTo(550, 125).stroke();

    // 📄 ORDER DETAILS
    doc.fontSize(12);
    doc.text(`Invoice ID: ${order._id}`, 40, 140);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 40, 160);
    doc.text(`Customer: ${order.email}`, 40, 180);

    // 🛒 TABLE HEADER
    const tableTop = 220;

    doc.fontSize(12).text("Item", 40, tableTop);
    doc.text("Description", 100, tableTop);
    doc.text("Unit Cost", 300, tableTop);
    doc.text("Qty", 380, tableTop);
    doc.text("Line Total", 440, tableTop);

    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // 🛒 PRODUCTS
    let y = tableTop + 30;

    order.items.forEach((item, index) => {
      const qty = item.quantity || item.qty || 1;
      const price = item.price || 0;
      const total = price * qty;

      doc.text(index + 1, 40, y);
      doc.text(item.name, 100, y);
      doc.text(`₹${price}`, 300, y);
      doc.text(qty, 380, y);
      doc.text(`₹${total}`, 440, y);

      y += 25;
    });

    // 🔢 TOTAL SECTION (RIGHT SIDE)
    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    doc.text(`Subtotal: ₹${subtotal}`, 350, y + 20);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 350, y + 40);

    doc
      .font("Helvetica-Bold")
      .text(`Total Amount ₹${total.toFixed(2)}`, 350, y + 70);

    // ❌ REMOVED THANK YOU LINE (as you asked)

    doc.end();
  });
}

module.exports = generateInvoice;