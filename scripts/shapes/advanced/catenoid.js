// catenoid.js - Advanced mathematical catenoid surface
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Catenoid extends BaseShape {
    constructor() {
        super('catenoid', 'Catenoid', 'ADVANCED MATHEMATICAL');
        this.setDescription('A catenoid is a minimal surface formed by rotating a catenary curve around its directrix. It has zero mean curvature and is the only minimal surface of revolution.')
            .setTags('advanced', 'mathematical', 'minimal surface', 'catenary', 'revolution', 'zero curvature')
            .setDifficulty(4);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u = u * 2 - 1;
            v *= TWO_PI;

            const c = Math.cosh(u);
            target.x = c * Math.cos(v);
            target.y = c * Math.sin(v);
            target.z = u;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Catenoid();
    shape.register(registry);
}