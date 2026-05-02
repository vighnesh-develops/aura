const initGlobalBackground = () => {
  const canvas = document.getElementById("globalBgCanvas");
  if (!canvas || !window.THREE) return;

  // 1. Inject Noise Overlay
  const noiseDiv = document.createElement("div");
  noiseDiv.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    opacity: 0.04;
    background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
  `;
  document.body.appendChild(noiseDiv);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const group = new THREE.Group();

  // Premium Headphone Wireframe
  const mat = new THREE.MeshStandardMaterial({ 
    color: 0x4bd9ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const cupMat = new THREE.MeshStandardMaterial({ 
    color: 0x8b5cf6, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  const headBand = new THREE.TorusGeometry(4.5, 0.5, 16, 64, Math.PI);
  const bandMesh = new THREE.Mesh(headBand, mat);
  bandMesh.rotation.z = Math.PI;
  group.add(bandMesh);

  const cupGeo = new THREE.CylinderGeometry(2, 2, 1.5, 32);
  const leftCup = new THREE.Mesh(cupGeo, cupMat);
  leftCup.position.set(-4.5, -2.5, 0);
  leftCup.rotation.z = Math.PI / 2;
  const rightCup = leftCup.clone();
  rightCup.position.x = 4.5;
  group.add(leftCup, rightCup);

  group.position.set(0, 0, 0);
  group.rotation.x = 0.2;
  group.rotation.y = -0.3;
  scene.add(group);

  // 2. Add Massive Particle System (Dust/Stars)
  const particles = new THREE.Group();
  for (let i = 0; i < 200; i++) {
    const pGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ 
      color: i % 2 === 0 ? 0x29d9ff : 0x8b5cf6,
      transparent: true,
      opacity: Math.random() * 0.5 + 0.1
    });
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.set(
      (Math.random() - 0.5) * 40, 
      (Math.random() - 0.5) * 40, 
      (Math.random() - 0.5) * 30 - 5
    );
    particles.add(p);
  }
  scene.add(particles);

  const light = new THREE.PointLight(0xffffff, 20, 100);
  light.position.set(0, 0, 10);
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  // 3. Mouse-Based 3D Movement (Depth Feel)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener("mousemove", (event) => {
    // Normalize mouse position from -1 to 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    
    // Smooth camera Parallax Interpolation (Lerp)
    targetX = mouseX * 2.5; // Max shift X
    targetY = mouseY * 2.5; // Max shift Y
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0); // Keep focused on center

    // Subtle Continuous Rotation
    group.rotation.y += 0.0015;
    group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    group.position.y = Math.sin(Date.now() * 0.0003) * 0.5;

    // Slowly rotate particles for deep ambient space feel
    particles.rotation.y -= 0.0005;
    particles.rotation.x += 0.0002;

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

initGlobalBackground();
