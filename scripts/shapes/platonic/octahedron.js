// octahedron.js - Platonic solid octahedron
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class Octahedron extends BaseShape {
    constructor() {
        super('octahedron', 'Octahedron', 'PLATONIC SOLIDS');
        this.setDescription('A Platonic solid with 8 triangular faces, 12 edges, and 6 vertices. It can be viewed as two square pyramids joined at their bases.')
            .setTags('platonic', 'triangular', 'dual', 'symmetric')
            .setDifficulty(2);
    }

    createGeometry(segments = 32) {
        return new THREE.OctahedronGeometry(1);
    }
}

export function registerShape(registry) {
    const shape = new Octahedron();
    shape.register(registry);
}