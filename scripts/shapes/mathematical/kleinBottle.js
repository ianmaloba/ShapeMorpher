// kleinBottle.js - Mathematical Klein bottle
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class KleinBottle extends BaseShape {
    constructor() {
        super('kleinBottle', 'Klein Bottle', 'MATHEMATICAL SHAPES');

        this.setDescription('A Klein bottle is a non-orientable surface that has no distinct inside or outside. It is a fascinating topological object that cannot exist in 3D space without self-intersection, representing a 4D surface projected into 3D.')
            .setTags('mathematical', 'topology', 'non-orientable', 'bottle', 'parametric', '4D', 'klein')
            .setDifficulty(5);

        this.setProperties({
            faces: 'N/A (smooth surface)',
            vertices: 'N/A (smooth surface)',
            edges: 'N/A (smooth surface)',
            volume: 0,  // Non-orientable surface has no well-defined volume
            surfaceArea: 'Variable (depends on parametrization)',
            eulerCharacteristic: 0  // χ = 0 for Klein bottle
        });

        this.setMathematical({
            equation: 'Parametric: see createGeometry implementation',
            parametricDomain: { u: [0, 2*Math.PI], v: [0, 2*Math.PI] },
            symmetryGroup: 'Klein four-group',
            classification: 'Non-orientable closed surface, quotient of torus',
            discoverer: 'Felix Klein',
            yearDiscovered: 1882
        });

        this.setEducational({
            level: 'expert',
            topics: ['topology', 'differential-geometry', 'non-orientable-surfaces', 'algebraic-topology'],
            applications: ['theoretical-physics', 'mathematical-modeling', 'computer-graphics', 'topology-education'],
            relatedShapes: ['mobius', 'romanSurface', 'boySurface', 'crossCap'],
            interactiveFeatures: ['rotation', 'material-transparency', 'wireframe-overlay']
        });

        this.setTechnical({
            renderComplexity: 'high',
            recommendedSegments: { min: 16, max: 128, default: 64 },
            performanceNotes: 'Complex parametric calculations, benefits from higher segment counts',
            limitations: ['Self-intersections cannot be avoided', 'High polygon count at detailed settings']
        });

        this.setVisual({
            defaultMaterial: 'physical',
            recommendedColors: ['#8e44ad', '#3498db', '#e74c3c', '#f39c12'],
            bestViewingAngles: ['diagonal', 'rotating'],
            animationSuggestions: ['slow-continuous-rotation', 'transparency-animation', 'color-cycling']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Mathematical Team',
            status: 'stable'
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= TWO_PI;
            v *= TWO_PI;
            const r = 4 * (1 - Math.cos(u) / 2);
            target.x = Math.cos(u) * (6 + r * Math.cos(v));
            target.y = Math.sin(u) * (6 + r * Math.cos(v));
            target.z = r * Math.sin(v);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new KleinBottle();
    shape.register(registry);
}