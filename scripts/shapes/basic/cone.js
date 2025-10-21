// cone.js - Basic cone shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class Cone extends BaseShape {
    constructor() {
        super('cone', 'Cone', 'BASIC SHAPES');
        this.setDescription('A cone with circular base tapering to a point - a common geometric solid with rotational symmetry.')
            .setTags('basic', 'point', 'apex', 'circular', 'tapered')
            .setDifficulty(1);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return new THREE.ConeGeometry(1, 2, segments);
    }
}

export function registerShape(registry) {
    const shape = new Cone();
    shape.register(registry);
}