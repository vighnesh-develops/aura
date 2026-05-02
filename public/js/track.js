const cartCountNode = document.getElementById("cartCount");
const searchInput = document.getElementById("globalSearch");
const trackForm = document.getElementById("trackForm");
const trackOrderId = document.getElementById("trackOrderId");
const trackingResult = document.getElementById("trackingResult");

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

const statusSteps = (order) => {
  const placedAt = order.placedAt ? new Date(order.placedAt) : new Date();
  const ageHours = Math.max(0, (Date.now() - placedAt.getTime()) / 36e5);
  const activeIndex = ageHours >= 48 ? 3 : ageHours >= 24 ? 2 : ageHours >= 2 ? 1 : 0;
  const steps = ["Order Placed", "Payment Verified", "Packed", "Out for Delivery"];
  return steps.map((label, index) => ({ label, done: index <= activeIndex }));
};

const orderItemsHtml = (order) =>
  order.items
    .map((item) => {
      const product = Store.getProductById(item.id);
      if (!product) return "";
      return `<li>${product.name} x ${item.quantity} - ${Store.formatINR(Store.discountedPrice(product) * item.quantity)}</li>`;
    })
    .join("");

const renderTracking = (id) => {
  const order = Store.getOrderById(id);
  trackingResult.classList.remove("hidden");

  if (!order) {
    trackingResult.innerHTML = `
      <h3>Order Not Found</h3>
      <p class="muted">Check the order ID from your confirmation page and try again.</p>
    `;
    return;
  }

  const steps = statusSteps(order);
  const currentStatus = [...steps].reverse().find((step) => step.done)?.label || "Order Placed";

  trackingResult.innerHTML = `
    <div class="tracking-head">
      <div>
        <p class="muted">Order ID</p>
        <h3>${order.id}</h3>
      </div>
      <span class="tracking-status">${currentStatus}</span>
    </div>
    <p class="muted"><strong>Customer:</strong> ${order.customer}</p>
    <p class="muted"><strong>Address:</strong> ${order.address}</p>
    <p class="muted"><strong>Placed:</strong> ${order.date}</p>
    <p class="muted"><strong>Estimated Delivery:</strong> ${order.eta || "3-5 business days"}</p>
    <div class="tracking-steps">
      ${steps
        .map(
          (step) => `
            <div class="tracking-step ${step.done ? "done" : ""}">
              <span></span>
              <p>${step.label}</p>
            </div>
          `
        )
        .join("")}
    </div>
    <h3>Items</h3>
    <ul class="spec-list">${orderItemsHtml(order)}</ul>
    <h3>Total: ${Store.formatINR(order.total)}</h3>
  `;
};

trackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderTracking(trackOrderId.value);
});

const initialId = new URLSearchParams(window.location.search).get("id");
if (initialId) {
  trackOrderId.value = initialId;
  renderTracking(initialId);
}

updateCartBadge();
window.addEventListener("cart:updated", updateCartBadge);
setupSearchRedirect();
