// twist.js - Artistic twisted cube shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Twist extends BaseShape {
    constructor() {
        super('twist', 'Twisted Cube', 'ARTISTIC SHAPES');
        this.setDescription('A twisted surface that demonstrates how simple geometric forms can be transformed into complex artistic shapes through mathematical transformations.')
            .setTags('artistic', 'twist', 'cube', 'transformation', 'deformation', 'sculptural')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u = u * 2 - 1;
            v = v * 2 - 1;
            const w = 0.35;

            target.x = u * Math.cos(PI * v * w);
            target.y = u * Math.sin(PI * v * w);
            target.z = v;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Twist();
    shape.register(registry);
}