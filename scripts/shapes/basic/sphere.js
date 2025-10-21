// sphere.js - Basic sphere shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class Sphere extends BaseShape {
    constructor() {
        super('sphere', 'Sphere', 'BASIC SHAPES');

        this.setDescription('A perfect sphere - the set of all points equidistant from a center point. The most symmetric 3D shape and fundamental form in geometry.')
            .setTags('basic', 'round', 'smooth', 'ball', 'spherical', 'symmetric')
            .setDifficulty(1);

        this.setProperties({
            faces: 'N/A (smooth surface)',
            vertices: 'N/A (smooth surface)',
            edges: 'N/A (smooth surface)',
            volume: 33.51,              // 4/3 * π * r³ for r=2
            surfaceArea: 50.27,         // 4 * π * r² for r=2
            eulerCharacteristic: 2      // χ = 2 for sphere
        });

        this.setMathematical({
            equation: 'x² + y² + z² = r²',
            parametricDomain: { u: [0, 2*Math.PI], v: [0, Math.PI] },
            symmetryGroup: 'O(3)',
            classification: 'Smooth manifold, 2-sphere',
            discoverer: 'Ancient civilizations',
            yearDiscovered: -3000
        });

        this.setEducational({
            level: 'beginner',
            topics: ['geometry', 'calculus', 'spherical-coordinates', 'surface-area', 'volume'],
            applications: ['astronomy', 'physics', 'engineering', 'architecture', 'sports'],
            relatedShapes: ['ellipsoid', 'torus', 'cube'],
            interactiveFeatures: ['rotation', 'scaling', 'material-change', 'segment-adjustment']
        });

        this.setTechnical({
            renderComplexity: 'medium',
            recommendedSegments: { min: 8, max: 128, default: 32 },
            performanceNotes: 'Segment count significantly affects quality and performance',
            limitations: ['Low segment counts create visible faceting']
        });

        this.setVisual({
            defaultMaterial: 'standard',
            recommendedColors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71'],
            bestViewingAngles: ['any'],
            animationSuggestions: ['smooth-rotation', 'pulsing', 'color-transition']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Core Team',
            status: 'stable'
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return new THREE.SphereGeometry(1, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Sphere();
    shape.register(registry);
}