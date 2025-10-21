# 3D Shape Morpher

A comprehensive 3D geometry visualization tool that lets you explore and manipulate various 3D shapes in real-time with rich educational content and mathematical information.

* URL: [3dshapemorpher.ianmaloba.com](https://3dshapemorpher.ianmaloba.com)

## Features

* **Shape Selection**: basic forms, platonic solids, mathematical surfaces, fractals, and more.
* **Enhanced Metadata**: Comprehensive mathematical information, educational content, and fun facts for each shape.
* **Equations Display**: Mathematical equations and parametric forms prominently displayed.
* **Educational Content**: Difficulty levels, topics, applications, and engaging learning materials.
* **Customization**: Adjust scale, segments, materials, and colors.
* **Animations**: Control rotation speed and direction.
* **Material Effects**: Choose from standard, physical, toon, gradient, and wireframe materials.
* **Modular Architecture**: Easy extensibility with individual shape files and dynamic loading.

## Shapes

| Category                 | Shape                  |
|--------------------------|------------------------|
| **Basic Shapes**         | Cube, Sphere, Torus (Donut), Cylinder, Cone |
| **Platonic Solids**      | Tetrahedron, Octahedron, Dodecahedron, Icosahedron |
| **Mathematical Shapes**  | Torus Knot, Steinmetz Solid, Möbius Strip, Klein Bottle, Trefoil Knot, Figure-8 Knot |
| **Geometric Variations** | Triangular Prism, Pentagonal Prism, Hexagonal Prism, Star Polyhedron, Gyroid Surface |
| **Artistic Shapes**      | Spiral Horn, Nautilus Shell, Double Helix, Wave Surface, Twisted Cube |
| **Advanced Mathematical**| Catenoid, Helicoid, Boy's Surface, Roman Surface, Cross-Cap |
| **Fractals and Complex** | Sierpinski Pyramid, Fibonacci Spiral, Superellipsoid, Hyperboloid |

## Getting Started

### Prerequisites

To run this project, you'll need:

* A modern web browser (Chrome, Firefox, Edge, etc.)
* Python 3.6+ (for development server)
* Node.js 14+ and npm (for development tools and build process)
* An internet connection for loading the Three.js library

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ianmaloba/ShapeMorpher.git
   cd ShapeMorpher
   ```

2. **For immediate use**: Open `index.html` directly in your browser

3. **For development**: Set up the development environment:
   ```bash
   npm install
   npm run dev
   ```

### Development Setup

#### Installation

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Install recommended VS Code extensions (optional):
   ```bash
   code --install-extension esbenp.prettier-vscode
   code --install-extension dbaeumer.vscode-eslint
   code --install-extension ritwickdey.liveserver
   ```

#### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Build optimized production version |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Fix automatically correctable linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is properly formatted |
| `npm run validate` | Run linting and format checks |
| `npm run docs` | Generate JSDoc documentation |
| `npm run clean` | Clean build artifacts and dependencies |

#### Development Server

The project includes a custom Python development server with enhanced features:

```bash
# Start with default settings (port 8080)
python scripts/dev-server.py

# Start on custom port
python scripts/dev-server.py --port 3000

# Serve specific directory
python scripts/dev-server.py --directory ./dist --port 3000
```

Features:
* CORS headers for development
* Enhanced logging with timestamps
* Automatic index.html detection
* Development-friendly caching headers

#### Build Process

Create an optimized production build:

```bash
npm run build
```

The build process:
* Minifies CSS and JavaScript files
* Combines stylesheets into a single file
* Copies and optimizes all assets
* Outputs to `dist/` directory

Test the production build:
```bash
cd dist
python -m http.server 3000
```

#### VS Code Integration

Open the project workspace:
```bash
code ShapeMorpher.code-workspace
```

Available VS Code tasks:
* **Start Dev Server**: Launch the development server
* **Build Project**: Create production build
* **Install Dependencies**: Run npm install

Access tasks via: `Ctrl+Shift+P` → "Tasks: Run Task"

#### Code Quality

The project uses ESLint and Prettier for consistent code quality:

* **ESLint**: Identifies potential issues and enforces coding standards
* **Prettier**: Ensures consistent code formatting
* **EditorConfig**: Maintains consistent editor settings across IDEs

Configuration files:
* `.eslintrc.json` - JavaScript linting rules
* `.prettierrc` - Code formatting preferences
* `.editorconfig` - Cross-editor consistency

#### Continuous Integration

Before committing changes:
1. Run `npm run validate` to check code quality
2. Fix any linting issues with `npm run lint:fix`
3. Format code with `npm run format`
4. Test the build with `npm run build`

#### Browser Support

* Chrome/Chromium 70+
* Firefox 65+
* Safari 12+
* Edge 79+

Modern ES2021 features are used throughout the codebase.

## Usage

1. **Shape Selection**: Choose a shape from the dropdown menu.
2. **Control Properties**:
    * Adjust scale using the **Scale** slider.
    * Modify segment detail using the **Segments** slider.
3. **Animation**:
    * Change rotation speed with the **Rotation Speed** slider.
    * Select rotation direction from the **Direction** dropdown.
4. **Material Customization**:
    * Select material type from the **Material Type** dropdown.
    * Adjust **Metalness** and **Roughness** sliders for reflective and matte effects.
    * Use the color pickers to set **Primary** and **Secondary** colors.
4. **Interface Controls**:
    * Change background color with the color picker.
    * Toggle between light and dark mode with the moon/sun icon.
    * Collapse or expand the control panel with the chevron icon.
    * Reset camera position or all settings using the control buttons.

### Example Code:

#### Generate a Sierpinski Pyramid
```javascript
const detail = 3; // Detail level: 3
const sierpinskiGeometry = createSierpinskiPyramid(detail);
const material = new THREE.MeshStandardMaterial({
  color: '#ff00ff',
  wireframe: true
});
const sierpinski = new THREE.Mesh(sierpinskiGeometry, material);
scene.add(sierpinski);

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

  // Generate geometry and return
  // ...
}
```


## Contributing

We welcome contributions to ShapeMorpher! Whether you want to add new shapes, improve existing functionality, or enhance documentation, your contributions are valuable.

### How to Contribute

1. **Adding New Shapes**: Follow our modular shape system to add new geometric forms
2. **Bug Fixes**: Help improve the stability and performance of the application
3. **Documentation**: Enhance explanations, add examples, or improve clarity
4. **Features**: Propose and implement new visualization capabilities

For detailed guidelines, please see our [Contributing Guide](CONTRIBUTING.md).

For a comprehensive roadmap of planned features and implementation status, see [Notes](notes.md).

### Quick Start for Shape Contributors

1. Choose an appropriate category for your shape
2. Create a new JavaScript file in the corresponding `scripts/shapes/` directory
3. Use the enhanced metadata template provided in the contributing guide
4. Include comprehensive mathematical and educational information
5. Test your shape and submit a pull request

## Project Structure
```plaintext
ShapeMorpher/
├── index.html                    # Main HTML file
├── package.json                  # Node.js dependencies and scripts
├── README.md                     # Project documentation
├── LICENSE                       # MIT license
├── notes.md                      # Project roadmap and feature tracking
├── CONTRIBUTING.md               # Contribution guidelines
├── .gitignore                    # Git ignore rules
├── .editorconfig                 # Editor configuration
├── .prettierrc                   # Code formatting rules
├── .eslintrc.json               # JavaScript linting configuration
├── ShapeMorpher.code-workspace  # VS Code workspace configuration
├── .vscode/                     # VS Code settings
│   ├── settings.json            # Editor preferences
│   ├── extensions.json          # Recommended extensions
│   └── launch.json              # Debug configurations
├── styles/
│   ├── main.css                 # Enhanced styles with search and metadata
│   └── style.css                # Base styles with theme support
├── scripts/
│   ├── app.js                   # Main application logic
│   ├── build.js                 # Production build script
│   ├── dev-server.py            # Development server with CORS
│   └── modules/
│       ├── baseShape.js         # Base class with comprehensive metadata
│       ├── shapeRegistry.js     # Dynamic shape loading and management
│       ├── scene.js             # Three.js scene setup
│       ├── shapes.js            # Shape system coordination
│       ├── materials.js         # Material creation and management
│       ├── ui.js                # UI utility functions
│       ├── searchComponent.js   # Real-time search and filtering
│       └── descriptions.js      # Fallback descriptions
│   └── shapes/                  # Individual shape files by category
│       ├── basic/               # Basic geometric shapes
│       ├── platonic/            # Platonic solids
│       ├── mathematical/        # Mathematical surfaces
│       ├── geometric/           # Geometric variations
│       ├── artistic/            # Artistic and organic forms
│       ├── advanced/            # Advanced mathematical surfaces
│       └── fractals/            # Fractals and complex shapes
└── dist/                        # Production build output (generated)
```
## Built With

### Core Technologies
* **Three.js** - 3D graphics library
* **HTML5/CSS3** - Modern web standards
* **JavaScript ES2021** - Modern JavaScript features
* **Font Awesome** - Icon library

### Development Tools
* **Node.js** - JavaScript runtime for development tools
* **ESLint** - JavaScript linting and code quality
* **Prettier** - Code formatting
* **Python** - Development server
* **VS Code** - Recommended development environment

### Build System
* Custom Node.js build scripts for minification and optimization
* CSS and JavaScript bundling
* Asset optimization and copying

## License

This project is licensed under the [MIT License](https://github.com/ianmaloba/ShapeMorpher/blob/main/LICENSE).

---

> _"Geometry is the archetype of the beauty of the world."_
> — Johannes Kepler
