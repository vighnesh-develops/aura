const cartCountNode = document.getElementById("cartCount");
const searchInput = document.getElementById("globalSearch");
const detailRoot = document.getElementById("productDetail");
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

const renderDetail = () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const product = Store.getProductById(id || "");
  if (!product) {
    detailRoot.innerHTML = `<section class="glass"><h2>Product not found</h2><a class="btn" href="shop.html">Back to shop</a></section>`;
    return;
  }

  detailRoot.innerHTML = `
    <section class="scene-wrap product-media">
      <div class="product-scene-bg" id="productScene"></div>
      <img class="product-main-image" src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${placeholderImage}'" />
    </section>
    <section class="glass">
      <p class="muted">${product.category} | ${product.brand}</p>
      <h1>${product.name}</h1>
      <p class="muted">${product.description}</p>
      <div class="discount-panel">
        <span class="discount-badge">${product.discountPercent}% OFF</span>
        <h3>${Store.formatINR(Store.discountedPrice(product))}</h3>
        <p class="muted"><span class="old-price">${Store.formatINR(product.price)}</span> You save ${Store.formatINR(Store.savings(product))}</p>
      </div>
      <p class="muted">Rating: ${product.rating} / 5</p>
      <button class="btn btn-primary" id="addBtn">Add to Cart</button>
      <h3 style="margin-top:1rem;">Specifications</h3>
      <ul class="spec-list">${product.specs.map((spec) => `<li>${spec}</li>`).join("")}</ul>
      <h3 style="margin-top:1rem;">Customer Reviews</h3>
      <ul class="review-list">${product.reviews
        .map((review) => `<li><strong>${review.user}:</strong> ${review.text}</li>`)
        .join("")}</ul>
    </section>
  `;

  document.getElementById("addBtn").addEventListener("click", () => Store.addToCart(product.id));
  initProductScene();
};

const initProductScene = () => {
  const mount = document.getElementById("productScene");
  if (!mount || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  const orbGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x3dd7ff,
    metalness: 0.45,
    roughness: 0.3,
    transparent: true,
    opacity: 0.32,
    wireframe: true
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  group.add(orb);

  const particles = new THREE.Group();
  for (let i = 0; i < 20; i += 1) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 12, 12),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0x29d9ff : 0x8b5cf6, emissive: 0x0f2338 })
    );
    star.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 3);
    particles.add(star);
  }
  group.add(particles);
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const point = new THREE.PointLight(0x29d9ff, 24, 100);
  point.position.set(2, 3, 4);
  scene.add(point);

  const clock = new THREE.Clock();
  
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    // Calculate how far down the page we've scrolled
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1) || 0;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    
    // Base continuous animations
    group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
    particles.rotation.y = elapsedTime * -0.1;
    particles.children.forEach((p, i) => {
       p.position.y += Math.sin(elapsedTime * 2 + i) * 0.01;
    });

    // Scroll-linked animations (Lerping for smoothness)
    // Rotate model as user scrolls
    const targetRotationY = elapsedTime * 0.2 + (scrollProgress * Math.PI * 4);
    group.rotation.y += (targetRotationY - group.rotation.y) * 0.08;
    
    // Scale orb based on scroll
    const targetScale = 1 + (scrollProgress * 1.2) + Math.sin(elapsedTime * 2) * 0.05;
    orb.scale.set(targetScale, targetScale, targetScale);
    
    // Shift camera down to create parallax against scrolling content
    const targetCameraY = scrollProgress * -2.5;
    camera.position.y += (targetCameraY - camera.position.y) * 0.08;
    
    // Shift camera closer
    const targetCameraZ = 5 - (scrollProgress * 2);
    camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
};

updateCartBadge();
window.addEventListener("cart:updated", updateCartBadge);
window.addEventListener("catalog:updated", renderDetail);
setupSearchRedirect();
renderDetail();
