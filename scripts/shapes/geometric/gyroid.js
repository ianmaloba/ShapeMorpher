// gyroid.js - Geometric gyroid surface
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Gyroid extends BaseShape {
    constructor() {
        super('gyroid', 'Gyroid Surface', 'GEOMETRIC VARIATIONS');
        this.setDescription('A gyroid is an infinitely connected triply periodic minimal surface. It has fascinating properties including no straight lines and constant mean curvature of zero.')
            .setTags('geometric', 'minimal surface', 'periodic', 'triply connected', 'curved')
            .setDifficulty(4);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= TWO_PI;
            v *= TWO_PI;
            target.x = Math.sin(u) * Math.cos(v);
            target.y = Math.sin(v) * Math.cos(u);
            target.z = Math.sin(u + v);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Gyroid();
    shape.register(registry);
}