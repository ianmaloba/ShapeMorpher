// helicoid.js - Advanced mathematical helicoid surface
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Helicoid extends BaseShape {
    constructor() {
        super('helicoid', 'Helicoid', 'ADVANCED MATHEMATICAL');
        this.setDescription('The helicoid is a minimal surface that can be described as a surface swept by a line rotating about and translating along a fixed axis. It is locally isometric to the catenoid.')
            .setTags('advanced', 'mathematical', 'minimal surface', 'helical', 'twisted', 'isometric')
            .setDifficulty(4);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u = u * 2 - 1;
            v *= TWO_PI;

            target.x = u * Math.cos(v);
            target.y = u * Math.sin(v);
            target.z = v / PI;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Helicoid();
    shape.register(registry);
}