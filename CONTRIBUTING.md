# Contributing to ShapeMorpher

Thank you for your interest in contributing to ShapeMorpher! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Adding New Shapes](#adding-new-shapes)
3. [Shape File Template](#shape-file-template)
4. [Shape Categories](#shape-categories)
5. [Code Style Guidelines](#code-style-guidelines)
6. [Testing Your Shapes](#testing-your-shapes)
7. [Submitting Contributions](#submitting-contributions)
8. [Development Setup](#development-setup)

## Getting Started

Before contributing, please:

1. Fork the repository
2. Create a new branch for your feature
3. Review the existing code structure
4. Test your changes thoroughly
5. Submit a pull request

## Adding New Shapes

ShapeMorpher uses a modular shape system where each shape is contained in its own file with comprehensive metadata for educational and technical purposes. This makes it easy to add new shapes without modifying existing code.

### Step-by-Step Process

1. Choose the appropriate category for your shape
2. Create a new JavaScript file in the corresponding directory
3. Implement your shape using the enhanced metadata template
4. Include comprehensive educational and mathematical information
5. Test your shape in the application
6. Submit a pull request

### Directory Structure

```
scripts/shapes/
├── basic/           # Simple geometric shapes
├── platonic/        # Platonic solids
├── mathematical/    # Mathematical surfaces and curves
├── geometric/       # Geometric variations and prisms
├── artistic/        # Artistic and organic shapes
├── advanced/        # Advanced mathematical surfaces
└── fractals/        # Fractals and complex shapes
```

## Shape File Template

Use this template when creating new shapes:

```javascript
// shapeName.js - Brief description of the shape
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { BaseShape, PI, TWO_PI, createParametricGeometry, ShapeUtils } from '../../modules/baseShape.js';

class YourShapeName extends BaseShape {
    constructor() {
        super('shapeId', 'Display Name', 'CATEGORY NAME');

        // Basic information (required)
        this.setDescription('Detailed description of the shape, its mathematical properties, and significance.')
            .setTags('tag1', 'tag2', 'tag3', 'mathematical', 'geometric')
            .setDifficulty(1); // 1-5 scale

        // Geometric properties (optional but recommended)
        this.setProperties({
            faces: 6,           // Number of faces (for polyhedra)
            vertices: 8,        // Number of vertices
            edges: 12,          // Number of edges
            volume: 8,          // Volume (if calculable)
            surfaceArea: 24,    // Surface area (if calculable)
            eulerCharacteristic: 2  // V - E + F (for polyhedra)
        });

        // Mathematical information (optional)
        this.setMathematical({
            equation: 'x² + y² + z² = r²',  // Mathematical equation
            parametricDomain: { u: [0, 2*Math.PI], v: [0, Math.PI] },
            symmetryGroup: 'O_h',    // Symmetry group notation
            classification: 'Regular polyhedron',
            discoverer: 'Ancient Greeks',
            yearDiscovered: -500
        });

        // Educational metadata (optional)
        this.setEducational({
            level: 'beginner',   // beginner, intermediate, advanced, expert
            topics: ['geometry', 'polyhedra', 'symmetry'],
            applications: ['architecture', 'crystallography', 'art'],
            relatedShapes: ['tetrahedron', 'octahedron'],
            interactiveFeatures: ['rotation', 'scaling', 'material-change']
        });

        // Technical specifications (optional)
        this.setTechnical({
            renderComplexity: 'low',    // low, medium, high
            recommendedSegments: { min: 4, max: 32, default: 16 },
            performanceNotes: 'Very efficient, uses built-in Three.js geometry',
            limitations: ['None']
        });

        // Visual preferences (optional)
        this.setVisual({
            defaultMaterial: 'standard',
            recommendedColors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
            bestViewingAngles: ['isometric', 'front'],
            animationSuggestions: ['slow-rotation', 'color-cycling']
        });

        // Metadata (optional)
        this.setMetadata({
            version: '1.0.0',
            author: 'Your Name',
            status: 'stable'    // experimental, beta, stable, deprecated
        });
    }

    createGeometry(segments = 32) {
        segments = ShapeUtils.clampSegments(segments);

        // For Three.js built-in geometries:
        return new THREE.BoxGeometry(2, 2, 2);

        // For parametric geometries:
        return createParametricGeometry((u, v, target) => {
            // u and v are parameters from 0 to 1
            // Convert to your desired range
            u *= TWO_PI; // 0 to 2π
            v = v * 2 - 1; // -1 to 1

            // Set target coordinates
            target.x = Math.cos(u);
            target.y = Math.sin(u);
            target.z = v;
        }, segments, segments);
    }
}

export function registerShape(registry) {
    const shape = new YourShapeName();
    shape.register(registry);
}
```

### Enhanced Metadata Fields

#### Geometric Properties
- **faces/vertices/edges**: Exact counts for polyhedra
- **volume/surfaceArea**: Mathematical values when calculable
- **eulerCharacteristic**: Topological invariant (V - E + F)

#### Mathematical Information
- **equation**: Mathematical formula or definition
- **parametricDomain**: Valid parameter ranges for u,v
- **symmetryGroup**: Symmetry group notation
- **classification**: Mathematical classification
- **discoverer/yearDiscovered**: Historical information

#### Educational Metadata
- **level**: Appropriate educational level
- **topics**: Related mathematical topics
- **applications**: Real-world applications
- **relatedShapes**: Similar or related shapes
- **interactiveFeatures**: Supported interactions

#### Technical Specifications
- **renderComplexity**: Performance impact
- **recommendedSegments**: Optimal segment ranges
- **performanceNotes**: Performance characteristics
- **limitations**: Known limitations or issues

#### Visual Preferences
- **defaultMaterial**: Recommended material type
- **recommendedColors**: Aesthetically pleasing colors
- **bestViewingAngles**: Optimal camera positions
- **animationSuggestions**: Recommended animations

#### Metadata
- **version**: Shape implementation version
- **author**: Shape contributor
- **status**: Development status
- **dateAdded/lastModified**: Timestamps

### Template Guidelines

1. **File Naming**: Use camelCase (e.g., `kleinBottle.js`, `torusKnot.js`)
2. **Shape ID**: Use camelCase, should match filename
3. **Display Name**: Human-readable name with proper capitalization
4. **Category**: Must match one of the existing categories (see below)
5. **Description**: Detailed, educational description
6. **Tags**: Descriptive keywords for search functionality
7. **Difficulty**: 1 (simple) to 5 (very complex)

## Shape Categories

### BASIC SHAPES
Simple geometric primitives (cubes, spheres, cylinders, etc.)

### PLATONIC SOLIDS
The five regular polyhedra (tetrahedron, cube, octahedron, dodecahedron, icosahedron)

### MATHEMATICAL SHAPES
Mathematical surfaces, knots, and topological objects

### GEOMETRIC VARIATIONS
Prisms, variations of basic shapes, and geometric constructions

### ARTISTIC SHAPES
Organic forms, natural patterns, and aesthetically interesting shapes

### ADVANCED MATHEMATICAL
Complex mathematical surfaces requiring advanced mathematics

### FRACTALS AND COMPLEX
Fractals, recursive shapes, and complex mathematical constructions

## Code Style Guidelines

### General Rules

1. Use descriptive variable names
2. Include clear comments for complex mathematics
3. Follow existing code formatting
4. Use ES6+ features consistently
5. Handle edge cases appropriately

### Mathematical Implementation

1. Use the provided constants (PI, TWO_PI)
2. Normalize parameters appropriately (u, v typically 0-1)
3. Use `ShapeUtils.clampSegments()` for segment validation
4. Ensure proper scaling (shapes should fit roughly in a 2x2x2 cube)

### Error Handling

```javascript
createGeometry(segments = 32) {
    segments = ShapeUtils.clampSegments(segments);

    try {
        // Your geometry creation code
        return geometry;
    } catch (error) {
        console.error(`Error creating ${this.name}:`, error);
        return ShapeUtils.createWarningGeometry();
    }
}
```

## Testing Your Shapes

### Local Testing

1. Add your shape file to the appropriate directory
2. Open the application in a web browser
3. Verify your shape appears in the dropdown
4. Test with different segment counts
5. Verify morphing animations work correctly
6. Check shape description displays properly

### Validation Checklist

- [ ] Shape appears in the correct category
- [ ] Shape renders without errors
- [ ] Description is informative and accurate
- [ ] Enhanced metadata is complete and accurate
- [ ] Mathematical information includes equations when applicable
- [ ] Educational content provides appropriate context
- [ ] Fun facts are engaging and factual
- [ ] Technical specifications are documented
- [ ] Visual preferences include color recommendations
- [ ] Tags are relevant and searchable
- [ ] Morphing transitions work smoothly
- [ ] Performance is acceptable at high segment counts
- [ ] Shape scales appropriately

## Submitting Contributions

### Pull Request Process

1. Create a descriptive branch name (e.g., `feature/add-torus-knot`)
2. Make your changes following the guidelines
3. Test thoroughly
4. Write a clear commit message
5. Submit a pull request with:
   - Clear description of the shape added
   - Mathematical background if applicable
   - Any special implementation notes

### Commit Message Format

```
Add [Shape Name] to [Category] shapes

- Implements [brief description]
- Adds [any special features]
- Includes comprehensive documentation
```

### Pull Request Template

```markdown
## Description
Brief description of the shape and its significance.

## Type of Change
- [ ] New shape addition
- [ ] Bug fix
- [ ] Enhancement
- [ ] Documentation update

## Shape Details
- **Name**: [Shape Name]
- **Category**: [Category]
- **Difficulty**: [1-5]
- **Mathematical Background**: [Brief explanation]

## Testing
- [ ] Shape renders correctly
- [ ] Morphing works properly
- [ ] Description is accurate
- [ ] Performance is acceptable

## Screenshots
[Add screenshots if helpful]
```

## Development Setup

### Prerequisites

- Modern web browser with ES6+ support
- Text editor or IDE
- Basic understanding of JavaScript and Three.js
- Mathematical background helpful for complex shapes

### Project Structure

```
ShapeMorpher/
├── index.html              # Main application page
├── scripts/
│   ├── app.js              # Main application logic
│   ├── modules/            # Core modules
│   └── shapes/             # Shape implementations
├── styles/                 # CSS styling
└── README.md              # Project documentation
```

### Mathematical Resources

For implementing mathematical shapes, consider these resources:

1. **Parametric Equations**: Understanding u,v parameter mapping
2. **Three.js Documentation**: Geometry creation methods
3. **Mathematical References**: Wolfram MathWorld, Wikipedia
4. **Visualization Tools**: Desmos, GeoGebra for testing equations

## Shape Implementation Examples

### Simple Parametric Shape

```javascript
// Creates a simple torus
createGeometry(segments = 32) {
    segments = ShapeUtils.clampSegments(segments);
    return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;

        const R = 1.0; // Major radius
        const r = 0.4; // Minor radius

        target.x = (R + r * Math.cos(v)) * Math.cos(u);
        target.y = (R + r * Math.cos(v)) * Math.sin(u);
        target.z = r * Math.sin(v);
    }, segments, segments);
}
```

### Complex Mathematical Surface

```javascript
// Creates a Klein bottle (4D surface projected to 3D)
createGeometry(segments = 32) {
    segments = ShapeUtils.clampSegments(segments);
    return createParametricGeometry((u, v, target) => {
        u *= TWO_PI;
        v *= TWO_PI;

        const r = 4 * (1 - Math.cos(u) / 2);

        if (u < PI) {
            target.x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(u) * Math.cos(v);
            target.y = 16 * Math.sin(u) + r * Math.sin(u) * Math.cos(v);
        } else {
            target.x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(v + PI);
            target.y = 16 * Math.sin(u);
        }
        target.z = r * Math.sin(v);
    }, segments, segments);
}
```

## Questions and Support

If you have questions about contributing:

1. Check existing issues and documentation
2. Create a new issue with the "question" label
3. Provide as much context as possible
4. Include relevant mathematical background

## Future Extensibility Considerations

The enhanced metadata system is designed to support future platform expansion:

### Educational Features
- **Interactive tutorials** using `educational.level` and `educational.topics`
- **Curriculum integration** via `educational.applications`
- **Progressive learning paths** using `difficulty` and `relatedShapes`

### Advanced Visualization
- **Performance optimization** using `technical.renderComplexity`
- **Quality settings** via `technical.recommendedSegments`
- **Visual presets** from `visual.defaultMaterial` and `visual.recommendedColors`

### Search and Discovery
- **Advanced filtering** by mathematical properties, applications, difficulty
- **Recommendation systems** using `relatedShapes` and similarity metrics
- **Educational pathways** connecting shapes by topics and complexity

### Content Management
- **Version control** tracking shape updates and improvements
- **Quality assurance** using status flags and peer review
- **Attribution** maintaining contributor credits and licenses

### API Integration
- **Mathematical databases** linking to external resources via equations
- **Educational platforms** using standardized metadata formats
- **Research applications** providing computational geometry data

### Data Export
- **Shape catalogs** generating comprehensive shape databases
- **Educational materials** creating automated documentation
- **Research datasets** exporting mathematical and geometric properties

This comprehensive metadata ensures that shapes remain valuable and discoverable as the platform grows from dozens to hundreds or thousands of shapes.

## License

By contributing to ShapeMorpher, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ShapeMorpher and helping make mathematical visualization more accessible!