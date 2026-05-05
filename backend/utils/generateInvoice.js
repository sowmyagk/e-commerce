const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // =========================
    // 🏢 COMPANY DETAILS
    // =========================
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("FirstCry Clone Pvt Ltd", 40, 40);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Kochi, Kerala, India", 40, 65)
      .text("Email: support@firstcryclone.com", 40, 80)
      .text("GSTIN: 32ABCDE1234F1Z5", 40, 95);

    // =========================
    // 🧾 INVOICE TITLE
    // =========================
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("TAX INVOICE", 400, 40);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Invoice No: INV-${order._id.toString().slice(-6)}`, 400, 70)
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 400, 85);

    // LINE
    doc.moveTo(40, 120).lineTo(550, 120).stroke();

    // =========================
    // 👤 BILL TO
    // =========================
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bill To:", 40, 140);

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(order.email, 40, 160);

    // =========================
    // 📦 TABLE HEADER
    // =========================
    const tableTop = 200;

    doc
      .rect(40, tableTop, 510, 25)
      .fillAndStroke("#eeeeee", "black");

    doc.fillColor("black").font("Helvetica-Bold");

    doc.text("No", 45, tableTop + 7);
    doc.text("Item", 80, tableTop + 7);
    doc.text("Price (₹)", 300, tableTop + 7);
    doc.text("Qty", 380, tableTop + 7);
    doc.text("Total (₹)", 450, tableTop + 7);

    // =========================
    // 🛒 ITEMS
    // =========================
    let y = tableTop + 35;
    doc.font("Helvetica");

    let subtotal = 0;

    order.items.forEach((item, i) => {
      const qty = item.quantity || 1;
      const price = item.price || 0;
      const total = price * qty;

      subtotal += total;

      doc.text(i + 1, 45, y);
      doc.text(item.name, 80, y);
      doc.text(price.toFixed(2), 300, y);
      doc.text(qty, 380, y);
      doc.text(total.toFixed(2), 450, y);

      y += 25;
    });

    // LINE
    doc.moveTo(40, y).lineTo(550, y).stroke();

    // =========================
    // 💰 GST CALCULATION
    // =========================
    const cgst = +(subtotal * 0.09).toFixed(2);
    const sgst = +(subtotal * 0.09).toFixed(2);
    const totalAmount = subtotal + cgst + sgst;

    doc.font("Helvetica");

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, y + 20);
    doc.text(`CGST (9%): ₹${cgst}`, 350, y + 40);
    doc.text(`SGST (9%): ₹${sgst}`, 350, y + 60);

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 300, y + 90, {
        align: "right",
        width: 250
      });

    // =========================
    // 📝 FOOTER
    // =========================
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Thank you for your purchase!", 40, 700);

    doc
      .text("This is a computer generated invoice.", 40, 715);

    doc.end();
  });
}

module.exports = generateInvoice;