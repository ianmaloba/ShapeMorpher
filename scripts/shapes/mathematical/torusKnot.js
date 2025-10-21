// torusKnot.js - Mathematical torus knot shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class TorusKnot extends BaseShape {
    constructor() {
        super('torusKnot', 'Torus Knot', 'MATHEMATICAL SHAPES');
        this.setDescription('A torus knot is a special kind of knot that lies on the surface of a torus. This creates complex interwoven patterns with beautiful mathematical properties.')
            .setTags('mathematical', 'knot', 'parametric', 'complex', 'topology')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return new THREE.TorusKnotGeometry(1, 0.4, segments, Math.min(segments, 16));
    }
}

export function registerShape(registry) {
    const shape = new TorusKnot();
    shape.register(registry);
}