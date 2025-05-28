const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 2;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

let currentModel;

function loadModelForGenre(genreKey) {
  const modelPaths = {
  pop: 'model_1.glb',
  sad: 'model_2.glb',
  lofi: 'model_3.glb',
  electronic: 'model_4.glb'
};

  const modelPath = modelPaths[genreKey];
  if (!modelPath) return;

  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, (gltf) => {
    if (currentModel) {
      scene.remove(currentModel);
    }

    currentModel = gltf.scene;

    // Auto-center and scale model
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    currentModel.position.sub(center);

    const size = box.getSize(new THREE.Vector3()).length();
    const scaleFactor = 1.5 / size;
    currentModel.scale.setScalar(scaleFactor);

    // Optional: adjust horizontal position
    currentModel.position.x += 1.2;

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

// Expose for external call
window.loadModelForGenre = loadModelForGenre;
loadModelForGenre('pop'); // default model
