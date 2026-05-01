const cartCountNode = document.getElementById("cartCount");
const searchInput = document.getElementById("globalSearch");
const placeholderImage = "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80";

const updateCartBadge = () => {
  if (cartCountNode) cartCountNode.textContent = Store.cartCount();
};

const setupSearchRedirect = () => {
  if (!searchInput) return;
  searchInput.addEventListener("input", (event) => {
    const q = event.target.value.trim();
    if (q.length < 2) return;
    window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
  });
};

const renderFeatured = () => {
  const featured = document.getElementById("featuredProducts");
  if (!featured) return;
  const items = Store.products.filter((product) => product.id !== "test-rs1").slice(0, 4);
  featured.innerHTML = items
    .map(
      (product) => `
      <article class="glass product-card">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${placeholderImage}'" />
        <div class="product-info">
          <h4>${product.name}</h4>
          <p class="muted">${product.shortDescription}</p>
          <div class="discount-strip">
            <span>${product.discountPercent}% OFF</span>
            <small>Save ${Store.formatINR(Store.savings(product))}</small>
          </div>
          <div class="price-row">
            <strong>${Store.formatINR(Store.discountedPrice(product))}</strong>
            <span class="old-price">${Store.formatINR(product.price)}</span>
            <a class="btn" href="product.html?id=${product.id}">View</a>
          </div>
        </div>
      </article>
    `
    )
    .join("");
};

const setupParallax = () => {
  const layers = document.querySelectorAll(".parallax");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed || 0.1);
      layer.style.transform = `translateY(${y * speed}px)`;
    });
  });
};

const setupHeroInteraction = () => {
  const hero = document.getElementById("interactiveHero");
  if (!hero) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 36;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 36;
    hero.style.setProperty("--hero-x", `${x}px`);
    hero.style.setProperty("--hero-y", `${y}px`);
  });
};

const setupCounters = () => {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 42));

    const tick = () => {
      current = Math.min(target, current + step);
      counter.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };

    tick();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = "true";
      animateCounter(entry.target);
    });
  }, { threshold: 0.7 });

  counters.forEach((counter) => observer.observe(counter));
};

const setupSoundDemo = () => {
  const button = document.getElementById("soundDemoBtn");
  const widget = document.getElementById("soundWidget");
  if (!button || !widget) return;

  button.addEventListener("click", () => {
    widget.classList.toggle("active");
    button.textContent = widget.classList.contains("active") ? "Pause Sound Demo" : "Play Sound Demo";
  });
};

const setupModeTabs = () => {
  const tabs = document.getElementById("modeTabs");
  const title = document.getElementById("experienceTitle");
  const text = document.getElementById("experienceText");
  if (!tabs || !title || !text) return;

  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    tabs.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
    button.classList.add("active");
    title.textContent = button.dataset.mode;
    text.textContent = button.dataset.text;
  });
};

const setupRevealOnScroll = () => {
  const items = document.querySelectorAll(".reveal-on-scroll");
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.18 });

  items.forEach((item) => observer.observe(item));
};

const initHeroScene = () => {
  const mount = document.getElementById("heroCanvas");
  if (!mount || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
  camera.position.set(0, 0.2, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  const headBand = new THREE.TorusGeometry(1.2, 0.14, 16, 100, Math.PI);
  const material = new THREE.MeshStandardMaterial({ color: 0x4bd9ff, metalness: 0.8, roughness: 0.2 });
  const bandMesh = new THREE.Mesh(headBand, material);
  bandMesh.rotation.z = Math.PI;
  group.add(bandMesh);

  const cupGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.38, 32);
  const cupMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.6, roughness: 0.25 });
  const leftCup = new THREE.Mesh(cupGeo, cupMat);
  leftCup.position.set(-1.08, -0.7, 0);
  leftCup.rotation.z = Math.PI / 2;
  const rightCup = leftCup.clone();
  rightCup.position.x = 1.08;
  group.add(leftCup, rightCup);

  scene.add(group);

  const lightA = new THREE.PointLight(0x29d9ff, 35, 100);
  lightA.position.set(2, 4, 5);
  const lightB = new THREE.PointLight(0x8b5cf6, 25, 100);
  lightB.position.set(-3, -2, 4);
  scene.add(lightA, lightB, new THREE.AmbientLight(0xffffff, 1.2));

  let pointerX = 0;
  mount.addEventListener("mousemove", (event) => {
    const rect = mount.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    group.rotation.y += 0.007;
    group.rotation.x = pointerX * 0.35;
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
setupSearchRedirect();
renderFeatured();
setupParallax();
setupHeroInteraction();
setupCounters();
setupSoundDemo();
setupModeTabs();
setupRevealOnScroll();
initHeroScene();
