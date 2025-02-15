import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// Utility function to create parametric geometry
function createParametricGeometry(func, slices, stacks) {
  return new THREE.ParametricGeometry(func, slices, stacks);
}

// Helper function for Sierpinski Pyramid
function createSierpinskiPyramid(detail) {
    const vertices = [
      new THREE.Vector3(0, 1, 0),   // Top
      new THREE.Vector3(-1, -1, 1), // Front left
      new THREE.Vector3(1, -1, 1),  // Front right
      new THREE.Vector3(0, -1, -1)  // Back
    ];
  
    function subdivide(v1, v2, v3, depth) {
      if (depth === 0) {
        return [v1, v2, v3];
      }
  
      const v12 = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const v23 = new THREE.Vector3().addVectors(v2, v3).multiplyScalar(0.5);
      const v31 = new THREE.Vector3().addVectors(v3, v1).multiplyScalar(0.5);
  
      return [
        ...subdivide(v1, v12, v31, depth - 1),
        ...subdivide(v12, v2, v23, depth - 1),
        ...subdivide(v31, v23, v3, depth - 1)
      ];
    }
  
    const faces = [
      [vertices[0], vertices[1], vertices[2]],
      [vertices[0], vertices[2], vertices[3]],
      [vertices[0], vertices[3], vertices[1]],
      [vertices[1], vertices[3], vertices[2]]
    ];
  
    let finalVertices = [];
    for (const face of faces) {
      finalVertices.push(...subdivide(face[0], face[1], face[2], detail));
    }
  
    const positions = new Float32Array(finalVertices.length * 3);
    for (let i = 0; i < finalVertices.length; i++) {
      positions[i * 3] = finalVertices[i].x;
      positions[i * 3 + 1] = finalVertices[i].y;
      positions[i * 3 + 2] = finalVertices[i].z;
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
    // Add indices for rendering faces
    const indices = [];
    for (let i = 0; i < positions.length / 3; i += 3) {
      indices.push(i, i + 1, i + 2);
    }
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  
    return geometry;
}
  
// Helper function for Menger Sponge
function createMengerSponge(detail) {
    const boxes = [];
    const size = Math.pow(3, detail);
    const unit = 1 / size;
  
    function addBox(x, y, z, scale) {
      const box = new THREE.BoxGeometry(scale, scale, scale);
      box.translate(
        (x + 0.5) * scale - 0.5,
        (y + 0.5) * scale - 0.5,
        (z + 0.5) * scale - 0.5
      );
      boxes.push(box);
    }
  
    function isRemoved(x, y, z) {
      while (x > 0 || y > 0 || z > 0) {
        if (x % 3 === 1 && y % 3 === 1 || 
            y % 3 === 1 && z % 3 === 1 || 
            z % 3 === 1 && x % 3 === 1) {
          return true;
        }
        x = Math.floor(x / 3);
        y = Math.floor(y / 3);
        z = Math.floor(z / 3);
      }
      return false;
    }
  
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          if (!isRemoved(x, y, z)) {
            addBox(x, y, z, unit);
          }
        }
      }
    }
  
    const finalGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(boxes, true);
    finalGeometry.computeVertexNormals();
  
    return finalGeometry;
}

// Main geometry creation function
export function createGeometry(shapeName, segments = 32) {
  const detail = Math.min(2, Math.floor(segments / 16));
  const PI = Math.PI;
  const TWO_PI = 2 * Math.PI;

  switch (shapeName) {
    case 'cube':
      return new THREE.BoxGeometry(2, 2, 2);
    case 'sphere':
      return new THREE.SphereGeometry(1, segments, segments);
    case 'torus':
      return new THREE.TorusGeometry(1, 0.4, segments, segments);
    case 'cylinder':
      return new THREE.CylinderGeometry(1, 1, 2, segments);
    case 'cone':
      return new THREE.ConeGeometry(1, 2, segments);
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(1);
    case 'octahedron':
      return new THREE.OctahedronGeometry(1);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(1);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(1);
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(1, 0.4, segments, segments);
    case 'steinmetzSolid':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        target.x = Math.cos(u) * Math.sqrt(1 - v * v);
        target.y = Math.sin(u) * Math.sqrt(1 - v * v);
        target.z = v;
      }, segments, segments);
    case 'mobius':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        const radius = 1 + v * 0.5 * Math.cos(u * 0.5);
        target.x = radius * Math.cos(u);
        target.y = radius * Math.sin(u);
        target.z = v * 0.5 * Math.sin(u * 0.5);
      }, segments, segments);
    case 'kleinBottle':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;
        const r = 4 * (1 - Math.cos(u) / 2);
        target.x = Math.cos(u) * (6 + r * Math.cos(v));
        target.y = Math.sin(u) * (6 + r * Math.cos(v));
        target.z = r * Math.sin(v);
      }, segments, segments);
    case 'trefoilKnot':
      return new THREE.TorusKnotGeometry(1, 0.4, segments, segments, 2, 3);
    case 'figureBight':
      return new THREE.TorusKnotGeometry(1, 0.4, segments, segments, 4, 5);
    case 'triangularPrism':
      return new THREE.CylinderGeometry(1, 1, 2, 3);
    case 'pentagonalPrism':
      return new THREE.CylinderGeometry(1, 1, 2, 5);
    case 'hexagonalPrism':
      return new THREE.CylinderGeometry(1, 1, 2, 6);
    case 'star':
      return new THREE.IcosahedronGeometry(1, 1);
    case 'gyroid':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;
        target.x = Math.sin(u) * Math.cos(v);
        target.y = Math.sin(v) * Math.cos(u);
        target.z = Math.sin(u + v);
      }, segments, segments);
    case 'horn':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        target.x = v * Math.cos(u);
        target.y = v * Math.sin(u);
        target.z = v;
      }, segments, segments);
    case 'shell':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        const radius = 1 + v * 0.5;
        target.x = radius * Math.cos(u);
        target.y = radius * Math.sin(u);
        target.z = v;
      }, segments, segments);
    case 'helix':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= 2;
        target.x = Math.cos(u);
        target.y = Math.sin(u);
        target.z = v;
      }, segments, segments);
    case 'wave':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= 2;
        target.x = u;
        target.y = v;
        target.z = Math.sin(u * v);
      }, segments, segments);
    case 'twist':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= 2;
        target.x = Math.cos(u) * (1 + v);
        target.y = Math.sin(u) * (1 + v);
        target.z = u;
      }, segments, segments);
    case 'catenoid':
      return createParametricGeometry((u, v, target) => {
        u = u * 2 - 1;
        v *= TWO_PI;
        target.x = Math.cosh(u) * Math.cos(v);
        target.y = Math.cosh(u) * Math.sin(v);
        target.z = u;
      }, segments, segments);
    case 'helicoid':
      return createParametricGeometry((u, v, target) => {
        u = u * 2 - 1;
        v *= TWO_PI;
        target.x = u * Math.cos(v);
        target.y = u * Math.sin(v);
        target.z = v;
      }, segments, segments);
    case 'boySurface':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;
        const x = Math.sin(u) * Math.cos(v);
        const y = Math.sin(u) * Math.sin(v);
        const z = Math.cos(u);
        target.x = x * z;
        target.y = y * z;
        target.z = z * z;
      }, segments, segments);
    case 'romanSurface':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        target.x = Math.sin(u) * Math.sin(2 * v);
        target.y = Math.sin(2 * u) * Math.cos(v);
        target.z = Math.cos(u) * Math.sin(2 * v);
      }, segments, segments);
    case 'crossCap':
      return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v = v * 2 - 1;
        target.x = Math.sin(u) * Math.sin(2 * v);
        target.y = Math.cos(u) * Math.sin(2 * v);
        target.z = Math.cos(2 * v);
      }, segments, segments);
    case 'sierpinski':
      return createSierpinskiPyramid(detail);
    case 'mengerSponge':
      return createMengerSponge(detail);
    case 'fibonacci':
      return createParametricGeometry((u, v, target) => {
        const phi = (1 + Math.sqrt(5)) / 2;
        const angle = u * TWO_PI * phi;
        const radius = Math.sqrt(u);
        target.x = radius * Math.cos(angle);
        target.y = radius * Math.sin(angle);
        target.z = v * 2 - 1;
      }, segments, segments);
    case 'superellipsoid':
      return createParametricGeometry((u, v, target) => {
        u = u * TWO_PI - PI;
        v = v * TWO_PI - PI;
        const a = Math.cos(v);
        const b = Math.sin(v);
        const c = Math.cos(u);
        const d = Math.sin(u);
        target.x = a * Math.sign(c) * Math.pow(Math.abs(c), 0.6);
        target.y = b * Math.sign(c) * Math.pow(Math.abs(c), 0.6);
        target.z = d * Math.sign(d) * Math.pow(Math.abs(d), 0.6);
      }, segments, segments);
    case 'hyperboloid':
      return createParametricGeometry((u, v, target) => {
        u = (u - 0.5) * 2;
        v *= TWO_PI;
        target.x = Math.sqrt(1 + u * u) * Math.cos(v);
        target.y = Math.sqrt(1 + u * u) * Math.sin(v);
        target.z = u;
      }, segments, segments);
    default:
      return new THREE.BoxGeometry(2, 2, 2);
  }
}
