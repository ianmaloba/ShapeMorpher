// Import modules
import { initScene, renderer, scene, camera } from './modules/scene.js';
import { createGeometry } from './modules/shapes.js';
import { createMaterial, updateMaterial } from './modules/materials.js';
import { showToast, updateValueDisplay } from './modules/ui.js';
import { shapeDescriptions } from './modules/descriptions.js';

// Global variables
let currentShape;
let currentMaterial;
let isTransitioning = false;
let morphTimeout;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
let time = 0;

// Initialize the application
function init() {
    // Initialize Three.js scene
    initScene();
    
    // Add the renderer's canvas to the DOM
    document.body.appendChild(renderer.domElement);
    
    // Set up event listeners
    setupEventListeners();
    
    // Create initial shape
    createShape('cube');
    
    // Start animation loop
    animate();
    
    // Hide loading screen
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 800);
    
    // Initialize UI value displays
    updateAllValueDisplays();
}

// Set up event listeners for UI controls
function setupEventListeners() {
    // Shape selection
    document.getElementById('shape').addEventListener('change', (e) => {
        if (!isTransitioning) {
            createShape(e.target.value);
            updateShapeDescription(e.target.value);
        }
    });
    
    // Material type
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
    
    // Color pickers
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
    
    // Background color
    document.getElementById('bg-color').addEventListener('input', (e) => {
        renderer.setClearColor(new THREE.Color(e.target.value), 1);
    });
    
    // Scale slider
    document.getElementById('scale').addEventListener('input', (e) => {
        if (currentShape && !isTransitioning) {
            const scale = parseFloat(e.target.value);
            currentShape.scale.set(scale, scale, scale);
            updateValueDisplay('scale-value', scale.toFixed(1));
        }
    });
    
    // Segments slider
    document.getElementById('segments').addEventListener('input', (e) => {
        updateValueDisplay('segments-value', e.target.value);
    });
    
    document.getElementById('segments').addEventListener('change', (e) => {
        if (currentShape && !isTransitioning) {
            const segments = parseInt(e.target.value);
            const shapeName = document.getElementById('shape').value;
            
            // Recreate shape with new segment count
            const geometry = createGeometry(shapeName, segments);
            currentShape.geometry.dispose();
            currentShape.geometry = geometry;
        }
    });
    
    // Material controls
    document.getElementById('metalness').addEventListener('input', (e) => {
        updateMaterial();
        updateValueDisplay('metalness-value', e.target.value);
    });
    
    document.getElementById('roughness').addEventListener('input', (e) => {
        updateMaterial();
        updateValueDisplay('roughness-value', e.target.value);
    });
    
    // Rotation speed
    document.getElementById('speed').addEventListener('input', (e) => {
        updateValueDisplay('speed-value', parseFloat(e.target.value).toFixed(3));
    });
    
    // Toggle panel
    document.getElementById('toggle-panel').addEventListener('click', () => {
        const controls = document.getElementById('controls');
        controls.classList.toggle('collapsed');
        
        // Update icon
        const icon = document.querySelector('#toggle-panel i');
        if (controls.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-left';
        } else {
            icon.className = 'fas fa-chevron-right';
        }
        
        // Center the camera
        setTimeout(updateCameraPosition, 300);
    });
    
    // Dark/Light mode toggle
    document.getElementById('mode-toggle').addEventListener('click', toggleColorMode);
    
    // Reset buttons
    document.getElementById('reset-camera').addEventListener('click', resetCamera);
    document.getElementById('reset-all').addEventListener('click', resetAllSettings);
    
    // Mouse controls for rotation
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', handleTouchEnd);
    
    // Window resize
    window.addEventListener('resize', handleWindowResize);
}

// Update shape description display
function updateShapeDescription(shapeName) {
    const descriptionElement = document.getElementById('shape-description');
    const description = shapeDescriptions[shapeName] || 'No description available.';
    descriptionElement.innerHTML = description;
}

// Toggle between dark and light mode
function toggleColorMode() {
    document.body.classList.toggle('light-mode');
    
    // Update icon
    const icon = document.querySelector('#mode-toggle i');
    if (document.body.classList.contains('light-mode')) {
        icon.className = 'fas fa-sun';
        showToast('Light mode activated');
    } else {
        icon.className = 'fas fa-moon';
        showToast('Dark mode activated');
    }
}

// Reset camera position
function resetCamera() {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    showToast('Camera reset');
}

// Reset all settings to default
function resetAllSettings() {
    // Reset controls to default values
    document.getElementById('scale').value = 1;
    document.getElementById('segments').value = 32;
    document.getElementById('speed').value = 0.01;
    document.getElementById('direction').value = 'all';
    document.getElementById('materialType').value = 'standard';
    document.getElementById('color').value = '#00ff9d';
    document.getElementById('color2').value = '#ff00ff';
    document.getElementById('metalness').value = 0.5;
    document.getElementById('roughness').value = 0.5;
    document.getElementById('bg-color').value = '#000000';
    
    // Apply changes
    renderer.setClearColor(0x000000, 1);
    resetCamera();
    
    if (currentShape) {
        // Reset shape scale
        currentShape.scale.set(1, 1, 1);
        
        // Recreate material
        currentMaterial = createMaterial();
        currentShape.material = currentMaterial;
    }
    
    // Update value displays
    updateAllValueDisplays();
    
    showToast('All settings reset to default');
}

// Update all value displays
function updateAllValueDisplays() {
    updateValueDisplay('scale-value', document.getElementById('scale').value);
    updateValueDisplay('segments-value', document.getElementById('segments').value);
    updateValueDisplay('speed-value', document.getElementById('speed').value);
    updateValueDisplay('metalness-value', document.getElementById('metalness').value);
    updateValueDisplay('roughness-value', document.getElementById('roughness').value);
}

// Handle window resize
function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateCameraPosition();
}

// Update camera position
function updateCameraPosition() {
    const controlsPanel = document.getElementById('controls');
    const isPanelCollapsed = controlsPanel.classList.contains('collapsed');
    const panelWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--panel-width'));
    
    // Adjust camera view offset based on panel state
    if (!isPanelCollapsed) {
        // Panel is open, offset camera to center the view
        camera.setViewOffset(
            window.innerWidth,
            window.innerHeight,
            -panelWidth / 4,
            0,
            window.innerWidth,
            window.innerHeight
        );
    } else {
        // Panel is collapsed, reset view offset
        camera.clearViewOffset();
    }
}

// Mouse/Touch event handlers
function handleMouseDown(e) {
    isDragging = true;
    document.body.style.cursor = 'grabbing';
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isDragging || isTransitioning) return;

    const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
    };

    rotationVelocity = {
        x: deltaMove.y * 0.005,
        y: deltaMove.x * 0.005
    };
    
    if (currentShape) {
        currentShape.rotation.x += rotationVelocity.x;
        currentShape.rotation.y += rotationVelocity.y;
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
}

function handleMouseUp() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!isDragging || isTransitioning || e.touches.length !== 1) return;

    const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
    };

    rotationVelocity = {
        x: deltaMove.y * 0.005,
        y: deltaMove.x * 0.005
    };
    
    if (currentShape) {
        currentShape.rotation.x += rotationVelocity.x;
        currentShape.rotation.y += rotationVelocity.y;
    }

    previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    };
    
    e.preventDefault();
}

function handleTouchEnd() {
    isDragging = false;
}

// Shape creation with morphing animation
function createShape(shapeName) {
    const segments = parseInt(document.getElementById('segments').value);
    
    if (currentShape) {
        morphShape(currentShape, shapeName, segments);
    } else {
        const geometry = createGeometry(shapeName, segments);
        currentMaterial = createMaterial();
        currentShape = new THREE.Mesh(geometry, currentMaterial);
        const scale = parseFloat(document.getElementById('scale').value);
        currentShape.scale.set(scale, scale, scale);
        scene.add(currentShape);
    }
}

// Morphing animation between shapes
function morphShape(fromShape, toShapeName, segments) {
  if (isTransitioning) {
    clearTimeout(morphTimeout);
  }
  
  isTransitioning = true;
  const originalScale = fromShape.scale.x;
  const steps = 60;
  let step = 0;
  
  const targetGeometry = createGeometry(toShapeName, segments);
  const targetShape = new THREE.Mesh(targetGeometry, currentMaterial);
  targetShape.scale.set(0.001, 0.001, 0.001);
  scene.add(targetShape);
  
  function animate() {
    if (step >= steps) {
      scene.remove(fromShape);
      targetShape.scale.set(originalScale, originalScale, originalScale);
      currentShape = targetShape;
      isTransitioning = false;
      showToast(`Shape changed to ${toShapeName.replace(/([A-Z])/g, ' $1').trim()}`);
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

// Animation loop
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

  // Update tweens
  TWEEN.update();

  // Render scene
  renderer.render(scene, camera);
}

// Initialize the app when DOM content is loaded
document.addEventListener('DOMContentLoaded', init);