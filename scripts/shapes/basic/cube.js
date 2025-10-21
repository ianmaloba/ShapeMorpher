// cube.js - Basic cube shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class Cube extends BaseShape {
    constructor() {
        super('cube', 'Cube', 'BASIC SHAPES');

        this.setDescription('A perfect cube - one of the most fundamental 3D shapes with 6 equal square faces, 12 edges, and 8 vertices. Also known as a regular hexahedron, it is one of the five Platonic solids.')
            .setTags('basic', 'simple', 'rectangular', 'hexahedron', 'regular', 'platonic')
            .setDifficulty(1);

        this.setProperties({
            faces: 6,
            vertices: 8,
            edges: 12,
            volume: 8,              // For 2x2x2 cube
            surfaceArea: 24,        // For 2x2x2 cube
            eulerCharacteristic: 2  // V - E + F = 8 - 12 + 6 = 2
        });

        this.setMathematical({
            equation: '|x| ≤ a, |y| ≤ a, |z| ≤ a',
            symmetryGroup: 'O_h',
            classification: 'Regular polyhedron, Platonic solid',
            discoverer: 'Ancient civilizations',
            yearDiscovered: -3000
        });

        this.setEducational({
            level: 'beginner',
            topics: ['geometry', 'polyhedra', 'symmetry', 'volume', 'surface-area'],
            applications: ['architecture', 'packaging', 'gaming', 'crystallography'],
            relatedShapes: ['tetrahedron', 'octahedron', 'dodecahedron', 'icosahedron'],
            interactiveFeatures: ['rotation', 'scaling', 'material-change', 'wireframe']
        });

        this.setTechnical({
            renderComplexity: 'low',
            recommendedSegments: { min: 1, max: 1, default: 1 },
            performanceNotes: 'Extremely efficient - uses optimized BoxGeometry',
            limitations: ['Segments parameter has no effect on cubes']
        });

        this.setVisual({
            defaultMaterial: 'standard',
            recommendedColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93f'],
            bestViewingAngles: ['isometric', 'corner', 'face-on'],
            animationSuggestions: ['slow-rotation', 'tumbling', 'color-transition']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Core Team',
            status: 'stable'
        });
    }

    createGeometry(segments = 32) {
        return new THREE.BoxGeometry(2, 2, 2);
    }
}

export function registerShape(registry) {
    const shape = new Cube();
    shape.register(registry);
}