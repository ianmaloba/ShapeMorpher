// mobius.js - Mathematical Möbius strip
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Mobius extends BaseShape {
    constructor() {
        super('mobius', 'Möbius Strip', 'MATHEMATICAL SHAPES');

        this.setDescription('A surface with only one side and one boundary. Famous for its topological properties, the Möbius strip demonstrates non-orientable surfaces and is fundamental in topology and differential geometry.')
            .setTags('mathematical', 'topology', 'non-orientable', 'one-sided', 'möbius', 'strip', 'boundary', 'twist')
            .setDifficulty(5);

        this.setProperties({
            faces: '1 (single surface)',
            vertices: 'N/A (continuous surface)',
            edges: '1 (single boundary)',
            volume: '0 (2D surface in 3D)',
            surfaceArea: 'π√3 - π/2',
            eulerCharacteristic: 0      // Non-orientable surface
        });

        this.setMathematical({
            equation: 'x = (1 + v/2 * cos(u/2)) * cos(u), y = (1 + v/2 * cos(u/2)) * sin(u), z = v/2 * sin(u/2)',
            parametricDomain: { u: [0, 2*Math.PI], v: [-1, 1] },
            symmetryGroup: 'C₂ (180° rotational symmetry)',
            classification: 'Non-orientable surface',
            topologicalGenus: 'Non-orientable genus 1',
            discoverer: 'August Ferdinand Möbius',
            yearDiscovered: 1858
        });

        this.setEducational({
            level: 'advanced',
            topics: ['topology', 'differential-geometry', 'non-orientable-surfaces', 'parametric-geometry', 'mathematical-visualization'],
            applications: ['topology-research', 'conveyor-belts', 'electronic-circuits', 'art-installations', 'mathematical-education'],
            relatedShapes: ['kleinBottle', 'crossCap', 'romanSurface'],
            interactiveFeatures: ['one-side-demonstration', 'boundary-highlighting', 'twist-animation'],
            funFacts: [
                'If you cut along the center line, you get one longer loop!',
                'Has only one side - you can paint the entire surface without lifting your brush',
                'Inspired the recycling symbol design'
            ]
        });

        this.setTechnical({
            renderComplexity: 'medium',
            recommendedSegments: { min: 16, max: 64, default: 32 },
            performanceNotes: 'Efficient rendering, good for educational demonstrations',
            limitations: ['Self-intersection can cause rendering artifacts', 'Requires careful material handling for one-sided surface']
        });

        this.setVisual({
            defaultMaterial: 'physical',
            recommendedColors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71'],
            bestViewingAngles: ['angled', 'edge-on', 'rotating'],
            animationSuggestions: ['slow-rotation', 'twist-demonstration', 'edge-highlighting'],
            specialFeatures: ['one-sided-surface', 'single-boundary', 'non-orientable']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Mathematical Team',
            status: 'stable',
            educationalValue: 'Excellent for teaching topology concepts'
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= TWO_PI;
            v = v * 2 - 1;
            const radius = 1 + v * 0.5 * Math.cos(u * 0.5);
            target.x = radius * Math.cos(u);
            target.y = radius * Math.sin(u);
            target.z = v * 0.5 * Math.sin(u * 0.5);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Mobius();
    shape.register(registry);
}