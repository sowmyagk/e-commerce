const PDFDocument = require("pdfkit");
const path = require("path");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 30 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // ✅ Load Fonts (IMPORTANT)
    const regularFont = path.join(__dirname, "../fonts/DejaVuSans.ttf");
    const boldFont = path.join(__dirname, "../fonts/DejaVuSans-Bold.ttf");

    const rupee = "\u20B9"; // ₹ symbol

    // 🔲 BORDER
    doc.rect(20, 20, 555, 750).stroke();

    // 🔴 TITLE
    doc
      .font(boldFont)
      .fillColor("red")
      .fontSize(22)
      .text("FirstCry Clone", 40, 40);

    // 📍 RIGHT INFO
    doc
      .font(regularFont)
      .fillColor("black")
      .fontSize(10)
      .text("Kochi, India", 400, 40, { align: "right" })
      .text("support@firstcryclone.com", 400, 55, { align: "right" });

    doc.moveTo(40, 80).lineTo(550, 80).stroke();

    // 🧾 HEADER
    doc
      .font(boldFont)
      .fontSize(20)
      .text("Payment Receipt", 40, 100);

    doc.moveTo(40, 130).lineTo(550, 130).stroke();

    // 📄 DETAILS
    doc.font(regularFont).fontSize(12);

    doc.text("Invoice ID:", 40, 150);
    doc.text(order._id, 140, 150);

    doc.text("Date:", 40, 170);
    doc.text(new Date().toLocaleDateString(), 140, 170);

    doc.text("Customer:", 40, 190);
    doc.text(order.email, 140, 190);

    doc.text("India", 450, 170);

    // 💰 AMOUNT
    doc.text(`Amount: ${rupee}${order.totalAmount.toFixed(2)}`, 40, 220);

    // 🔳 TABLE HEADER
    doc.rect(40, 250, 510, 25).fillAndStroke("#eeeeee", "black");

    doc.fillColor("black").font(boldFont);

    doc.text("Item", 45, 257);
    doc.text("Description", 100, 257);
    doc.text("Unit Cost", 300, 257);
    doc.text("Qty", 390, 257);
    doc.text("Line Total", 450, 257);

    // 🛒 ITEMS
    let y = 285;
    doc.font(regularFont);

    order.items.forEach((item, index) => {
      const qty = item.quantity || item.qty || 1;
      const price = item.price || 0;
      const total = price * qty;

      doc.text(index + 1, 45, y);
      doc.text(item.name || "-", 100, y);
      doc.text(`${rupee}${price}`, 300, y);
      doc.text(qty, 390, y);
      doc.text(`${rupee}${total}`, 450, y);

      y += 25;
    });

    // 🔲 LINE
    doc.moveTo(40, y).lineTo(550, y).stroke();

    const subtotal = order.totalAmount;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    // 💰 TOTALS
    doc.font(regularFont);

    doc.text(`Subtotal: ${rupee}${subtotal}`, 350, y + 20);
    doc.text(`GST (18%): ${rupee}${gst.toFixed(2)}`, 350, y + 40);

    doc
      .font(boldFont)
      .fontSize(13)
      .text(`Total Amount ${rupee}${total.toFixed(2)}`, 350, y + 70);

    doc.end();
  });
}

module.exports = generateInvoice;