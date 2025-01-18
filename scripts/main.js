import { createGeometry } from '/scripts/shapes.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// Lighting setup
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, 10, -10);
scene.add(directionalLight);

// Camera positioning
function updateCameraPosition() {
  const controlsPanel = document.getElementById('controls');
  const isPanelCollapsed = controlsPanel.classList.contains('collapsed');
  const panelWidth = 300;
  const offset = isPanelCollapsed ? 0 : (panelWidth / 2) / window.innerWidth;
  
  camera.position.set(0, 0, 5);
  camera.setViewOffset(
    window.innerWidth,
    window.innerHeight,
    isPanelCollapsed ? 0 : -panelWidth / 4,
    0,
    window.innerWidth,
    window.innerHeight
  );
}


// Global variables
let currentShape;
let currentMaterial;
let isTransitioning = false;
let morphTimeout;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };

// Material creation
function createMaterial() {
    const materialType = document.getElementById('materialType').value;
    const color = new THREE.Color(document.getElementById('color').value);
    const color2 = new THREE.Color(document.getElementById('color2').value);
    const metalness = parseFloat(document.getElementById('metalness').value);
    const roughness = parseFloat(document.getElementById('roughness').value);
  
    let material;
    
    switch (materialType) {
      case 'phong':
        material = new THREE.MeshPhongMaterial({
          color: color,
          shininess: 100 * (1 - roughness),
          specular: new THREE.Color(metalness, metalness, metalness)
        });
        break;
      case 'physical':
        material = new THREE.MeshPhysicalMaterial({
          color: color,
          metalness,
          roughness,
          clearcoat: 0.5,
          clearcoatRoughness: 0.1
        });
        break;
      case 'toon':
        material = new THREE.MeshToonMaterial({ 
          color: color,
          gradientMap: createGradientTexture()
        });
        break;
      case 'gradient':
        material = createGradientMaterial(color, color2);
        break;
      case 'normal':
        material = new THREE.MeshNormalMaterial({
          flatShading: true
        });
        break;
      case 'points':
            return new THREE.PointsMaterial({
              color: color,
              size: 0.05,
              sizeAttenuation: true,
              alphaTest: 0.5
            });
      case 'wireframe':
        material = new THREE.MeshBasicMaterial({
          wireframe: true,
          color: color
        });
        break;
      default:
        material = new THREE.MeshStandardMaterial({
          color: color,
          metalness,
          roughness
        });
    }
    
    return material;
  }
  
  // Add event listeners for material controls
  document.getElementById('metalness').addEventListener('input', updateMaterial);
  document.getElementById('roughness').addEventListener('input', updateMaterial);
  
  function updateMaterial() {
    if (!currentShape || isTransitioning) return;
    
    const materialType = document.getElementById('materialType').value;
    const metalness = parseFloat(document.getElementById('metalness').value);
    const roughness = parseFloat(document.getElementById('roughness').value);
    
    if (materialType === 'physical' || materialType === 'standard') {
      currentShape.material.metalness = metalness;
      currentShape.material.roughness = roughness;
      currentShape.material.needsUpdate = true;
    } else if (materialType === 'phong') {
      currentShape.material.shininess = 100 * (1 - roughness);
      currentShape.material.specular.setScalar(metalness);
      currentShape.material.needsUpdate = true;
    }
}

// Gradient texture creation
function createGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 256, 0);
  
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(0.33, '#888888');
  gradient.addColorStop(0.66, '#cccccc');
  gradient.addColorStop(1, '#ffffff');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 1);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Gradient material creation
function createGradientMaterial(color1, color2) {
  const vertexShader = `
    varying vec3 vPosition;
    void main() {
      vPosition = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec3 vPosition;
    void main() {
      float gradient = (vPosition.y + 1.0) * 0.5;
      vec3 color = mix(color1, color2, gradient);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: color1 },
      color2: { value: color2 }
    },
    vertexShader,
    fragmentShader
  });
}

// Morphing animation
function morphShape(fromShape, toShapeName) {
  if (isTransitioning) {
    clearTimeout(morphTimeout);
  }
  
  isTransitioning = true;
  const originalScale = fromShape.scale.x;
  const steps = 60;
  let step = 0;
  
  const targetGeometry = createGeometry(toShapeName);
  const targetShape = new THREE.Mesh(targetGeometry, currentMaterial);
  targetShape.scale.set(0.001, 0.001, 0.001);
  scene.add(targetShape);
  
  function animate() {
    if (step >= steps) {
      scene.remove(fromShape);
      targetShape.scale.set(originalScale, originalScale, originalScale);
      currentShape = targetShape;
      isTransitioning = false;
      return;
    }
    
    const progress = step / steps;
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    
    fromShape.scale.set(
      originalScale * (1 - easeProgress),
      originalScale * (1 - easeProgress),
      originalScale * (1 - easeProgress)
    );
    fromShape.rotation.x += 0.1;
    fromShape.rotation.y += 0.1;
    
    if (progress > 0.5) {
      const growProgress = (progress - 0.5) * 2;
      const growEase = 0.5 - Math.cos(growProgress * Math.PI) / 2;
      targetShape.scale.set(
        originalScale * growEase,
        originalScale * growEase,
        originalScale * growEase
      );
      targetShape.rotation.x += 0.1;
      targetShape.rotation.y += 0.1;
    }
    
    step++;
    morphTimeout = setTimeout(animate, 1000 / 60);
  }
  
  animate();
}

// Shape creation
function createShape(shapeName) {
  if (currentShape) {
    morphShape(currentShape, shapeName);
  } else {
    const geometry = createGeometry(shapeName);
    currentMaterial = createMaterial();
    currentShape = new THREE.Mesh(geometry, currentMaterial);
    const scale = parseFloat(document.getElementById('scale').value);
    currentShape.scale.set(scale, scale, scale);
    scene.add(currentShape);
  }
}

// Event listeners
document.getElementById('shape').addEventListener('change', (e) => {
  if (!isTransitioning) {
    createShape(e.target.value);
  }
});

document.getElementById('materialType').addEventListener('change', () => {
    if (currentShape && !isTransitioning) {
      const oldScale = currentShape.scale.x;
      const oldRotation = currentShape.rotation.clone();
      
      // Create new material
      currentMaterial = createMaterial();
      currentShape.material = currentMaterial;
      
      // Restore scale and rotation
      currentShape.scale.set(oldScale, oldScale, oldScale);
      currentShape.rotation.copy(oldRotation);
    }
});

document.getElementById('color').addEventListener('input', (e) => {
  if (currentShape && !isTransitioning) {
    const newColor = new THREE.Color(e.target.value);
    if (currentShape.material.uniforms) {
      currentShape.material.uniforms.color1.value.copy(newColor);
    } else {
      currentShape.material.color.copy(newColor);
    }
    currentShape.material.needsUpdate = true;
  }
});

document.getElementById('color2').addEventListener('input', (e) => {
  if (currentShape && currentShape.material.uniforms) {
    const newColor = new THREE.Color(e.target.value);
    currentShape.material.uniforms.color2.value.copy(newColor);
    currentShape.material.needsUpdate = true;
  }
});

document.getElementById('scale').addEventListener('input', (e) => {
  if (currentShape && !isTransitioning) {
    const scale = parseFloat(e.target.value);
    currentShape.scale.set(scale, scale, scale);
  }
});

document.getElementById('toggle-panel').addEventListener('click', () => {
  document.getElementById('controls').classList.toggle('collapsed');
  updateCameraPosition();
});

// Mouse controls
renderer.domElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.cursor = 'grabbing';
  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (!isDragging || isTransitioning) return;

  const deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };

  rotationVelocity = {
    x: deltaMove.y * 0.005,
    y: deltaMove.x * 0.005
  };
  
  currentShape.rotation.x += rotationVelocity.x;
  currentShape.rotation.y += rotationVelocity.y;

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.cursor = 'grab';
});

// Animation loop
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  if (currentShape && !isDragging && !isTransitioning) {
    const direction = document.getElementById('direction').value;
    const speed = parseFloat(document.getElementById('speed').value);

    switch (direction) {
      case 'all':
        currentShape.rotation.x += speed;
        currentShape.rotation.y += speed;
        currentShape.rotation.z += speed;
        break;
      case 'x':
        currentShape.rotation.x += speed;
        break;
      case 'y':
        currentShape.rotation.y += speed;
        break;
      case 'z':
        currentShape.rotation.z += speed;
        break;
      case 'xy':
        currentShape.rotation.x += speed;
        currentShape.rotation.y += speed;
        break;
      case 'xz':
        currentShape.rotation.x += speed;
        currentShape.rotation.z += speed;
        break;
      case 'yz':
        currentShape.rotation.y += speed;
        currentShape.rotation.z += speed;
        break;
      case 'custom':
        currentShape.rotation.x = Math.sin(time) * speed * 10;
        currentShape.rotation.y = Math.cos(time * 1.5) * speed * 10;
        currentShape.rotation.z = Math.sin(time * 2) * speed * 10;
        break;
    }
  }

  renderer.render(scene, camera);
}

// Window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateCameraPosition();
});

// Initialize
updateCameraPosition();
createShape('cube');
animate();