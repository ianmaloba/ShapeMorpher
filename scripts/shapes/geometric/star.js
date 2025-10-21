// star.js - Geometric star polyhedron
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class Star extends BaseShape {
    constructor() {
        super('star', 'Star Polyhedron', 'GEOMETRIC VARIATIONS');

        this.setDescription('A star polyhedron is a polyhedron which has some repetitive quality but is not necessarily convex. This creates a spiky, star-like appearance with fascinating geometric properties.')
            .setTags('geometric', 'star', 'polyhedron', 'spiky', 'non-convex', 'angular', 'symmetrical')
            .setDifficulty(3);

        this.setProperties({
            faces: '20 triangular faces (icosahedral base)',
            vertices: '12 vertices',
            edges: '30 edges',
            volume: 'Variable (depends on spike extension)',
            surfaceArea: 'Variable (increased by spikes)',
            convexity: 'Non-convex'
        });

        this.setMathematical({
            equation: 'Extended icosahedron with radial projections',
            baseShape: 'Icosahedron',
            symmetryGroup: 'Icosahedral symmetry (I_h)',
            classification: 'Stellation of icosahedron',
            stellationLevel: 1,
            dualPolyhedron: 'Compound dodecahedron',
            discoverer: 'Kepler (stellation concept)',
            yearDiscovered: 1619
        });

        this.setEducational({
            level: 'intermediate',
            topics: ['polyhedra', 'stellation', 'symmetry', 'non-convex-geometry', 'platonic-solids'],
            applications: ['crystallography', 'molecular-geometry', 'architectural-design', 'decorative-arts'],
            relatedShapes: ['icosahedron', 'dodecahedron', 'compound-polyhedra'],
            interactiveFeatures: ['spike-adjustment', 'symmetry-highlighting', 'rotation', 'vertex-exploration'],
            funFacts: [
                'Star polyhedra can be created by extending faces of regular polyhedra',
                'Some star polyhedra have negative volume regions',
                'Used in some virus structures and molecular arrangements'
            ]
        });

        this.setTechnical({
            renderComplexity: 'low-medium',
            recommendedSegments: { min: 8, max: 32, default: 16 },
            performanceNotes: 'Efficient rendering based on icosahedral geometry',
            limitations: ['Spike length affects visual complexity', 'Self-intersection possible with extreme parameters']
        });

        this.setVisual({
            defaultMaterial: 'standard',
            recommendedColors: ['#f39c12', '#e74c3c', '#8e44ad', '#3498db'],
            bestViewingAngles: ['isometric', 'vertex-centered', 'edge-centered'],
            animationSuggestions: ['rotation', 'spike-pulsing', 'symmetry-demonstration'],
            specialFeatures: ['sharp-spikes', 'icosahedral-symmetry', 'non-convex-form']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Geometric Team',
            status: 'stable',
            educationalValue: 'Great for teaching stellation and non-convex geometry'
        });
    }

    createGeometry(segments = 32) {
        return new THREE.IcosahedronGeometry(1, 1);
    }
}

export function registerShape(registry) {
    const shape = new Star();
    shape.register(registry);
}