const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 30 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // 🔲 OUTER BORDER
    doc.rect(20, 20, 555, 750).stroke();

    // 🔴 BRAND NAME
    doc
      .fillColor("red")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("FirstCry Clone", 40, 40);

    // 📍 RIGHT SIDE INFO
    doc
      .fillColor("black")
      .fontSize(10)
      .font("Helvetica")
      .text("Kochi, India", 400, 40, { align: "right", width: 150 })
      .text("support@firstcryclone.com", 400, 55, { align: "right", width: 150 });

    // 🔲 LINE
    doc.moveTo(40, 80).lineTo(550, 80).stroke();

    // 🧾 TITLE
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Payment Receipt", 40, 100);

    doc.moveTo(40, 130).lineTo(550, 130).stroke();

    // 📄 DETAILS
    doc.font("Helvetica").fontSize(12);

    doc.text("Invoice ID:", 40, 150);
    doc.text(order._id, 140, 150);

    doc.text("Date:", 40, 170);
    doc.text(new Date().toLocaleDateString(), 140, 170);

    doc.text("Customer:", 40, 190);
    doc.text(order.email, 140, 190);

    // 🌍 RIGHT SIDE COUNTRY
    doc.text("India", 450, 170);

    // 💰 AMOUNT
    doc.text(`Amount: \u20B9${order.totalAmount.toFixed(2)}`, 40, 220);

    // 🔳 TABLE HEADER
    doc
      .rect(40, 250, 510, 25)
      .fillAndStroke("#eeeeee", "black");

    doc.fillColor("black").font("Helvetica-Bold");

    doc.text("Item", 45, 257);
    doc.text("Description", 100, 257);
    doc.text("Unit Cost", 300, 257);
    doc.text("Qty", 390, 257);
    doc.text("Line Total", 450, 257);

    // 🛒 PRODUCTS
    let y = 285;
    doc.font("Helvetica");

    order.items.forEach((item, index) => {
      const qty = item.quantity || item.qty || 1;
      const price = item.price || 0;
      const total = price * qty;

      doc.text(index + 1, 45, y);
      doc.text(item.name || "-", 100, y);
      doc.text(`\u20B9${price}`, 300, y);
      doc.text(qty, 390, y);
      doc.text(`\u20B9${total}`, 450, y);

      y += 25;
    });

    // 🔲 LINE BEFORE TOTAL
    doc.moveTo(40, y).lineTo(550, y).stroke();

    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const finalTotal = subtotal + gst;

    // 💰 TOTALS (RIGHT SIDE)
    doc.font("Helvetica");

    doc.text(`Subtotal: \u20B9${subtotal}`, 350, y + 20);
    doc.text(`GST (18%): \u20B9${gst.toFixed(2)}`, 350, y + 40);

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`Total Amount \u20B9${finalTotal.toFixed(2)}`, 300, y + 70, {
        align: "right",
        width: 250
      });

    doc.end();
  });
}

module.exports = generateInvoice;