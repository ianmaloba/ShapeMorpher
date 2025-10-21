// sierpinski.js - Fractal Sierpinski pyramid
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class Sierpinski extends BaseShape {
    constructor() {
        super('sierpinski', 'Sierpinski Pyramid', 'FRACTALS AND COMPLEX');

        this.setDescription('The Sierpinski pyramid is a 3D fractal formed by recursively subdividing a tetrahedron. It demonstrates self-similarity and infinite detail at all scales, showcasing the mathematical beauty of fractals.')
            .setTags('fractal', 'self-similar', 'recursive', 'sierpinski', 'tetrahedron', 'infinite-detail', 'mathematical', 'chaos-theory')
            .setDifficulty(4);

        this.setProperties({
            faces: '4^n (where n is iteration level)',
            vertices: '4 + 6n (approximate)',
            edges: '6 + 12n (approximate)',
            volume: '(1/2)^n × original volume',
            surfaceArea: '2^n × (3/4) × original area',
            hausdorffDimension: '≈ 2.0 (surface), log₂(4) = 2'
        });

        this.setMathematical({
            equation: 'Recursive subdivision: T_{n+1} = subdivide(T_n) with midpoint removal',
            iterativeRule: 'Remove central tetrahedron, subdivide remaining 4 tetrahedra',
            symmetryGroup: 'Tetrahedral symmetry (T_d)',
            classification: 'Deterministic fractal',
            fractalDimension: 'log(4)/log(2) = 2',
            discoverer: 'Wacław Sierpiński (extended to 3D)',
            yearDiscovered: 1915,
            selfSimilarity: 'Exact self-similarity at scale 1/2'
        });

        this.setEducational({
            level: 'intermediate',
            topics: ['fractals', 'recursion', 'self-similarity', 'chaos-theory', 'computational-geometry', 'mathematical-visualization'],
            applications: ['fractal-geometry', 'computer-graphics', 'antenna-design', 'mathematical-art', 'chaos-theory-education'],
            relatedShapes: ['tetrahedron', 'fibonacci', 'hyperboloid'],
            interactiveFeatures: ['iteration-control', 'recursive-animation', 'self-similarity-zoom'],
            funFacts: [
                'Has infinite surface area but zero volume at infinite iterations',
                'Each smaller tetrahedron is exactly 1/4 the size of its parent',
                'Used in some antenna designs for better signal distribution'
            ]
        });

        this.setTechnical({
            renderComplexity: 'variable-high',
            recommendedSegments: { min: 8, max: 64, default: 16 },
            performanceNotes: 'Complexity increases exponentially with iteration level',
            limitations: [
                'High iteration levels can cause performance issues',
                'Recursive generation requires careful memory management',
                'Visual detail limited by screen resolution at high iterations'
            ],
            iterationLevels: { min: 1, max: 6, default: 3 }
        });

        this.setVisual({
            defaultMaterial: 'physical',
            recommendedColors: ['#e74c3c', '#3498db', '#f39c12', '#2ecc71'],
            bestViewingAngles: ['isometric', 'rotating', 'closeup-detail'],
            animationSuggestions: ['rotation-with-zoom', 'iteration-building', 'self-similarity-demonstration'],
            specialFeatures: ['recursive-structure', 'infinite-detail', 'self-similarity']
        });

        this.setMetadata({
            version: '2.0.0',
            author: 'ShapeMorpher Fractal Team',
            status: 'stable',
            educationalValue: 'Excellent for teaching fractal concepts and recursion',
            computationalComplexity: 'O(4^n) where n is iteration level'
        });
    }

    createGeometry(segments = 32) {
        const detail = ShapeUtils.calculateDetail(segments);
        return this.createSierpinskiPyramid(detail);
    }

    createSierpinskiPyramid(detail) {
        const vertices = [
            new THREE.Vector3(0, 1, 0),   // Top
            new THREE.Vector3(-1, -1, 1), // Front left
            new THREE.Vector3(1, -1, 1),  // Front right
            new THREE.Vector3(0, -1, -1)  // Back
        ];

        function subdivide(v1, v2, v3, depth) {
            if (depth === 0) {
                return [v1, v2, v3];
            }

            const v12 = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
            const v23 = new THREE.Vector3().addVectors(v2, v3).multiplyScalar(0.5);
            const v31 = new THREE.Vector3().addVectors(v3, v1).multiplyScalar(0.5);

            return [
                ...subdivide(v1, v12, v31, depth - 1),
                ...subdivide(v12, v2, v23, depth - 1),
                ...subdivide(v31, v23, v3, depth - 1)
            ];
        }

        const faces = [
            [vertices[0], vertices[1], vertices[2]],
            [vertices[0], vertices[2], vertices[3]],
            [vertices[0], vertices[3], vertices[1]],
            [vertices[1], vertices[3], vertices[2]]
        ];

        let finalVertices = [];
        for (const face of faces) {
            finalVertices.push(...subdivide(face[0], face[1], face[2], detail));
        }

        const positions = new Float32Array(finalVertices.length * 3);
        for (let i = 0; i < finalVertices.length; i++) {
            positions[i * 3] = finalVertices[i].x;
            positions[i * 3 + 1] = finalVertices[i].y;
            positions[i * 3 + 2] = finalVertices[i].z;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const indices = [];
        for (let i = 0; i < positions.length / 3; i += 3) {
            indices.push(i, i + 1, i + 2);
        }
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }
}

export function registerShape(registry) {
    const shape = new Sierpinski();
    shape.register(registry);
}