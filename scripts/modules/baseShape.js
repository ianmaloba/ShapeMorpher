// baseShape.js - Base template for creating shapes
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Utility constants
export const PI = Math.PI;
export const TWO_PI = 2 * Math.PI;

// Utility function to create parametric geometry
export function createParametricGeometry(func, slices, stacks) {
    return new THREE.ParametricGeometry(func, slices, stacks);
}

// Base shape class
export class BaseShape {
    constructor(id, name, category) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = '';
        this.tags = [];
        this.difficulty = 1;

        // Extended metadata for future expansion
        this.properties = {
            faces: null,
            vertices: null,
            edges: null,
            volume: null,
            surfaceArea: null,
            eulerCharacteristic: null
        };

        this.mathematical = {
            equation: '',
            parametricDomain: { u: [0, 1], v: [0, 1] },
            symmetryGroup: '',
            classification: '',
            discoverer: '',
            yearDiscovered: null
        };

        this.educational = {
            level: 'beginner', // beginner, intermediate, advanced, expert
            topics: [], // geometry, topology, calculus, algebra, etc.
            applications: [], // architecture, engineering, art, physics, etc.
            relatedShapes: [],
            interactiveFeatures: []
        };

        this.technical = {
            renderComplexity: 'low', // low, medium, high
            recommendedSegments: { min: 8, max: 64, default: 32 },
            performanceNotes: '',
            limitations: []
        };

        this.visual = {
            defaultMaterial: 'standard',
            recommendedColors: [],
            bestViewingAngles: [],
            animationSuggestions: []
        };

        this.metadata = {
            version: '1.0.0',
            author: '',
            dateAdded: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            status: 'stable', // experimental, beta, stable, deprecated
            license: 'MIT'
        };
    }

    // Override this method to create the geometry
    createGeometry(segments = 32) {
        throw new Error('createGeometry method must be implemented');
    }

    // Set description
    setDescription(description) {
        this.description = description;
        return this;
    }

    // Set tags for search
    setTags(...tags) {
        this.tags = tags;
        return this;
    }

    // Set difficulty level (1-5)
    setDifficulty(level) {
        this.difficulty = Math.max(1, Math.min(5, level));
        return this;
    }

    // Set geometric properties
    setProperties(properties) {
        this.properties = { ...this.properties, ...properties };
        return this;
    }

    // Set mathematical information
    setMathematical(mathematical) {
        this.mathematical = { ...this.mathematical, ...mathematical };
        return this;
    }

    // Set educational metadata
    setEducational(educational) {
        this.educational = { ...this.educational, ...educational };
        return this;
    }

    // Set technical specifications
    setTechnical(technical) {
        this.technical = { ...this.technical, ...technical };
        return this;
    }

    // Set visual preferences
    setVisual(visual) {
        this.visual = { ...this.visual, ...visual };
        return this;
    }

    // Set metadata
    setMetadata(metadata) {
        this.metadata = { ...this.metadata, ...metadata, lastModified: new Date().toISOString() };
        return this;
    }

    // Get comprehensive shape data for registry
    getShapeData() {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            description: this.description,
            geometry: this.createGeometry.bind(this),
            tags: this.tags,
            difficulty: this.difficulty,
            properties: this.properties,
            mathematical: this.mathematical,
            educational: this.educational,
            technical: this.technical,
            visual: this.visual,
            metadata: this.metadata
        };
    }

    // Helper method to register this shape
    register(registry) {
        registry.registerShape(this.getShapeData());
    }
}

// Helper functions for common operations
export const ShapeUtils = {
    // Clamp segments to reasonable values
    clampSegments(segments, min = 3, max = 128) {
        return Math.min(Math.max(segments, min), max);
    },

    // Calculate detail level for recursive shapes
    calculateDetail(segments, maxDetail = 3) {
        return Math.min(maxDetail, Math.floor(segments / 16));
    },

    // Create a simple warning geometry for unsupported shapes
    createWarningGeometry() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        console.warn('Using warning geometry - shape implementation missing');
        return geometry;
    }
};

/*
SHAPE FILE TEMPLATE:

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../modules/baseShape.js';

class MyShape extends BaseShape {
    constructor() {
        super('myshape', 'My Shape', 'BASIC SHAPES');
        this.setDescription('Description of my shape')
            .setTags('tag1', 'tag2', 'mathematical')
            .setDifficulty(2);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);

        // Create your geometry here
        return new THREE.BoxGeometry(1, 1, 1);
    }
}

export function registerShape(registry) {
    const shape = new MyShape();
    shape.register(registry);
}
*/