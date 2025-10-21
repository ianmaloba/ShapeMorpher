// dodecahedron.js - Platonic solid dodecahedron
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class Dodecahedron extends BaseShape {
    constructor() {
        super('dodecahedron', 'Dodecahedron', 'PLATONIC SOLIDS');
        this.setDescription('A Platonic solid with 12 pentagonal faces, 30 edges, and 20 vertices. Each vertex is shared by three pentagons.')
            .setTags('platonic', 'pentagonal', 'complex', 'golden ratio')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        return new THREE.DodecahedronGeometry(1);
    }
}

export function registerShape(registry) {
    const shape = new Dodecahedron();
    shape.register(registry);
}