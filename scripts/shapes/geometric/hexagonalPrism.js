// hexagonalPrism.js - Geometric hexagonal prism
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class HexagonalPrism extends BaseShape {
    constructor() {
        super('hexagonalPrism', 'Hexagonal Prism', 'GEOMETRIC VARIATIONS');
        this.setDescription('A prism with a hexagonal base. It has 8 faces (2 hexagonal and 6 rectangular), 18 edges, and 12 vertices.')
            .setTags('geometric', 'prism', 'hexagonal', 'polyhedron')
            .setDifficulty(2);
    }

    createGeometry(segments = 32) {
        return new THREE.CylinderGeometry(1, 1, 2, 6);
    }
}

export function registerShape(registry) {
    const shape = new HexagonalPrism();
    shape.register(registry);
}