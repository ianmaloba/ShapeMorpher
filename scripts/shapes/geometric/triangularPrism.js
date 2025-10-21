// triangularPrism.js - Geometric triangular prism
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class TriangularPrism extends BaseShape {
    constructor() {
        super('triangularPrism', 'Triangular Prism', 'GEOMETRIC VARIATIONS');
        this.setDescription('A prism with a triangular base. It has 5 faces (2 triangular and 3 rectangular), 9 edges, and 6 vertices.')
            .setTags('geometric', 'prism', 'triangular', 'polyhedron')
            .setDifficulty(2);
    }

    createGeometry(segments = 32) {
        return new THREE.CylinderGeometry(1, 1, 2, 3);
    }
}

export function registerShape(registry) {
    const shape = new TriangularPrism();
    shape.register(registry);
}