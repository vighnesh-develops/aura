const cartCountNode = document.getElementById("cartCount");
const cartContent = document.getElementById("cartContent");
const searchInput = document.getElementById("globalSearch");
const placeholderImage = "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80";

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

const renderCart = () => {
  const cart = Store.getCart();
  if (!cart.length) {
    cartContent.innerHTML = `<p>Your cart is empty. <a class="btn" href="shop.html">Explore products</a></p>`;
    return;
  }

  cartContent.innerHTML = cart
    .map((item) => {
      const product = Store.getProductById(item.id);
      if (!product) return "";
      return `
      <article class="cart-row">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${placeholderImage}'" />
        <div>
          <h4>${product.name}</h4>
          <p class="muted">${product.discountPercent}% off: ${Store.formatINR(Store.discountedPrice(product))} <span class="old-price">${Store.formatINR(product.price)}</span></p>
        </div>
        <input type="number" min="1" value="${item.quantity}" data-qty="${product.id}" />
        <strong>${Store.formatINR(Store.discountedPrice(product) * item.quantity)}</strong>
        <button class="btn" data-remove="${product.id}">Remove</button>
      </article>`;
    })
    .join("");

  cartContent.innerHTML += `
    <div class="total-box">
      <h3>Total: ${Store.formatINR(Store.cartTotal())}</h3>
      <a class="btn btn-primary" href="checkout.html">Proceed to Checkout</a>
    </div>
  `;

  document.querySelectorAll("[data-qty]").forEach((node) => {
    node.addEventListener("change", () => {
      Store.updateQuantity(node.dataset.qty, Number(node.value));
      renderCart();
      updateCartBadge();
    });
  });

  document.querySelectorAll("[data-remove]").forEach((node) => {
    node.addEventListener("click", () => {
      Store.removeFromCart(node.dataset.remove);
      renderCart();
      updateCartBadge();
    });
  });
};

updateCartBadge();
window.addEventListener("cart:updated", () => {
  updateCartBadge();
  renderCart();
});
setupSearchRedirect();
renderCart();
