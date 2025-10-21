// shapes.js - Updated to use the new shape registry system
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { shapeRegistry } from './shapeRegistry.js';

// Initialize the shape registry
let isInitialized = false;

export async function initializeShapes() {
    if (isInitialized) return;

    try {
        await shapeRegistry.initialize();
        isInitialized = true;
        console.log('Shape system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize shape system:', error);
        // Fallback to basic shapes if loading fails
        initializeFallbackShapes();
        isInitialized = true;
    }
}

// Fallback shapes in case dynamic loading fails
function initializeFallbackShapes() {
    console.log('Loading fallback shapes...');

    // Register basic shapes directly
    const fallbackShapes = [
        {
            id: 'cube',
            name: 'Cube',
            category: 'BASIC SHAPES',
            description: 'A perfect cube with 6 equal faces',
            geometry: () => new THREE.BoxGeometry(2, 2, 2),
            tags: ['basic', 'simple'],
            difficulty: 1
        },
        {
            id: 'sphere',
            name: 'Sphere',
            category: 'BASIC SHAPES',
            description: 'A perfect sphere',
            geometry: (segments = 32) => new THREE.SphereGeometry(1, segments, segments),
            tags: ['basic', 'round'],
            difficulty: 1
        }
    ];

    fallbackShapes.forEach(shape => shapeRegistry.registerShape(shape));
}

// Main function to create geometry (now uses registry)
export function createGeometry(shapeName, segments = 32) {
    if (!isInitialized) {
        console.warn('Shape system not initialized, using fallback');
        return new THREE.BoxGeometry(2, 2, 2);
    }

    const shape = shapeRegistry.getShape(shapeName);
    if (!shape) {
        console.warn(`Shape "${shapeName}" not found. Using cube.`);
        return new THREE.BoxGeometry(2, 2, 2);
    }

    try {
        return shape.geometry(segments);
    } catch (error) {
        console.error(`Error creating geometry for ${shapeName}:`, error);
        return new THREE.BoxGeometry(2, 2, 2);
    }
}

// Get shape information
export function getShapeInfo(shapeName) {
    return shapeRegistry.getShape(shapeName);
}

// Search shapes
export function searchShapes(query) {
    return shapeRegistry.searchShapes(query);
}

// Get all shapes
export function getAllShapes() {
    return shapeRegistry.getAllShapes();
}

// Get shapes by category
export function getShapesByCategory(category) {
    return shapeRegistry.getShapesByCategory(category);
}

// Update UI (will be called after initialization)
export function updateShapeUI() {
    shapeRegistry.updateUI();
}

// Export the registry for direct access if needed
export { shapeRegistry };