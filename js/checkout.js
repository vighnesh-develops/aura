const checkoutTotalNode = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const cartCountNode = document.getElementById("cartCount");
const searchInput = document.getElementById("globalSearch");
const continueOrderBtn = document.getElementById("continueOrderBtn");
const paymentQrPanel = document.getElementById("paymentQrPanel");
const qrTitle = document.getElementById("qrTitle");
const qrHelp = document.getElementById("qrHelp");
const upiIdInput = document.getElementById("upiId");
const updateQrBtn = document.getElementById("updateQrBtn");
const paymentApproved = document.getElementById("paymentApproved");
const approvalMessage = document.getElementById("approvalMessage");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const paymentQrImage = document.getElementById("paymentQrImage");

let selectedPayment = "";

const syncOrderToServer = async (order) => {
  let base = window.AURASOUND_API_BASE;
  // Handle empty string as localhost
  if (base === "" || base === undefined || base === null) {
    base = "http://localhost:3000";
  }
  try {
    const root = String(base).replace(/\/$/, "");
    const response = await fetch(`${root}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      console.error("Failed to sync order to server:", response.status);
    } else {
      console.log("Order synced to server successfully");
    }
  } catch (e) {
    console.error("Error syncing order to server:", e.message);
    /* offline API — local order still saved */
  }
};

const createOrderId = () => {
  const dateCode = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const randomCode = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `AS-${dateCode}-${randomCode}`;
};

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

const qrSource = () => {
  const total = Store.cartTotal();
  const upiId = upiIdInput.value.trim() || "ms8948748@okicici";

  if (selectedPayment === "PayPal QR") {
    return "https://www.paypal.com/paypalme/aurasound";
  }

  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("AURASOUND")}&am=${total}&cu=INR&tn=${encodeURIComponent("AURASOUND order payment")}`;
};

const refreshQr = () => {
  paymentQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrSource())}`;
};

const updatePlaceOrderState = () => {
  const needsQrApproval = selectedPayment === "UPI" || selectedPayment === "PayPal QR";
  const approved = !needsQrApproval || paymentApproved.checked;
  placeOrderBtn.disabled = !approved;
  approvalMessage.classList.toggle("hidden", approved);
};

const showPaymentStep = () => {
  const checked = checkoutForm.querySelector('input[name="payment"]:checked');
  if (!checkoutForm.reportValidity() || !checked) return;

  selectedPayment = checked.value;
  const isQrPayment = selectedPayment === "UPI" || selectedPayment === "PayPal QR";

  qrTitle.textContent = selectedPayment === "PayPal QR" ? "Pay with PayPal QR" : "Pay with UPI QR";
  qrHelp.textContent = selectedPayment === "PayPal QR"
    ? "Scan this QR in PayPal, then approve the payment manually below."
    : "Scan this QR in any UPI app, pay to the editable UPI ID below, then approve the payment manually.";

  paymentQrPanel.classList.toggle("hidden", !isQrPayment);
  upiIdInput.closest(".payment-edit").classList.toggle("hidden", selectedPayment !== "UPI");
  updateQrBtn.classList.toggle("hidden", selectedPayment !== "UPI");
  paymentApproved.closest(".approval-check").classList.toggle("hidden", !isQrPayment);
  paymentApproved.checked = false;

  if (isQrPayment) refreshQr();

  continueOrderBtn.classList.add("hidden");
  placeOrderBtn.classList.remove("hidden");
  updatePlaceOrderState();
};

const setupCheckout = () => {
  const cart = Store.getCart();
  if (!cart.length) {
    window.location.href = "cart.html";
    return;
  }
  checkoutTotalNode.textContent = Store.formatINR(Store.cartTotal());

  checkoutForm.querySelectorAll('input[name="payment"]').forEach((option) => {
    option.addEventListener("change", () => {
      continueOrderBtn.classList.remove("hidden");
      paymentQrPanel.classList.add("hidden");
      placeOrderBtn.classList.add("hidden");
      approvalMessage.classList.add("hidden");
      placeOrderBtn.disabled = true;
    });
  });

  continueOrderBtn.addEventListener("click", showPaymentStep);
  updateQrBtn.addEventListener("click", refreshQr);
  paymentApproved.addEventListener("change", updatePlaceOrderState);

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updatePlaceOrderState();
    if (placeOrderBtn.disabled) return;

    const orderItems = cart.map((item) => {
      const product = Store.getProductById(item.id);
      const unitPrice = product ? Store.discountedPrice(product) : 0;
      return {
        ...item,
        slug: item.id,
        name: product?.name || item.id,
        unitPrice,
      };
    });

    const order = {
      id: createOrderId(),
      customer: document.getElementById("fullName").value.trim(),
      address: document.getElementById("address").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      payment: checkoutForm.querySelector('input[name="payment"]:checked').value,
      paymentUpiId: upiIdInput.value.trim(),
      paymentApproved: paymentApproved.checked,
      items: orderItems,
      total: Store.cartTotal(),
      status: "Order Placed",
      eta: "3-5 business days",
      placedAt: new Date().toISOString(),
      date: new Date().toLocaleString()
    };
    Store.saveLastOrder(order);
    void syncOrderToServer(order);
    Store.clearCart();
    window.location.href = "confirmation.html";
  });
};

updateCartBadge();
window.addEventListener("cart:updated", updateCartBadge);
setupSearchRedirect();
setupCheckout();
