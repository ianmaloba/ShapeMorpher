// trefoilKnot.js - Mathematical trefoil knot
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class TrefoilKnot extends BaseShape {
    constructor() {
        super('trefoilKnot', 'Trefoil Knot', 'MATHEMATICAL SHAPES');
        this.setDescription('The trefoil knot is the simplest non-trivial knot. It has three crossings and cannot be untangled without cutting, making it a fundamental object in knot theory.')
            .setTags('mathematical', 'knot', 'topology', 'trefoil', 'simple')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return new THREE.TorusKnotGeometry(1, 0.4, segments, Math.min(segments, 16), 2, 3);
    }
}

export function registerShape(registry) {
    const shape = new TrefoilKnot();
    shape.register(registry);
}