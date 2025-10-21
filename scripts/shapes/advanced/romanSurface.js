// romanSurface.js - Advanced mathematical Roman surface
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class RomanSurface extends BaseShape {
    constructor() {
        super('romanSurface', 'Roman Surface', 'ADVANCED MATHEMATICAL');
        this.setDescription('The Roman surface is a self-intersecting mapping of the real projective plane into three-dimensional space. It has four cusps and exhibits beautiful symmetry properties.')
            .setTags('advanced', 'mathematical', 'projective plane', 'self-intersecting', 'cusps', 'symmetry')
            .setDifficulty(5);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= TWO_PI;
            v *= PI;

            target.x = Math.sin(2 * u) * Math.sin(v) * Math.sin(v);
            target.y = Math.sin(u) * Math.cos(v) * Math.sin(v);
            target.z = Math.cos(u) * Math.sin(v);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new RomanSurface();
    shape.register(registry);
}