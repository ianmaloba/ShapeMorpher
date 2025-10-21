// crossCap.js - Advanced mathematical cross-cap surface
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class CrossCap extends BaseShape {
    constructor() {
        super('crossCap', 'Cross-Cap', 'ADVANCED MATHEMATICAL');
        this.setDescription('A cross-cap is a non-orientable surface that is topologically equivalent to a Möbius strip with a disk attached. It demonstrates how surfaces can have self-intersections.')
            .setTags('advanced', 'mathematical', 'non-orientable', 'cross-cap', 'self-intersection', 'topology')
            .setDifficulty(4);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= PI;
            v *= TWO_PI;

            target.x = Math.sin(u) * Math.sin(v);
            target.y = Math.sin(u) * Math.cos(v);
            target.z = Math.cos(u) * Math.sin(2 * v) / 2;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new CrossCap();
    shape.register(registry);
}