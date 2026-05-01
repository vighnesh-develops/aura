const orderSummary = document.getElementById("orderSummary");
const downloadBillBtn = document.getElementById("downloadBillBtn");

const orderLines = (order) =>
  order.items
    .map((item) => {
      const product = Store.getProductById(item.id);
      if (!product) return "";
      const unitPrice = Store.discountedPrice(product);
      return {
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity
      };
    })
    .filter(Boolean);

const renderSummary = () => {
  const order = Store.getLastOrder();
  if (!order) {
    orderSummary.innerHTML = `<p>No recent order found.</p>`;
    downloadBillBtn.classList.add("hidden");
    return;
  }

  const lines = orderLines(order)
    .map((item) => `<li>${item.name} x ${item.quantity} - ${Store.formatINR(item.lineTotal)}</li>`)
    .join("");

  orderSummary.innerHTML = `
    <h3>Order Summary</h3>
    <p class="muted"><strong>Name:</strong> ${order.customer}</p>
    <p class="muted"><strong>Address:</strong> ${order.address}</p>
    <p class="muted"><strong>Phone:</strong> ${order.phone}</p>
    <p class="muted"><strong>Payment:</strong> ${order.payment}</p>
    ${order.paymentUpiId ? `<p class="muted"><strong>UPI ID:</strong> ${order.paymentUpiId}</p>` : ""}
    ${order.paymentApproved ? `<p class="muted"><strong>QR Payment:</strong> Manually approved</p>` : ""}
    <p class="muted"><strong>Placed:</strong> ${order.date}</p>
    <ul class="spec-list">${lines}</ul>
    <h3>Total Paid: ${Store.formatINR(order.total)}</h3>
  `;
};

const billHtml = (order) => {
  const rows = orderLines(order)
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${Store.formatINR(item.unitPrice)}</td>
          <td>${Store.formatINR(item.lineTotal)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AURASOUND Bill</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 32px; }
          h1 { margin-bottom: 4px; }
          .muted { color: #4b5563; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
          th { background: #f3f4f6; }
          .total { text-align: right; margin-top: 24px; font-size: 20px; font-weight: 700; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>AURASOUND Bill</h1>
        <p class="muted">Generated on ${new Date().toLocaleString()}</p>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Payment:</strong> ${order.payment}${order.paymentUpiId ? ` (${order.paymentUpiId})` : ""}</p>
        <p><strong>Order Date:</strong> ${order.date}</p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="total">Total Paid: ${Store.formatINR(order.total)}</p>
        <script>window.onload = () => window.print();<\/script>
      </body>
    </html>
  `;
};

downloadBillBtn.addEventListener("click", () => {
  const order = Store.getLastOrder();
  if (!order) return;

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(billHtml(order));
  printWindow.document.close();
});

renderSummary();
