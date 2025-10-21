// fibonacci.js - Fractal Fibonacci spiral
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Fibonacci extends BaseShape {
    constructor() {
        super('fibonacci', 'Fibonacci Spiral', 'FRACTALS AND COMPLEX');
        this.setDescription('The Fibonacci spiral is based on the golden ratio and appears frequently in nature. This 3D version creates a spiraling surface following the Fibonacci sequence.')
            .setTags('fractal', 'fibonacci', 'spiral', 'golden ratio', 'nature', 'sequence')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
            const angle = u * TWO_PI * phi;
            const radius = Math.sqrt(u);

            target.x = radius * Math.cos(angle);
            target.y = radius * Math.sin(angle);
            target.z = v * 2 - 1;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Fibonacci();
    shape.register(registry);
}