const cartCountNode = document.getElementById("cartCount");
const searchInput = document.getElementById("globalSearch");
const grid = document.getElementById("shopGrid");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const ratingFilter = document.getElementById("ratingFilter");
const resultsCount = document.getElementById("resultsCount");
const categoryCards = document.querySelectorAll("[data-category-jump]");
const placeholderImage = "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80";

const updateCartBadge = () => {
  cartCountNode.textContent = Store.cartCount();
};

const setupTopSearch = () => {
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("search") || "";
  searchInput.value = initial;
  searchInput.addEventListener("input", render);
};

const populateBrands = () => {
  while (brandFilter.options.length > 1) {
    brandFilter.remove(1);
  }
  const brands = [...new Set(Store.products.map((item) => item.brand))].sort();
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
};

const syncCategoryCards = () => {
  categoryCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.categoryJump === categoryFilter.value);
  });
};

const setupCategorySections = () => {
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      categoryFilter.value = card.dataset.categoryJump;
      searchInput.value = "";
      render();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

const filteredProducts = () => {
  const q = searchInput.value.trim().toLowerCase();
  const maxPrice = Number(priceRange.value);
  const category = categoryFilter.value;
  const brand = brandFilter.value;
  const minRating = Number(ratingFilter.value);

  return Store.products.filter((item) => {
    const searchMatch =
      !q || item.name.toLowerCase().includes(q) || item.shortDescription.toLowerCase().includes(q);
    const priceMatch = Store.discountedPrice(item) <= maxPrice;
    const categoryMatch = category === "All" || item.category === category;
    const brandMatch = brand === "All" || item.brand === brand;
    const ratingMatch = item.rating >= minRating;
    return searchMatch && priceMatch && categoryMatch && brandMatch && ratingMatch;
  });
};

const render = () => {
  priceValue.textContent = Store.formatINR(Number(priceRange.value));
  const list = filteredProducts();
  resultsCount.textContent = list.length;
  syncCategoryCards();

  grid.innerHTML = list
    .map(
      (product) => `
      <article class="glass product-card">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${placeholderImage}'" />
        <div class="product-info">
          <p class="muted">${product.category} | ${product.brand}</p>
          <h4>${product.name}</h4>
          <p class="muted">Rating: ${product.rating} / 5</p>
          <div class="discount-strip">
            <span>${product.discountPercent}% OFF</span>
            <small>Save ${Store.formatINR(Store.savings(product))}</small>
          </div>
          <div class="price-row">
            <strong>${Store.formatINR(Store.discountedPrice(product))}</strong>
            <span class="old-price">${Store.formatINR(product.price)}</span>
            <button class="btn btn-primary" data-add="${product.id}">Add to Cart</button>
          </div>
          <button class="feature-bar" type="button" data-features="${product.id}">
            View Features
            <span>+</span>
          </button>
          <div class="feature-preview hidden" id="features-${product.id}">
            <p><strong>Best for:</strong> ${product.category}</p>
            <ul>
              ${product.specs.slice(0, 4).map((spec) => `<li>${spec}</li>`).join("")}
            </ul>
            <a href="product.html?id=${product.id}">Open full details</a>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  document.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Store.addToCart(btn.dataset.add, 1);
      updateCartBadge();
    });
  });

  document.querySelectorAll("[data-features]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(`features-${btn.dataset.features}`);
      const isOpen = !panel.classList.contains("hidden");
      panel.classList.toggle("hidden", isOpen);
      btn.classList.toggle("active", !isOpen);
      btn.querySelector("span").textContent = isOpen ? "+" : "-";
    });
  });
};

const initShopScene = () => {
  const mount = document.getElementById("shopScene");
  if (!mount || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);

  const knotA = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.1, 0.28, 120, 16),
    new THREE.MeshStandardMaterial({ color: 0x29d9ff, metalness: 0.75, roughness: 0.25, wireframe: true })
  );
  const knotB = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.18, 90, 12),
    new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.7, roughness: 0.3 })
  );
  knotB.position.x = 1.8;
  root.add(knotA, knotB);
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));

  const point = new THREE.PointLight(0x29d9ff, 18, 100);
  point.position.set(2, 2, 4);
  scene.add(point);

  const glow = new THREE.PointLight(0x8b5cf6, 8, 30);
  glow.position.set(-2, 0.5, 3.5);
  scene.add(glow);

  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  mount.addEventListener("mousemove", (event) => {
    const rect = mount.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });
  mount.addEventListener("mouseleave", () => {
    pointer.x = 0;
    pointer.y = 0;
  });

  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    target.x += (pointer.y * 0.35 - target.x) * 0.06;
    target.y += (pointer.x * 0.55 - target.y) * 0.06;
    root.rotation.x = target.x;
    root.rotation.y = target.y;

    knotA.rotation.x += 0.004;
    knotA.rotation.y += 0.006;
    knotB.rotation.y -= 0.008;

    glow.intensity = 8 + Math.sin(t * 2.4) * 3;
    glow.position.x = -2 + Math.cos(t * 1.2) * 0.4;
    point.position.y = 2 + Math.sin(t * 1.5) * 0.3;

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
};

[priceRange, categoryFilter, brandFilter, ratingFilter].forEach((node) => {
  node.addEventListener("input", render);
});

populateBrands();
setupTopSearch();
setupCategorySections();
updateCartBadge();
window.addEventListener("cart:updated", updateCartBadge);
window.addEventListener("catalog:updated", () => {
  populateBrands();
  render();
});
render();
initShopScene();
