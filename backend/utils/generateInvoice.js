const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 30 });

      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // ✅ Font paths
      const regularFont = path.join(__dirname, "../fonts/DejaVuSans.ttf");
      const boldFontPath = path.join(__dirname, "../fonts/DejaVuSans-Bold.ttf");

      // ✅ Check if bold font exists, else fallback
      const boldFont = fs.existsSync(boldFontPath)
        ? boldFontPath
        : regularFont;

      // ₹ symbol
      const rupee = "\u20B9";

      // 🔲 BORDER
      doc.rect(20, 20, 555, 750).stroke();

      // 🔴 BRAND NAME
      doc
        .font(boldFont)
        .fillColor("red")
        .fontSize(22)
        .text("FirstCry Clone", 40, 40);

      // 📍 RIGHT SIDE INFO
      doc
        .font(regularFont)
        .fillColor("black")
        .fontSize(10)
        .text("Kochi, India", 400, 40, { align: "right" })
        .text("support@firstcryclone.com", 400, 55, { align: "right" });

      // LINE
      doc.moveTo(40, 80).lineTo(550, 80).stroke();

      // 🧾 TITLE
      doc
        .font(boldFont)
        .fontSize(20)
        .text("Payment Receipt", 40, 100);

      doc.moveTo(40, 130).lineTo(550, 130).stroke();

      // 📄 DETAILS
      doc.font(regularFont).fontSize(12);

      doc.text("Invoice ID:", 40, 150);
      doc.text(order._id || "-", 140, 150);

      doc.text("Date:", 40, 170);
      doc.text(new Date().toLocaleDateString(), 140, 170);

      doc.text("Customer:", 40, 190);
      doc.text(order.email || "-", 140, 190);

      doc.text("India", 450, 170);

      // 💰 AMOUNT
      const totalAmount = Number(order.totalAmount || 0);
      doc.text(`Amount: ${rupee}${totalAmount.toFixed(2)}`, 40, 220);

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

      const items = order.items || [];

      items.forEach((item, index) => {
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.price || 0);
        const total = price * qty;

        doc.text(index + 1, 45, y);
        doc.text(item.name || "-", 100, y);
        doc.text(`${rupee}${price.toFixed(2)}`, 300, y);
        doc.text(qty.toString(), 390, y);
        doc.text(`${rupee}${total.toFixed(2)}`, 450, y);

        y += 25;
      });

      // 🔲 LINE BEFORE TOTAL
      doc.moveTo(40, y).lineTo(550, y).stroke();

      // 💰 CALCULATIONS
      const subtotal = totalAmount;
      const gst = subtotal * 0.18;
      const finalTotal = subtotal + gst;

      // 💰 TOTALS
      doc.font(regularFont);

      doc.text(`Subtotal: ${rupee}${subtotal.toFixed(2)}`, 350, y + 20);
      doc.text(`GST (18%): ${rupee}${gst.toFixed(2)}`, 350, y + 40);

      doc
        .font(boldFont)
        .fontSize(13)
        .text(`Total Amount ${rupee}${finalTotal.toFixed(2)}`, 350, y + 70);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = generateInvoice; 