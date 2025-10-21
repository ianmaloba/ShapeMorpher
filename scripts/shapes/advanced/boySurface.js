// boySurface.js - Advanced mathematical Boy's surface
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class BoySurface extends BaseShape {
    constructor() {
        super('boySurface', "Boy's Surface", 'ADVANCED MATHEMATICAL');

        this.setDescription("Boy's surface is an immersion of the real projective plane in 3-dimensional space. It demonstrates advanced topological concepts and is famous for being the first known non-orientable surface without self-intersections.")
            .setTags('advanced', 'topology', 'projective', 'non-orientable', 'immersion', 'boy-surface', 'mathematical', 'research')
            .setDifficulty(5);

        this.setProperties({
            faces: 'N/A (immersed surface)',
            vertices: 'N/A (continuous immersion)',
            edges: 'N/A (no boundary)',
            volume: '0 (2D surface in 3D)',
            surfaceArea: 'Complex (non-elementary)',
            eulerCharacteristic: 1      // Real projective plane
        });

        this.setMathematical({
            equation: 'Complex parametric immersion with three-fold symmetry',
            parametricDomain: { u: [0, Math.PI], v: [0, 2*Math.PI] },
            symmetryGroup: 'C₃ (three-fold rotational)',
            classification: 'Immersed real projective plane',
            topologicalGenus: 'Non-orientable, genus 1',
            discoverer: 'Werner Boy',
            yearDiscovered: 1901,
            relatedTheory: 'Developed by Apéry (1986) parametrization'
        });

        this.setEducational({
            level: 'research',
            topics: ['algebraic-topology', 'differential-geometry', 'immersion-theory', 'projective-geometry', 'non-orientable-surfaces'],
            applications: ['topology-research', 'mathematical-visualization', 'theoretical-physics', 'computer-graphics'],
            relatedShapes: ['crossCap', 'romanSurface', 'mobius'],
            prerequisites: ['Advanced calculus', 'Differential geometry', 'Topology'],
            interactiveFeatures: ['complex-rotation', 'symmetry-demonstration', 'self-intersection-avoidance']
        });

        this.setTechnical({
            renderComplexity: 'very-high',
            recommendedSegments: { min: 32, max: 256, default: 96 },
            performanceNotes: 'Computationally intensive, requires high precision arithmetic',
            limitations: [
                'Complex parametric equations may cause numerical instability',
                'High segment count needed for smooth appearance',
                'Self-intersection avoidance requires careful implementation'
            ]
        });

        this.setVisual({
            defaultMaterial: 'physical',
            recommendedColors: ['#8e44ad', '#e74c3c', '#3498db', '#f39c12'],
            bestViewingAngles: ['isometric', 'rotating', 'multiple-views'],
            animationSuggestions: ['slow-rotation', 'symmetry-highlighting', 'cross-section-analysis'],
            specialFeatures: ['non-orientable', 'self-intersection-free', 'three-fold-symmetry']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Advanced Research Team',
            status: 'research',
            educationalValue: 'Graduate-level topology and differential geometry',
            computationalComplexity: 'O(n²) where n is segment count'
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= PI;
            v *= TWO_PI;

            const a = Math.sin(u);
            const b = Math.cos(u) * Math.sin(v);
            const c = Math.cos(u) * Math.cos(v);
            const d = 0.5 * (Math.pow(c, 3) - 3 * c * Math.pow(b, 2));

            target.x = a * d;
            target.y = a * (Math.pow(b, 3) - 3 * b * Math.pow(c, 2));
            target.z = -0.5 * a * (Math.pow(b, 2) * c + Math.pow(c, 3));
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new BoySurface();
    shape.register(registry);
}