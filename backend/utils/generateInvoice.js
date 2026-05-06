const PDFDocument = require("pdfkit");

function generateInvoice(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

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


    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("TAX INVOICE", 400, 40);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Invoice No: INV-${order?._id?.toString().slice(-6) || "000000"}`, 400, 70)
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 400, 85);

    doc.moveTo(40, 120).lineTo(550, 120).stroke();


    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Bill To:", 40, 140);

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(order?.email || "N/A", 40, 160);

    if (order?.address) {
      doc.text(order.address, 40, 175);
    }

    const tableTop = 200;

    doc
      .rect(40, tableTop, 510, 25)
      .fillAndStroke("#eeeeee", "black");

    doc.fillColor("black").font("Helvetica-Bold");

    doc.text("No", 45, tableTop + 7);
    doc.text("Item", 80, tableTop + 7);
    doc.text("Price (₹)", 300, tableTop + 7, { width: 60, align: "right" });
    doc.text("Qty", 380, tableTop + 7, { width: 40, align: "right" });
    doc.text("Total (₹)", 450, tableTop + 7, { width: 80, align: "right" });

 
    let y = tableTop + 35;
    let subtotal = 0;

    doc.font("Helvetica");

    (order?.items || []).forEach((item, i) => {
      const qty = item?.quantity || 1;
      const price = item?.price || 0;
      const total = price * qty;

      subtotal += total;

      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(i + 1, 45, y);
      doc.text(item?.name || "Item", 80, y, { width: 200 });
      doc.text(price.toFixed(2), 300, y, { width: 60, align: "right" });
      doc.text(qty, 380, y, { width: 40, align: "right" });
      doc.text(total.toFixed(2), 450, y, { width: 80, align: "right" });

      y += 25;
    });

    doc.moveTo(40, y).lineTo(550, y).stroke();

    const cgst = +(subtotal * 0.09).toFixed(2);
    const sgst = +(subtotal * 0.09).toFixed(2);
    const totalAmount = subtotal + cgst + sgst;

    doc.font("Helvetica");

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, y + 20);
    doc.text(`CGST @9%: ₹${cgst}`, 350, y + 40);
    doc.text(`SGST @9%: ₹${sgst}`, 350, y + 60);

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`Grand Total: ₹${totalAmount.toFixed(2)}`, 300, y + 90, {
        align: "right",
        width: 250,
      });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Thank you for your purchase!", 40, y + 130);

    doc.text("This is a computer generated invoice.", 40, y + 145);

    doc.end();
  });
}

module.exports = generateInvoice;




















