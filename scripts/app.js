// Import modules
import { initScene, renderer, scene, camera } from './modules/scene.js';
import { initializeShapes, createGeometry, getShapeInfo, updateShapeUI } from './modules/shapes.js';
import { createMaterial, updateMaterial } from './modules/materials.js';
import { showToast, updateValueDisplay } from './modules/ui.js';
import { shapeDescriptions } from './modules/descriptions.js';
import { shapeSearch } from './modules/searchComponent.js';

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
async function init() {
    try {
        // Show loading message
        showToast('Initializing shape system...');

        // Initialize the shape system first
        await initializeShapes();

        // Initialize search component
        shapeSearch.initialize();

        // Update the UI with loaded shapes
        updateShapeUI();

        showToast('Shape system loaded successfully');
    } catch (error) {
        console.error('Failed to initialize shape system:', error);
        showToast('Warning: Using fallback shapes');
    }

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
    // Shape selection via dropdown
    document.getElementById('shape').addEventListener('change', (e) => {
        if (!isTransitioning) {
            createShape(e.target.value);
            updateShapeDescription(e.target.value);
        }
    });

    // Shape selection via search component (for future advanced search)
    document.addEventListener('shapeSelected', (e) => {
        const selectedShape = e.detail;
        if (!isTransitioning) {
            createShape(selectedShape.id);
            updateShapeDescription(selectedShape.id);
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
            const selectedShape = shapeSearch.getSelectedShape();

            if (selectedShape) {
                // Recreate shape with new segment count
                const geometry = createGeometry(selectedShape.id, segments);
                currentShape.geometry.dispose();
                currentShape.geometry = geometry;
            }
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

    // Try to get description from new shape system first
    const shapeInfo = getShapeInfo(shapeName);
    let description = '';

    if (shapeInfo) {
        // Debug: Log the shape info to see what we're getting
        console.log('Shape Info for', shapeName, ':', shapeInfo);

        // Main description
        description = `<div class="shape-info-content">`;
        description += `<h4>${shapeInfo.name}</h4>`;
        description += `<p>${shapeInfo.description}</p>`;

        // Basic properties section
        if (shapeInfo.properties && Object.values(shapeInfo.properties).some(v => v !== null)) {
            description += `<div class="shape-section">`;
            description += `<h5>Properties</h5>`;

            // Display all properties
            for (const [key, value] of Object.entries(shapeInfo.properties)) {
                if (value !== null && value !== undefined && value !== '') {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    description += `<span class="property">${label}: ${value}</span>`;
                }
            }
            description += `</div>`;
        }

        // Mathematical info - Show ALL mathematical details with special formatting
        if (shapeInfo.mathematical) {
            description += `<div class="shape-section">`;
            description += `<h5>Mathematical Information</h5>`;

            for (const [key, value] of Object.entries(shapeInfo.mathematical)) {
                if (value !== null && value !== undefined && value !== '') {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    if (key === 'equation') {
                        description += `<div class="equation-display"><strong>Equation:</strong> ${value}</div>`;
                    } else if (key === 'parametricForm' || key === 'parametricDomain') {
                        if (typeof value === 'object') {
                            const formatted = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
                            description += `<div class="parametric-form"><strong>${label}:</strong> ${formatted}</div>`;
                        } else {
                            description += `<div class="parametric-form"><strong>${label}:</strong> ${value}</div>`;
                        }
                    } else if (key === 'discoverer' || key === 'yearDiscovered') {
                        if (key === 'yearDiscovered' && value < 0) {
                            description += `<div class="discoverer-info"><strong>${label}:</strong> ${Math.abs(value)} BCE</div>`;
                        } else if (key === 'discoverer') {
                            description += `<div class="discoverer-info"><strong>${label}:</strong> ${value}</div>`;
                        }
                    } else if (key === 'classification') {
                        description += `<div class="classification-info"><strong>${label}:</strong> ${value}</div>`;
                    } else {
                        if (typeof value === 'object') {
                            const formatted = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
                            description += `<span class="property">${label}: ${formatted}</span>`;
                        } else {
                            description += `<span class="property">${label}: ${value}</span>`;
                        }
                    }
                }
            }
            description += `</div>`;
        }

        // Educational info - Show EVERYTHING including fun facts
        if (shapeInfo.educational) {
            description += `<div class="shape-section">`;
            description += `<h5>Educational Information</h5>`;

            const edu = shapeInfo.educational;
            if (edu.level) description += `<span class="property">Level: ${edu.level}</span>`;
            if (edu.topics && edu.topics.length > 0) {
                description += `<span class="property">Topics: ${edu.topics.join(', ')}</span>`;
            }
            if (edu.applications && edu.applications.length > 0) {
                description += `<span class="property">Applications: ${edu.applications.join(', ')}</span>`;
            }
            if (edu.relatedShapes && edu.relatedShapes.length > 0) {
                description += `<span class="property">Related Shapes: ${edu.relatedShapes.join(', ')}</span>`;
            }
            if (edu.prerequisites && edu.prerequisites.length > 0) {
                description += `<span class="property">Prerequisites: ${edu.prerequisites.join(', ')}</span>`;
            }
            if (edu.interactiveFeatures && edu.interactiveFeatures.length > 0) {
                description += `<span class="property">Interactive Features: ${edu.interactiveFeatures.join(', ')}</span>`;
            }

            // Fun Facts - Special prominent formatting
            if (edu.funFacts && edu.funFacts.length > 0) {
                description += `<div class="fun-facts-section">`;
                description += `<h6 style="color: #ffd700; margin: 8px 0 5px 0; font-size: 12px;">💡 Fun Facts</h6>`;
                description += `<ul class="fun-facts-list">`;
                edu.funFacts.forEach(fact => {
                    description += `<li style="background: rgba(255, 215, 0, 0.15); margin: 4px 0; padding: 6px 10px; border-radius: 4px; border-left: 2px solid #ffd700; font-size: 10px; line-height: 1.3;">${fact}</li>`;
                });
                description += `</ul></div>`;
            }

            description += `</div>`;
        }

        // Technical info - Show ALL technical details
        if (shapeInfo.technical) {
            description += `<div class="shape-section">`;
            description += `<h5>Technical Specifications</h5>`;

            for (const [key, value] of Object.entries(shapeInfo.technical)) {
                if (value !== null && value !== undefined && value !== '') {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    if (Array.isArray(value)) {
                        description += `<span class="property">${label}: ${value.join(', ')}</span>`;
                    } else if (typeof value === 'object') {
                        const formatted = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
                        description += `<span class="property">${label}: ${formatted}</span>`;
                    } else {
                        description += `<span class="property">${label}: ${value}</span>`;
                    }
                }
            }
            description += `</div>`;
        }

        // Visual information - Show ALL visual details with enhanced formatting
        if (shapeInfo.visual) {
            description += `<div class="shape-section">`;
            description += `<h5>Visual Information</h5>`;

            const vis = shapeInfo.visual;
            if (vis.defaultMaterial) {
                description += `<span class="property">Default Material: ${vis.defaultMaterial}</span>`;
            }
            if (vis.recommendedColors && vis.recommendedColors.length > 0) {
                description += `<div class="color-palette-section">`;
                description += `<span class="property">Recommended Colors:</span>`;
                description += `<div class="color-palette">`;
                vis.recommendedColors.forEach(color => {
                    description += `<span class="color-swatch" style="background-color: ${color}; display: inline-block; width: 24px; height: 24px; margin: 3px; border-radius: 4px; border: 2px solid rgba(255,255,255,0.3); cursor: pointer;" title="${color}"></span>`;
                });
                description += `</div>`;
                description += `<div style="font-size: 9px; color: #bbb; margin-top: 2px;">${vis.recommendedColors.join(' • ')}</div>`;
                description += `</div>`;
            }
            if (vis.bestViewingAngles && vis.bestViewingAngles.length > 0) {
                description += `<span class="property">Best Viewing Angles: ${vis.bestViewingAngles.join(', ')}</span>`;
            }
            if (vis.animationSuggestions && vis.animationSuggestions.length > 0) {
                description += `<span class="property">Animation Suggestions: ${vis.animationSuggestions.join(', ')}</span>`;
            }
            if (vis.specialFeatures && vis.specialFeatures.length > 0) {
                description += `<span class="property">Special Features: ${vis.specialFeatures.join(', ')}</span>`;
            }
            description += `</div>`;
        }

        // Metadata - Show ALL metadata
        if (shapeInfo.metadata && Object.keys(shapeInfo.metadata).length > 0) {
            description += `<div class="shape-section">`;
            description += `<h5>Metadata</h5>`;

            for (const [key, value] of Object.entries(shapeInfo.metadata)) {
                if (value !== null && value !== undefined && value !== '') {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    description += `<span class="property">${label}: ${value}</span>`;
                }
            }
            description += `</div>`;
        }

        // Tags and difficulty
        description += `<div class="shape-section">`;
        if (shapeInfo.difficulty) {
            const difficultyStars = '★'.repeat(shapeInfo.difficulty) + '☆'.repeat(5 - shapeInfo.difficulty);
            description += `<span class="property difficulty">Difficulty: ${difficultyStars}</span>`;
        }
        if (shapeInfo.tags && shapeInfo.tags.length > 0) {
            description += `<div class="tags">`;
            shapeInfo.tags.forEach(tag => {
                description += `<span class="tag">${tag}</span>`;
            });
            description += `</div>`;
        }
        description += `</div>`;

        description += `</div>`;
    } else {
        // Fallback to old descriptions
        description = shapeDescriptions[shapeName] || 'No description available.';
    }

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