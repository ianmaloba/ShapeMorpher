// helix.js - Artistic double helix shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Helix extends BaseShape {
    constructor() {
        super('helix', 'Double Helix', 'ARTISTIC SHAPES');
        this.setDescription('A double helix structure similar to DNA. This shape demonstrates how two helical curves can intertwine to create complex but elegant forms.')
            .setTags('artistic', 'helix', 'DNA', 'double', 'spiral', 'biological', 'intertwined')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= PI * 4;
            v = v * 2 - 1;

            const radius = 0.3;
            const coil = 1.0;

            target.x = Math.cos(u) + radius * Math.cos(u) * Math.cos(u * coil);
            target.y = Math.sin(u) + radius * Math.sin(u) * Math.cos(u * coil);
            target.z = v * 2 + radius * Math.sin(u * coil);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Helix();
    shape.register(registry);
}