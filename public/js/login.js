const LOGIN_KEY = "aurasound_user";
const form = document.getElementById("loginForm");

if (localStorage.getItem(LOGIN_KEY) && window.location.pathname.endsWith("login.html")) {
  window.location.href = "index.html";
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  localStorage.setItem(LOGIN_KEY, JSON.stringify({ email, loggedInAt: new Date().toISOString() }));
  window.location.href = "index.html";
});

const initLoginScene = () => {
  const mount = document.getElementById("loginScene");
  if (!mount || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  
  // Premium glass/metal headband
  const headBand = new THREE.TorusGeometry(1.6, 0.22, 32, 100, Math.PI);
  const bandMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x1a1a1a, 
    metalness: 0.95, 
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const bandMesh = new THREE.Mesh(headBand, bandMat);
  bandMesh.rotation.z = Math.PI;
  group.add(bandMesh);

  // High-tech ear cups
  const cupGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 32);
  const cupMat = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a0a, 
    metalness: 0.8, 
    roughness: 0.4,
    emissive: 0x111111,
    emissiveIntensity: 0.5
  });
  const leftCup = new THREE.Mesh(cupGeo, cupMat);
  leftCup.position.set(-1.6, -1.0, 0);
  leftCup.rotation.z = Math.PI / 2;
  
  const rightCup = leftCup.clone();
  rightCup.position.x = 1.6;
  group.add(leftCup, rightCup);

  // Glowing inner drivers
  const driverGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const driverMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 1.5,
    wireframe: true
  });
  const leftDriver = new THREE.Mesh(driverGeo, driverMat);
  leftDriver.position.set(-1.4, -1.0, 0);
  const rightDriver = leftDriver.clone();
  rightDriver.position.x = 1.4;
  group.add(leftDriver, rightDriver);

  scene.add(group);

  // Dynamic Lighting
  const lightA = new THREE.PointLight(0x29d9ff, 60, 100);
  lightA.position.set(4, 5, 6);
  const lightB = new THREE.PointLight(0x8b5cf6, 50, 100);
  lightB.position.set(-5, -4, 5);
  scene.add(lightA, lightB, new THREE.AmbientLight(0xffffff, 0.6));

  const clock = new THREE.Clock();
  
  // Slight tilt for perspective
  group.rotation.x = 0.2;

  const animate = () => {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Hover floating effect
    group.position.y = Math.sin(time * 1.5) * 0.2 + 0.5;
    
    // Smooth 3D rotation
    group.rotation.y = time * 0.5;

    // Drivers pulsing
    const pulse = 1 + Math.sin(time * 6) * 0.08;
    leftDriver.scale.set(pulse, pulse, pulse);
    rightDriver.scale.set(pulse, pulse, pulse);

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    if (!mount) return;
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
};

document.addEventListener("DOMContentLoaded", initLoginScene);
