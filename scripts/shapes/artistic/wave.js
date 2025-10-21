// wave.js - Artistic wave surface shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Wave extends BaseShape {
    constructor() {
        super('wave', 'Wave Surface', 'ARTISTIC SHAPES');
        this.setDescription('A wave surface that creates rippling patterns similar to water waves. The surface undulates in both directions creating complex interference patterns.')
            .setTags('artistic', 'wave', 'surface', 'ripple', 'water', 'interference', 'undulating')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u = u * 2 - 1;
            v = v * 2 - 1;

            const freq = 3;
            const amp = 0.2;

            target.x = u;
            target.y = v;
            target.z = amp * Math.sin(freq * PI * u) * Math.sin(freq * PI * v);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Wave();
    shape.register(registry);
}