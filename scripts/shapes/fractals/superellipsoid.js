// superellipsoid.js - Complex superellipsoid shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class Superellipsoid extends BaseShape {
    constructor() {
        super('superellipsoid', 'Superellipsoid', 'FRACTALS AND COMPLEX');
        this.setDescription('A superellipsoid is a generalization of an ellipsoid with adjustable roundness parameters. It can range from cube-like to sphere-like shapes and everything in between.')
            .setTags('complex', 'superellipsoid', 'parametric', 'generalization', 'ellipsoid', 'roundness')
            .setDifficulty(3);
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);
        return createParametricGeometry((u, v, target) => {
            u = u * PI - PI/2;
            v *= TWO_PI;

            const n1 = 0.7; // Shape parameter
            const n2 = 0.4; // Shape parameter

            const cu = Math.cos(u);
            const su = Math.sin(u);
            const cv = Math.cos(v);
            const sv = Math.sin(v);

            const sgncu = cu >= 0 ? 1 : -1;
            const sgnsu = su >= 0 ? 1 : -1;
            const sgncv = cv >= 0 ? 1 : -1;
            const sgnsv = sv >= 0 ? 1 : -1;

            target.x = sgncu * Math.pow(Math.abs(cu), n1) * sgncv * Math.pow(Math.abs(cv), n2);
            target.y = sgncu * Math.pow(Math.abs(cu), n1) * sgnsv * Math.pow(Math.abs(sv), n2);
            target.z = sgnsu * Math.pow(Math.abs(su), n1);
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new Superellipsoid();
    shape.register(registry);
}