const container = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Key light for reflection
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

// Rim light
const rimLight = new THREE.PointLight(0x4444ff, 0.5); // Slight blue tint for silver
rimLight.position.set(-5, 5, -5);
scene.add(rimLight);

// Coin Geometry (Cylinder)
// RadiusTop, RadiusBottom, Height, RadialSegments
const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 64);

// Coin Material (Silver/Reflective)
const material = new THREE.MeshPhysicalMaterial({
    color: 0xE3E3E8,      // Silver White
    metalness: 1.0,
    roughness: 0.2,       // Polished but not mirror
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0,
});

// Single Mesh
const coin = new THREE.Mesh(geometry, material);
scene.add(coin);

// Position above text
coin.position.y = 1.6;
// Rotate to stand upright
coin.rotation.x = Math.PI / 2;

camera.position.z = 5;

// Animation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Spin slowly around Y axis (which is now consistent with upright coin?)
    // Actually since we rotated X by 90deg, local Y is pointing "forward" or "up"?
    // Let's rotate world Y or local Z?
    // If cylinder defaults to pointing up (Y), and we rotate X 90, it points towards Z.
    // The "Face" is the cylinder caps.
    // To spin like a coin on a table edge, we rotate around the cylinder's axis (Y) or the world Y?
    // Visualizing: Cylinder caps are Top/Bottom. Rotated 90deg X: Top cap faces Front.
    // To spin "face to face", we rotate around World Y.

    coin.rotation.z += delta * 0.5; // Rotate around its own axis? No, that's spinner.
    // Let's just use World rotation.
    // Actually, simply:
    coin.rotation.x = Math.PI / 2; // Keep upright
    coin.rotation.z += 0.5 * delta; // Spin the face?
    // Wait, cylinder axis is Y. Rotating Z makes it "cartwheel".
    // Rotating Y makes it "spin like a top" (if standing up it looks like rolling).
    // Let's try rotating the Mesh object around World Y.

    // Reset rotation to apply clean logic
    // We want the face (circle) to rotate to show front/back.
    // Cylinder Y axis is through the center of the circle.
    // If we want to show front/back, we rotate around X or Z.

    // Let's try this:
    // Initial: Cylinder standing on edge.
    // Rotation: About the vertical axis (World Y).
}

// Re-write animate for clarity
let angle = 0;
function animateLoop() {
    requestAnimationFrame(animateLoop);
    const delta = clock.getDelta();
    angle += delta * 0.8; // Speed

    // Complex rotation for "floating" effect
    coin.rotation.x = Math.PI / 2; // Face forward-ish foundation
    coin.rotation.z = angle;       // Spin around center
    coin.rotation.y = Math.sin(angle * 0.5) * 0.2; // Slight wobble

    renderer.render(scene, camera);
}
animateLoop();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
