// figureBight.js - Mathematical figure-8 knot
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, ShapeUtils } from '../../modules/baseShape.js';

class FigureBight extends BaseShape {
    constructor() {
        super('figureBight', 'Figure-8 Knot', 'MATHEMATICAL SHAPES');
        this.setDescription('The figure-eight knot is a unique knot with four crossings. It has the remarkable property of being amphichiral - identical to its mirror image.')
            .setTags('mathematical', 'knot', 'topology', 'figure-8', 'amphichiral')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return new THREE.TorusKnotGeometry(1, 0.4, segments, Math.min(segments, 16), 4, 5);
    }
}

export function registerShape(registry) {
    const shape = new FigureBight();
    shape.register(registry);
}