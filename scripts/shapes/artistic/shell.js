// shell.js - Artistic nautilus shell shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Shell extends BaseShape {
    constructor() {
        super('shell', 'Nautilus Shell', 'ARTISTIC SHAPES');

        this.setDescription('A nautilus shell shape that demonstrates the logarithmic spiral found in nature. This beautiful form combines mathematical precision with organic aesthetics, showcasing the golden ratio and Fibonacci sequences.')
            .setTags('artistic', 'shell', 'nautilus', 'spiral', 'logarithmic', 'golden-ratio', 'fibonacci', 'organic')
            .setDifficulty(4);

        this.setProperties({
            faces: 'N/A (parametric surface)',
            vertices: 'N/A (parametric surface)',
            edges: 'N/A (parametric surface)',
            volume: 'Variable',
            surfaceArea: 'Variable',
            eulerCharacteristic: 2      // Topologically equivalent to sphere
        });

        this.setMathematical({
            equation: 'Logarithmic spiral with 3D projection',
            parametricDomain: { u: [0, 4*Math.PI], v: [0, Math.PI] },
            symmetryGroup: 'Spiral symmetry',
            classification: 'Logarithmic spiral surface',
            discoverer: 'Nature / Jakob Bernoulli',
            yearDiscovered: 1692
        });

        this.setEducational({
            level: 'intermediate',
            topics: ['biomathematics', 'spirals', 'fibonacci', 'golden-ratio', 'parametric-surfaces'],
            applications: ['biology', 'biomimetics', 'architecture', 'art', 'design'],
            relatedShapes: ['fibonacci', 'horn', 'helix'],
            interactiveFeatures: ['rotation', 'scaling', 'transparency', 'spiral-animation']
        });

        this.setTechnical({
            renderComplexity: 'high',
            recommendedSegments: { min: 16, max: 128, default: 48 },
            performanceNotes: 'Complex parametric calculations, benefits from higher segments',
            limitations: ['Requires careful parameter tuning for realistic appearance']
        });

        this.setVisual({
            defaultMaterial: 'physical',
            recommendedColors: ['#f4d03f', '#e8daef', '#fadbd8', '#d5f4e6'],
            bestViewingAngles: ['side', 'diagonal', 'spiral-view'],
            animationSuggestions: ['gentle-rotation', 'spiral-growth', 'color-gradient']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Artistic Team',
            status: 'stable'
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= 4 * PI;
            v = v * PI;

            const a = 0.2;
            const b = 0.6;
            const c = 0.2;
            const n = 4;

            const r = a + b * Math.pow(v / PI, n);

            target.x = r * Math.cos(u) * Math.sin(v);
            target.y = r * Math.sin(u) * Math.sin(v);
            target.z = r * Math.cos(v) - c * u;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Shell();
    shape.register(registry);
}