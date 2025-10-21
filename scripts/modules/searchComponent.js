// searchComponent.js - Search functionality for the shape dropdown
import { searchShapes, shapeRegistry } from './shapes.js';

class ShapeSearchComponent {
    constructor() {
        this.originalSelect = null;
        this.searchInput = null;
        this.allOptions = [];
        this.filteredOptions = [];
        this.isSearchMode = false;
        this.debounceTimer = null;
    }

    // Initialize the search component
    initialize() {
        this.originalSelect = document.getElementById('shape');
        if (!this.originalSelect) {
            console.error('Shape select element not found');
            return;
        }

        this.createSearchUI();
        this.bindEvents();
        this.storeOriginalOptions();
    }

    // Create search input above the dropdown
    createSearchUI() {
        const controlItem = this.originalSelect.parentElement;

        // Create search input with results dropdown
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper';
        searchWrapper.innerHTML = `
            <div class="search-input-container">
                <input type="text" id="shape-search" placeholder="Search shapes..." class="search-input">
                <button id="advanced-search-btn" class="advanced-search-btn" title="Advanced Search">
                    <i class="fas fa-filter"></i>
                </button>
            </div>
            <div id="search-results-dropdown" class="search-results-dropdown" style="display: none;">
                <!-- Search results will appear here -->
            </div>
        `;

        // Insert before the select
        controlItem.insertBefore(searchWrapper, this.originalSelect);

        this.searchInput = document.getElementById('shape-search');
        this.advancedBtn = document.getElementById('advanced-search-btn');
        this.resultsDropdown = document.getElementById('search-results-dropdown');

        // Create advanced search modal
        this.createAdvancedModal();
    }

    // Create advanced search modal
    createAdvancedModal() {
        const modal = document.createElement('div');
        modal.id = 'advanced-search-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-search"></i> Advanced Shape Search</h3>
                    <button class="modal-close" id="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="filter-group">
                        <label>Search Text:</label>
                        <input type="text" id="modal-search" placeholder="Enter search terms...">
                    </div>

                    <div class="filter-group">
                        <label>Categories:</label>
                        <div class="category-grid" id="category-filters">
                            <!-- Categories will be populated -->
                        </div>
                    </div>

                    <div class="filter-group">
                        <label>Status:</label>
                        <div class="status-filters">
                            <label><input type="checkbox" id="filter-implemented" checked> Implemented</label>
                            <label><input type="checkbox" id="filter-planned" checked> Planned</label>
                        </div>
                    </div>

                    <div class="filter-group">
                        <label>Features:</label>
                        <div class="feature-filters">
                            <label><input type="checkbox" id="filter-metadata"> Has Enhanced Metadata</label>
                            <label><input type="checkbox" id="filter-equations"> Has Equations</label>
                        </div>
                    </div>

                    <div class="search-results-section">
                        <h4 id="results-title">Search Results</h4>
                        <div id="modal-search-results" class="modal-search-results">
                            <p class="no-search-yet">Enter search terms and apply filters to see results</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="apply-filters" class="btn primary">Search</button>
                    <button id="reset-filters" class="btn secondary">Reset</button>
                    <button id="close-filters" class="btn">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.modal = modal;
        this.populateCategories();
    }

    // Store original options from the select
    storeOriginalOptions() {
        this.allOptions = Array.from(this.originalSelect.options).map(option => ({
            value: option.value,
            text: option.textContent,
            element: option
        }));
        this.filteredOptions = [...this.allOptions];
    }

    // Bind event listeners
    bindEvents() {
        // Search input with real-time results
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 200);
        });

        // Hide dropdown when input loses focus (with delay for clicks)
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSearchResults();
            }, 150);
        });

        // Show dropdown when input gets focus and has content
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim() !== '') {
                this.showSearchResults();
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-wrapper')) {
                this.hideSearchResults();
            }
        });

        // Advanced search button
        this.advancedBtn.addEventListener('click', () => {
            this.showAdvancedModal();
        });

        // Modal events
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideAdvancedModal();
        });

        document.getElementById('close-filters').addEventListener('click', () => {
            this.hideAdvancedModal();
        });

        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyAdvancedFilters();
        });

        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideAdvancedModal();
            }
        });

        // Original select change event
        this.originalSelect.addEventListener('change', (e) => {
            // Keep the original functionality working
            const event = new Event('change', { bubbles: true });
            e.target.dispatchEvent(event);
        });
    }

    // Perform search and show results in dropdown
    performSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        if (searchTerm === '') {
            this.hideSearchResults();
            this.showAllOptions();
            return;
        }

        // Get all shapes from registry and search
        const allShapes = shapeRegistry.getAllShapes();
        const filteredShapes = allShapes.filter(shape =>
            shape.name.toLowerCase().includes(searchTerm) ||
            shape.category.toLowerCase().includes(searchTerm) ||
            (shape.description && shape.description.toLowerCase().includes(searchTerm))
        );

        // Update the dropdown options (filter existing select)
        this.filteredOptions = this.allOptions.filter(option =>
            filteredShapes.some(shape => shape.id === option.value)
        );
        this.updateDropdownOptions();

        // Show search results dropdown
        this.displaySearchResults(filteredShapes, searchTerm);
        this.showSearchResults();
    }

    // Display search results in the dropdown
    displaySearchResults(shapes, searchTerm) {
        if (shapes.length === 0) {
            this.resultsDropdown.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No shapes found for "${searchTerm}"</p>
                    <small>Try a different search term or use advanced search</small>
                </div>
            `;
            return;
        }

        // Group shapes by category
        const categorizedShapes = this.groupShapesByCategory(shapes);

        let html = `<div class="search-results-header">Found ${shapes.length} shape(s)</div>`;

        categorizedShapes.forEach(([category, categoryShapes]) => {
            if (categoryShapes.length === 0) return;

            html += `<div class="results-category">${category}</div>`;
            categoryShapes.forEach(shape => {
                const status = shape.isImplemented ? 'implemented' : 'planned';
                const statusIcon = shape.isImplemented ? 'fa-check' : 'fa-clock';
                const metadataIcon = shape.equations ? '<i class="fas fa-info-circle metadata-icon" title="Has detailed info"></i>' : '';

                html += `
                    <div class="search-result-item ${status}" data-shape-id="${shape.id}" data-shape-name="${shape.name}">
                        <div class="result-main">
                            <span class="shape-name">${this.highlightMatch(shape.name, searchTerm)}</span>
                            <div class="shape-indicators">
                                <i class="fas ${statusIcon} status-icon"></i>
                                ${metadataIcon}
                            </div>
                        </div>
                        <div class="result-meta">
                            <span class="shape-category">${shape.category}</span>
                        </div>
                    </div>
                `;
            });
        });

        this.resultsDropdown.innerHTML = html;

        // Bind click events to result items
        this.resultsDropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const shapeId = item.dataset.shapeId;
                const shapeName = item.dataset.shapeName;
                this.selectShapeFromSearch(shapeId, shapeName);
            });
        });
    }

    // Select a shape from search results
    selectShapeFromSearch(shapeId, shapeName) {
        // Update the original dropdown
        this.originalSelect.value = shapeId;

        // Update the search input
        this.searchInput.value = shapeName;

        // Hide search results
        this.hideSearchResults();

        // Trigger the shape change event
        const event = new Event('change', { bubbles: true });
        this.originalSelect.dispatchEvent(event);
    }

    // Highlight matching text in search results
    highlightMatch(text, searchTerm) {
        if (!searchTerm) return text;

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Show search results dropdown
    showSearchResults() {
        this.resultsDropdown.style.display = 'block';
    }

    // Hide search results dropdown
    hideSearchResults() {
        this.resultsDropdown.style.display = 'none';
    }

    // Group shapes by category maintaining order
    groupShapesByCategory(shapes) {
        const categories = new Map();
        const categoryOrder = [
            'BASIC SHAPES',
            'PLATONIC SOLIDS',
            'MATHEMATICAL SHAPES',
            'GEOMETRIC VARIATIONS',
            'ARTISTIC SHAPES',
            'ADVANCED MATHEMATICAL',
            'FRACTALS AND COMPLEX'
        ];

        // Initialize categories
        categoryOrder.forEach(cat => categories.set(cat, []));

        // Group shapes
        shapes.forEach(shape => {
            if (!categories.has(shape.category)) {
                categories.set(shape.category, []);
            }
            categories.get(shape.category).push(shape);
        });

        // Return in proper order, filtering out empty categories
        return Array.from(categories.entries()).filter(([, shapes]) => shapes.length > 0);
    }

    // Update dropdown to show only filtered options
    updateDropdownOptions() {
        // Hide all options first
        this.allOptions.forEach(option => {
            option.element.style.display = 'none';
        });

        // Show filtered options
        this.filteredOptions.forEach(option => {
            option.element.style.display = 'block';
        });

        // Update search input styling based on results
        if (this.filteredOptions.length === 0) {
            this.searchInput.classList.add('no-results');
            this.searchInput.title = 'No shapes found';
        } else {
            this.searchInput.classList.remove('no-results');
            this.searchInput.title = `${this.filteredOptions.length} shape(s) found`;
        }
    }

    // Show all options
    showAllOptions() {
        this.allOptions.forEach(option => {
            option.element.style.display = 'block';
        });
        this.searchInput.classList.remove('no-results');
        this.searchInput.title = '';
    }

    // Populate category filters
    populateCategories() {
        const categoryContainer = document.getElementById('category-filters');
        const shapes = shapeRegistry.getAllShapes();
        const categories = [...new Set(shapes.map(shape => shape.category))].sort();

        categoryContainer.innerHTML = categories.map(category => `
            <label class="category-item">
                <input type="checkbox" class="category-filter" value="${category}" checked>
                <span>${category}</span>
            </label>
        `).join('');
    }

    // Show advanced search modal
    showAdvancedModal() {
        this.modal.style.display = 'block';
        document.getElementById('modal-search').value = this.searchInput.value;
        document.getElementById('modal-search').focus();
    }

    // Hide advanced search modal
    hideAdvancedModal() {
        this.modal.style.display = 'none';
    }

    // Apply advanced filters
    applyAdvancedFilters() {
        const searchText = document.getElementById('modal-search').value;
        const implementedFilter = document.getElementById('filter-implemented').checked;
        const plannedFilter = document.getElementById('filter-planned').checked;
        const metadataFilter = document.getElementById('filter-metadata').checked;
        const equationsFilter = document.getElementById('filter-equations').checked;

        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(cb => cb.value);

        // Get all shapes from registry
        const allShapes = shapeRegistry.getAllShapes();

        // Apply filters
        const filteredShapes = allShapes.filter(shape => {
            // Category filter
            if (!selectedCategories.includes(shape.category)) return false;

            // Status filter
            if (!implementedFilter && shape.isImplemented) return false;
            if (!plannedFilter && !shape.isImplemented) return false;

            // Feature filters
            if (metadataFilter && !shape.equations) return false;
            if (equationsFilter && !shape.equations) return false;

            // Text search
            if (searchText.trim()) {
                const searchLower = searchText.toLowerCase();
                if (!shape.name.toLowerCase().includes(searchLower) &&
                    !shape.category.toLowerCase().includes(searchLower) &&
                    !(shape.description && shape.description.toLowerCase().includes(searchLower))) {
                    return false;
                }
            }

            return true;
        });

        // Display results in the modal
        this.displayModalResults(filteredShapes, searchText);
    }

    // Display search results in the modal
    displayModalResults(shapes, searchTerm) {
        const resultsContainer = document.getElementById('modal-search-results');
        const resultsTitle = document.getElementById('results-title');

        if (shapes.length === 0) {
            resultsTitle.textContent = 'No Results Found';
            resultsContainer.innerHTML = `
                <div class="modal-no-results">
                    <i class="fas fa-search"></i>
                    <p>No shapes match your search criteria</p>
                    <small>Try adjusting your filters or search terms</small>
                </div>
            `;
            return;
        }

        resultsTitle.textContent = `Found ${shapes.length} Shape(s)`;

        // Group shapes by category
        const categorizedShapes = this.groupShapesByCategory(shapes);

        let html = '';
        categorizedShapes.forEach(([category, categoryShapes]) => {
            if (categoryShapes.length === 0) return;

            html += `<div class="modal-results-category">${category} (${categoryShapes.length})</div>`;
            categoryShapes.forEach(shape => {
                const status = shape.isImplemented ? 'implemented' : 'planned';
                const statusIcon = shape.isImplemented ? 'fa-check' : 'fa-clock';
                const metadataIcon = shape.equations ? '<i class="fas fa-info-circle metadata-icon" title="Has detailed info"></i>' : '';

                html += `
                    <div class="modal-result-item ${status}" data-shape-id="${shape.id}" data-shape-name="${shape.name}">
                        <div class="modal-result-main">
                            <span class="shape-name">${this.highlightMatch(shape.name, searchTerm)}</span>
                            <div class="shape-indicators">
                                <i class="fas ${statusIcon} status-icon" title="${shape.isImplemented ? 'Implemented' : 'Planned'}"></i>
                                ${metadataIcon}
                            </div>
                        </div>
                        <div class="modal-result-meta">
                            <span class="shape-category">${shape.category}</span>
                            ${shape.description ? `<span class="shape-description">${shape.description.substring(0, 100)}${shape.description.length > 100 ? '...' : ''}</span>` : ''}
                        </div>
                        <button class="select-shape-btn" data-shape-id="${shape.id}" data-shape-name="${shape.name}">
                            <i class="fas fa-check"></i> Select This Shape
                        </button>
                    </div>
                `;
            });
        });

        resultsContainer.innerHTML = html;

        // Bind click events to select buttons
        resultsContainer.querySelectorAll('.select-shape-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const shapeId = btn.dataset.shapeId;
                const shapeName = btn.dataset.shapeName;
                this.selectShapeFromModal(shapeId, shapeName);
            });
        });

        // Also bind click events to result items (alternative way to select)
        resultsContainer.querySelectorAll('.modal-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger if clicking the select button
                if (e.target.closest('.select-shape-btn')) return;

                const shapeId = item.dataset.shapeId;
                const shapeName = item.dataset.shapeName;
                this.selectShapeFromModal(shapeId, shapeName);
            });
        });
    }

    // Select a shape from modal results
    selectShapeFromModal(shapeId, shapeName) {
        // Update the original dropdown
        this.originalSelect.value = shapeId;

        // Update the search input
        this.searchInput.value = shapeName;

        // Hide the modal
        this.hideAdvancedModal();

        // Trigger the shape change event
        const event = new Event('change', { bubbles: true });
        this.originalSelect.dispatchEvent(event);
    }

    // Reset all filters
    resetFilters() {
        document.getElementById('modal-search').value = '';
        document.getElementById('filter-implemented').checked = true;
        document.getElementById('filter-planned').checked = true;
        document.getElementById('filter-metadata').checked = false;
        document.getElementById('filter-equations').checked = false;

        document.querySelectorAll('.category-filter').forEach(cb => cb.checked = true);

        this.searchInput.value = '';
        this.showAllOptions();
        this.hideAdvancedModal();
    }

    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.showAllOptions();
    }

    // Refresh when shapes are updated
    refresh() {
        this.storeOriginalOptions();
        this.populateCategories();
    }
}

// Create and export singleton instance
export const shapeSearch = new ShapeSearchComponent();

export { ShapeSearchComponent };