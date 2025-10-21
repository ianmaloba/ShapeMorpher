// pentagonalPrism.js - Geometric pentagonal prism
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class PentagonalPrism extends BaseShape {
    constructor() {
        super('pentagonalPrism', 'Pentagonal Prism', 'GEOMETRIC VARIATIONS');
        this.setDescription('A prism with a pentagonal base. It has 7 faces (2 pentagonal and 5 rectangular), 15 edges, and 10 vertices.')
            .setTags('geometric', 'prism', 'pentagonal', 'polyhedron')
            .setDifficulty(2);
    }

    createGeometry(segments = 32) {
        return new THREE.CylinderGeometry(1, 1, 2, 5);
    }
}

export function registerShape(registry) {
    const shape = new PentagonalPrism();
    shape.register(registry);
}