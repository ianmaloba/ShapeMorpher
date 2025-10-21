// tetrahedron.js - Platonic solid tetrahedron
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class Tetrahedron extends BaseShape {
    constructor() {
        super('tetrahedron', 'Tetrahedron', 'PLATONIC SOLIDS');

        this.setDescription('The simplest Platonic solid with 4 triangular faces, 6 edges, and 4 vertices. Each face is an equilateral triangle, making it the building block of 3D geometry.')
            .setTags('platonic', 'triangular', 'simplest', 'pyramid', 'tetrahedral', 'regular')
            .setDifficulty(2);

        this.setProperties({
            faces: 4,
            vertices: 4,
            edges: 6,
            volume: 0.94,               // √2/12 * a³ for edge length a
            surfaceArea: 6.93,          // √3 * a² for edge length a
            eulerCharacteristic: 2      // V - E + F = 4 - 6 + 4 = 2
        });

        this.setMathematical({
            equation: 'Regular triangular pyramid',
            symmetryGroup: 'T_d',
            classification: 'Regular polyhedron, Platonic solid',
            discoverer: 'Ancient Greeks',
            yearDiscovered: -500
        });

        this.setEducational({
            level: 'beginner',
            topics: ['geometry', 'polyhedra', 'symmetry', 'platonic-solids', 'triangulation'],
            applications: ['chemistry', 'crystallography', 'architecture', 'molecular-geometry'],
            relatedShapes: ['octahedron', 'cube', 'triangularPrism'],
            interactiveFeatures: ['rotation', 'scaling', 'wireframe', 'face-highlighting']
        });

        this.setTechnical({
            renderComplexity: 'low',
            recommendedSegments: { min: 1, max: 1, default: 1 },
            performanceNotes: 'Extremely efficient - built-in Three.js geometry',
            limitations: ['Segments parameter has no effect']
        });

        this.setVisual({
            defaultMaterial: 'standard',
            recommendedColors: ['#e74c3c', '#3498db', '#f39c12', '#2ecc71'],
            bestViewingAngles: ['corner', 'edge', 'face'],
            animationSuggestions: ['tumbling', 'vertex-rotation', 'color-transition']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Core Team',
            status: 'stable'
        });
    }

    createGeometry(segments = 32) {
        return new THREE.TetrahedronGeometry(1);
    }
}

export function registerShape(registry) {
    const shape = new Tetrahedron();
    shape.register(registry);
}