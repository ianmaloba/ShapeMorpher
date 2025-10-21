// icosahedron.js - Platonic solid icosahedron
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape } from '../../modules/baseShape.js';

class Icosahedron extends BaseShape {
    constructor() {
        super('icosahedron', 'Icosahedron', 'PLATONIC SOLIDS');
        this.setDescription('A Platonic solid with 20 triangular faces, 30 edges, and 12 vertices. The most complex of the Platonic solids.')
            .setTags('platonic', 'triangular', 'complex', 'spherical')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        return new THREE.IcosahedronGeometry(1);
    }
}

export function registerShape(registry) {
    const shape = new Icosahedron();
    shape.register(registry);
}