// horn.js - Artistic spiral horn shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Horn extends BaseShape {
    constructor() {
        super('horn', 'Spiral Horn', 'ARTISTIC SHAPES');
        this.setDescription('A spiral horn shape that mimics the natural growth patterns found in shells, horns, and other organic structures. The shape tapers and spirals outward.')
            .setTags('artistic', 'spiral', 'horn', 'organic', 'natural', 'tapering')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= TWO_PI;
            v = v * 2 - 1;
            const scale = Math.pow(1 - v, 0.8) * 0.6 + 0.4;
            target.x = scale * Math.cos(u + 6 * v);
            target.y = scale * Math.sin(u + 6 * v);
            target.z = v;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Horn();
    shape.register(registry);
}