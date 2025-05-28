// Assumes THREE and GLTFLoader are loaded globally via script tags
// So no need to import anything

const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const loader = new THREE.GLTFLoader();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 2;

const light = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(light);

let currentModel;

function loadModelForGenre(genreKey) {
  const modelPaths = {
  pop: 'model_1.glb',
  sad: 'model_2.glb',
  'lo-fi': 'model_3.glb',
  electronic: 'model_4.glb',
  rock: 'model_1.glb',
  jazz: 'model_3.glb'
};

  const modelPath = modelPaths[genreKey];
  if (!modelPath) return;

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    if (currentModel) {
      scene.remove(currentModel);
    }

    currentModel = gltf.scene;

    // Center & scale model
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    currentModel.position.sub(center);

    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = 1.5 / size;
    currentModel.scale.setScalar(scaleFactor);

    currentModel.position.x += 1.2; // adjust X to avoid blocking center
    scene.add(currentModel);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.005;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// Expose function globally
window.loadModelForGenre = loadModelForGenre;
loadModelForGenre('pop'); // Default
