// shapeRegistry.js - Dynamic shape registration and management system
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

class ShapeRegistry {
    constructor() {
        this.shapes = new Map();
        this.categories = new Map();
        this.loadedShapes = new Set();
    }

    // Register a shape with the registry
    registerShape(shapeData) {
        const { id, name, category, description, geometry, tags = [], difficulty = 1 } = shapeData;

        if (!id || !name || !category || !geometry) {
            console.error('Invalid shape data:', shapeData);
            return false;
        }

        // Store ALL the shape data including enhanced metadata
        const shape = {
            id,
            name,
            category,
            description: description || '',
            geometry,
            tags,
            difficulty,
            // Include all the enhanced metadata
            properties: shapeData.properties || {},
            mathematical: shapeData.mathematical || {},
            educational: shapeData.educational || {},
            technical: shapeData.technical || {},
            visual: shapeData.visual || {},
            metadata: shapeData.metadata || {},
            searchTerms: this.generateSearchTerms(name, category, tags, description)
        };

        this.shapes.set(id, shape);

        // Add to category
        if (!this.categories.has(category)) {
            this.categories.set(category, []);
        }
        this.categories.get(category).push(shape);

        console.log(`Registered shape: ${name} (${id}) with enhanced metadata`);
        return true;
    }

    // Generate search terms for quick filtering
    generateSearchTerms(name, category, tags, description) {
        const terms = [
            name.toLowerCase(),
            category.toLowerCase(),
            ...tags.map(tag => tag.toLowerCase())
        ];

        if (description) {
            terms.push(...description.toLowerCase().split(' '));
        }

        return [...new Set(terms)];
    }

    // Get shape by ID
    getShape(id) {
        return this.shapes.get(id);
    }

    // Get all shapes in a category
    getShapesByCategory(category) {
        return this.categories.get(category) || [];
    }

    // Get all categories
    getCategories() {
        return Array.from(this.categories.keys());
    }

    // Search shapes
    searchShapes(query) {
        if (!query || query.trim() === '') {
            return Array.from(this.shapes.values());
        }

        const searchTerm = query.toLowerCase();
        return Array.from(this.shapes.values()).filter(shape =>
            shape.searchTerms.some(term => term.includes(searchTerm))
        );
    }

    // Get all shapes
    getAllShapes() {
        return Array.from(this.shapes.values());
    }

    // Load shape files dynamically
    async loadShapeFile(filePath) {
        if (this.loadedShapes.has(filePath)) {
            return; // Already loaded
        }

        try {
            const module = await import(filePath);
            if (module.registerShape && typeof module.registerShape === 'function') {
                module.registerShape(this);
                this.loadedShapes.add(filePath);
                console.log(`Loaded shape file: ${filePath}`);
            } else {
                console.warn(`Shape file ${filePath} does not export registerShape function`);
            }
        } catch (error) {
            console.error(`Failed to load shape file ${filePath}:`, error);
        }
    }

    // Load all shapes from a directory
    async loadShapesFromDirectory(directoryPath, shapes) {
        const loadPromises = shapes.map(shapeName =>
            this.loadShapeFile(`${directoryPath}/${shapeName}.js`)
        );

        await Promise.all(loadPromises);
    }

    // Initialize and load all default shapes
    async initialize() {
        console.log('Initializing Shape Registry...');

        // Load shapes from each category
        const shapeCategories = {
            basic: ['cube', 'sphere', 'torus', 'cylinder', 'cone'],
            platonic: ['tetrahedron', 'octahedron', 'dodecahedron', 'icosahedron'],
            mathematical: ['torusKnot', 'steinmetzSolid', 'mobius', 'kleinBottle', 'trefoilKnot', 'figureBight'],
            geometric: ['triangularPrism', 'pentagonalPrism', 'hexagonalPrism', 'star', 'gyroid'],
            artistic: ['horn', 'shell', 'helix', 'wave', 'twist'],
            advanced: ['catenoid', 'helicoid', 'boySurface', 'romanSurface', 'crossCap'],
            fractals: ['sierpinski', 'fibonacci', 'superellipsoid', 'hyperboloid']
        };

        const loadPromises = [];
        for (const [category, shapes] of Object.entries(shapeCategories)) {
            loadPromises.push(
                this.loadShapesFromDirectory(`../shapes/${category}`, shapes)
            );
        }

        await Promise.all(loadPromises);
        console.log(`Shape Registry initialized with ${this.shapes.size} shapes`);
    }

    // Generate HTML options for select element
    generateSelectOptions() {
        const categories = this.getCategories();
        let html = '';

        for (const category of categories) {
            const shapes = this.getShapesByCategory(category);
            if (shapes.length === 0) continue;

            // Category header
            html += `<option disabled>${category.toUpperCase()}</option>\n`;

            // Shapes in category
            for (const shape of shapes) {
                html += `<option value="${shape.id}">${shape.name}</option>\n`;
            }
        }

        return html;
    }

    // Update UI select element
    updateUI() {
        const shapeSelect = document.getElementById('shape');
        if (shapeSelect) {
            const currentValue = shapeSelect.value;
            shapeSelect.innerHTML = this.generateSelectOptions();

            // Restore selection if it still exists
            if (currentValue && this.shapes.has(currentValue)) {
                shapeSelect.value = currentValue;
            }
        }
    }
}

// Create and export singleton instance
export const shapeRegistry = new ShapeRegistry();

// Export the class as well for testing
export { ShapeRegistry };