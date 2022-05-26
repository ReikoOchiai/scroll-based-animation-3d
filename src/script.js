import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
// gradientTexture.magFilter = THREE.NearestFilter;

// const material = new THREE.MeshToonMaterial({
//   color: parameters.materialColor,
//   gradientMap: gradientTexture,
// });
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 25),
  new THREE.MeshNormalMaterial({ wireframe: true })
);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 25),
  new THREE.MeshNormalMaterial({ wireframe: true })
);

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 25),
  new THREE.MeshNormalMaterial({ wireframe: true })
);
const objectDistance = 4;
sphere1.position.y = -objectDistance * 0;
sphere2.position.y = -objectDistance * 1;
sphere3.position.y = -objectDistance * 2;

sphere1.position.x = 2;
sphere2.position.x = -2;
sphere3.position.x = 2;

scene.add(sphere1, sphere2, sphere3);

const sectionMeshes = [sphere1, sphere2, sphere3];

/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
// const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

// Camera Group

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */

let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

/**
 * Cursor
 */

const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // Animate camera
  camera.position.y = (-scrollY / sizes.height) * objectDistance;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x =
    (parallaxX - cameraGroup.position.x) * 10 * deltaTime;
  cameraGroup.position.y =
    (parallaxY - cameraGroup.position.y) * 10 * deltaTime;

  // Animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
