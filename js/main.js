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
  const featuredCategories = ["Wireless", "Airbuds", "Wired", "Gaming", "Headset"];
  const items = Store.products
    .filter((product) => product.id !== "test-rs1")
    .sort((a, b) => {
      const categoryDiff = featuredCategories.indexOf(a.category) - featuredCategories.indexOf(b.category);
      return categoryDiff || b.rating - a.rating;
    })
    .slice(0, 12);
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
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  
  // Premium glass/metal headband
  const headBand = new THREE.TorusGeometry(1.4, 0.18, 32, 100, Math.PI);
  const bandMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x111111, 
    metalness: 0.9, 
    roughness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const bandMesh = new THREE.Mesh(headBand, bandMat);
  bandMesh.rotation.z = Math.PI;
  group.add(bandMesh);

  // High-tech ear cups
  const cupGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
  const cupMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b5cf6, 
    metalness: 0.3, 
    roughness: 0.4,
    emissive: 0x2a1b4d,
    emissiveIntensity: 0.5
  });
  const leftCup = new THREE.Mesh(cupGeo, cupMat);
  leftCup.position.set(-1.4, -0.8, 0);
  leftCup.rotation.z = Math.PI / 2;
  
  const rightCup = leftCup.clone();
  rightCup.position.x = 1.4;
  group.add(leftCup, rightCup);

  // Glowing inner drivers
  const driverGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const driverMat = new THREE.MeshStandardMaterial({
    color: 0x29d9ff,
    emissive: 0x29d9ff,
    emissiveIntensity: 1.2,
    wireframe: true
  });
  const leftDriver = new THREE.Mesh(driverGeo, driverMat);
  leftDriver.position.set(-1.2, -0.8, 0);
  const rightDriver = leftDriver.clone();
  rightDriver.position.x = 1.2;
  group.add(leftDriver, rightDriver);

  // Floating ambient sound particles
  const particles = new THREE.Group();
  for(let i=0; i<60; i++) {
    const pGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x29d9ff : 0x8b5cf6 });
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5 - 2);
    particles.add(p);
  }
  scene.add(particles);

  scene.add(group);

  // Dynamic Lighting
  const lightA = new THREE.PointLight(0x29d9ff, 50, 100);
  lightA.position.set(3, 4, 5);
  const lightB = new THREE.PointLight(0x8b5cf6, 40, 100);
  lightB.position.set(-4, -3, 4);
  scene.add(lightA, lightB, new THREE.AmbientLight(0xffffff, 0.8));

  let pointerX = 0;
  let pointerY = 0;
  mount.addEventListener("mousemove", (event) => {
    const rect = mount.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.5;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 1.5;
  });

  // Entry Animation Setup
  group.scale.set(0.01, 0.01, 0.01);
  group.rotation.x = Math.PI;
  let introProgress = 0;

  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const time = clock.getElapsedTime();

    // Intro Animation
    if (introProgress < 1) {
      introProgress += dt * 0.8;
      const ease = 1 - Math.pow(1 - introProgress, 4); // easeOutQuart
      const s = Math.min(ease, 1);
      group.scale.set(s, s, s);
      group.rotation.x = (1 - s) * Math.PI;
    }

    // Hover floating effect
    group.position.y = Math.sin(time * 2) * 0.15;
    
    // Drivers pulsing
    const pulse = 1 + Math.sin(time * 8) * 0.05;
    leftDriver.scale.set(pulse, pulse, pulse);
    rightDriver.scale.set(pulse, pulse, pulse);

    // Smooth pointer tracking
    group.rotation.y += (pointerX * 0.5 + time * 0.2 - group.rotation.y) * 0.05;
    group.rotation.x += (pointerY * 0.5 - group.rotation.x) * 0.05;

    // Particles moving
    particles.rotation.y = time * 0.05;
    particles.children.forEach((p, i) => {
      p.position.y += Math.sin(time * 3 + i) * 0.01;
    });

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
};

const setupContactForm = () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactFormStatus");
  if (!form || !status) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    const base = window.AURASOUND_API_BASE;
    if (base === undefined || base === null) {
      status.textContent = "API base not configured.";
      return;
    }
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    };
    try {
      const root = String(base).replace(/\/$/, "");
      const res = await fetch(`${root}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      status.textContent = "Thanks — we received your message.";
      form.reset();
    } catch {
      status.textContent = "Could not send right now. Please email support@aurasound.com.";
    }
  });
};

updateCartBadge();
window.addEventListener("cart:updated", updateCartBadge);
window.addEventListener("catalog:updated", renderFeatured);
setupSearchRedirect();
setupContactForm();
renderFeatured();
setupParallax();
setupHeroInteraction();
setupCounters();
setupSoundDemo();
setupModeTabs();
setupRevealOnScroll();
initHeroScene();
