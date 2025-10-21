// cylinder.js - Basic cylinder shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class Cylinder extends BaseShape {
    constructor() {
        super('cylinder', 'Cylinder', 'BASIC SHAPES');

        this.setDescription('A cylinder with circular cross-section - a prism with a circular base and parallel sides. One of the most fundamental and useful shapes in engineering and everyday applications.')
            .setTags('basic', 'circular', 'prism', 'tube', 'column', 'engineering', 'rotational')
            .setDifficulty(1);

        this.setProperties({
            faces: '3 (2 circular bases + 1 curved surface)',
            vertices: '0 (smooth curves)',
            edges: '2 (circular edges)',
            volume: 'πr²h',
            surfaceArea: '2πr² + 2πrh',
            crossSection: 'Circle (perpendicular to axis)'
        });

        this.setMathematical({
            equation: 'x² + y² = r², z ∈ [0, h]',
            parametricForm: 'x = r×cos(θ), y = r×sin(θ), z = t',
            symmetryGroup: 'Cylindrical symmetry (C∞v)',
            classification: 'Right circular cylinder',
            generatingCurve: 'Circle',
            discoverer: 'Ancient civilizations',
            yearDiscovered: -3000
        });

        this.setEducational({
            level: 'beginner',
            topics: ['basic-geometry', 'volume-calculation', 'surface-area', 'rotational-solids'],
            applications: ['pipes', 'cans', 'columns', 'tanks', 'pistons', 'wheels'],
            relatedShapes: ['circle', 'cone', 'sphere'],
            interactiveFeatures: ['radius-adjustment', 'height-scaling', 'rotation'],
            funFacts: [
                'Most beverage cans are cylinders for optimal material usage',
                'Tree trunks approximate cylinders for structural efficiency',
                'The volume formula was known to ancient Babylonians'
            ]
        });

        this.setTechnical({
            renderComplexity: 'low',
            recommendedSegments: { min: 8, max: 64, default: 32 },
            performanceNotes: 'Very efficient, uses native Three.js CylinderGeometry',
            limitations: ['None for standard applications']
        });

        this.setVisual({
            defaultMaterial: 'standard',
            recommendedColors: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'],
            bestViewingAngles: ['side', 'isometric', 'top-down'],
            animationSuggestions: ['rotation-around-axis', 'height-morphing', 'radius-pulsing'],
            specialFeatures: ['smooth-curved-surface', 'circular-symmetry']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Basic Shapes Team',
            status: 'stable',
            educationalValue: 'Perfect for introducing 3D geometry concepts'
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return new THREE.CylinderGeometry(1, 1, 2, segments);
    }
}

export function registerShape(registry) {
    const shape = new Cylinder();
    shape.register(registry);
}