// hyperboloid.js - Complex hyperboloid shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Hyperboloid extends BaseShape {
    constructor() {
        super('hyperboloid', 'Hyperboloid', 'FRACTALS AND COMPLEX');
        this.setDescription('A hyperboloid is a quadric surface that can take two forms: one sheet (saddle-like) or two sheets. This creates fascinating curved surfaces with ruled line properties.')
            .setTags('complex', 'hyperboloid', 'quadric', 'saddle', 'ruled surface', 'curved')
            .setDifficulty(4);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u = (u - 0.5) * 2;
            v *= TWO_PI;

            const a = 0.5; // Parameter for hyperboloid type

            target.x = Math.sqrt(1 + u * u) * Math.cos(v);
            target.y = Math.sqrt(1 + u * u) * Math.sin(v);
            target.z = a * u;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Hyperboloid();
    shape.register(registry);
}