const cartCountNode = document.getElementById("cartCount");
const searchInput = document.getElementById("globalSearch");
const ordersList = document.getElementById("ordersList");

const updateCartBadge = () => {
  cartCountNode.textContent = Store.cartCount();
};

const setupSearchRedirect = () => {
  searchInput.addEventListener("input", (event) => {
    const q = event.target.value.trim();
    if (q.length < 2) return;
    window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
  });
};

const latestStatus = (order) => {
  const placedAt = order.placedAt ? new Date(order.placedAt) : new Date();
  const ageHours = Math.max(0, (Date.now() - placedAt.getTime()) / 36e5);
  if (order.status) return order.status;
  if (ageHours >= 48) return "Out for Delivery";
  if (ageHours >= 24) return "Packed";
  if (ageHours >= 2) return "Payment Verified";
  return "Order Placed";
};

window.cancelOrder = (id) => {
  if (confirm("Are you sure you want to cancel this order?")) {
    Store.updateOrderStatus(id, "Cancelled");
    renderOrders();
  }
};

const itemSummary = (order) =>
  order.items
    .map((item) => {
      const product = Store.getProductById(item.id);
      return product ? `${product.name} x ${item.quantity}` : "";
    })
    .filter(Boolean)
    .join(", ");

const renderOrders = () => {
  const orders = Store.getOrders().slice().reverse();

  if (!orders.length) {
    ordersList.innerHTML = `
      <section class="glass empty-orders">
        <h3>No orders yet</h3>
        <p class="muted">Your completed purchases will appear here after checkout.</p>
        <a class="btn btn-primary" href="shop.html">Start Shopping</a>
      </section>
    `;
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
        <article class="glass order-card">
          <div class="order-card-head">
            <div>
              <p class="muted">Order ID</p>
              <h3>${order.id}</h3>
            </div>
            <span class="tracking-status">${latestStatus(order)}</span>
          </div>
          <p class="muted"><strong>Placed:</strong> ${order.date}</p>
          <p class="muted"><strong>Payment:</strong> ${order.payment}</p>
          <p class="muted"><strong>Items:</strong> ${itemSummary(order)}</p>
          <div class="order-card-foot">
            <strong>${Store.formatINR(order.total)}</strong>
            <div style="display: flex; gap: 0.5rem;">
              ${latestStatus(order) !== "Cancelled" && latestStatus(order) !== "Out for Delivery" ? `<button class="btn btn-ghost" onclick="cancelOrder('${order.id}')">Cancel</button>` : ""}
              <a class="btn btn-primary" href="track.html?id=${encodeURIComponent(order.id)}">Track Order</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

updateCartBadge();
window.addEventListener("cart:updated", updateCartBadge);
setupSearchRedirect();
renderOrders();
