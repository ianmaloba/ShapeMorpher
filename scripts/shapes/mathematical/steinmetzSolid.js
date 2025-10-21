// steinmetzSolid.js - Mathematical Steinmetz solid
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class SteinmetzSolid extends BaseShape {
    constructor() {
        super('steinmetzSolid', 'Steinmetz Solid', 'MATHEMATICAL SHAPES');
        this.setDescription('A Steinmetz solid is the intersection of two or more cylinders. This creates a solid with interesting geometric properties and curved surfaces.')
            .setTags('mathematical', 'intersection', 'cylindrical', 'parametric')
            .setDifficulty(4);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u *= TWO_PI;
            v = v * 2 - 1;
            target.x = Math.cos(u) * Math.sqrt(1 - v * v);
            target.y = Math.sin(u) * Math.sqrt(1 - v * v);
            target.z = v;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new SteinmetzSolid();
    shape.register(registry);
}