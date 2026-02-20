/**
 * PIGMENT Kinship Visualization Library
 * Creates interactive family trees showing artistic influence
 * Version 1.0.0
 */

const KinshipViz = (function() {
    // Configuration
    const CONFIG = {
        colors: {
            nodes: '#c8ff00',
            edges: '#333333',
            highlight: '#ff3b2f',
            text: '#f0ede6',
            background: '#0a0a0a'
        },
        dimensions: {
            nodeRadius: 20,
            nodeSpacing: 100,
            levelSpacing: 120
        },
        animations: {
            duration: 750,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
        }
    };

    // Utility functions
    const utils = {
        // Generate unique ID
        uid() {
            return 'viz-' + Math.random().toString(36).substr(2, 9);
        },

        // Debounce for resize
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Format similarity score
        formatSimilarity(score) {
            return (score * 100).toFixed(1) + '%';
        }
    };

    // Main visualization class
    class KinshipTree {
        constructor(containerId, options = {}) {
            this.container = document.getElementById(containerId);
            if (!this.container) throw new Error(`Container #${containerId} not found`);

            // Merge options with defaults
            this.options = { ...CONFIG, ...options };
            this.data = null;
            this.width = 0;
            this.height = 0;
            this.svg = null;
            this.zoom = null;
            this.tree = null;
            this.root = null;
            this.id = utils.uid();

            // Bind methods
            this.handleResize = utils.debounce(this.handleResize.bind(this), 250);
            this.handleClick = this.handleClick.bind(this);
            this.handleHover = this.handleHover.bind(this);

            // Initialize
            this.init();
        }

        // Initialize the visualization
        init() {
            // Create SVG element
            this.svg = d3.select(`#${this.container.id}`)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${this.width} ${this.height}`)
                .style('background', this.options.colors.background)
                .style('display', 'block');

            // Add zoom behavior
            this.zoom = d3.zoom()
                .scaleExtent([0.5, 3])
                .on('zoom', (event) => {
                    this.svg.select('g').attr('transform', event.transform);
                });

            this.svg.call(this.zoom);

            // Create main group
            this.svg.append('g').attr('class', 'tree-group');

            // Set up tree layout
            this.tree = d3.tree()
                .nodeSize([this.options.dimensions.nodeSpacing, this.options.dimensions.levelSpacing])
                .separation((a, b) => a.parent === b.parent ? 1 : 1.5);

            // Add window resize listener
            window.addEventListener('resize', this.handleResize);

            // Add tooltip
            this.setupTooltip();

            // Add controls
            this.setupControls();

            console.log('KinshipViz initialized:', this.id);
        }

        // Setup tooltip
        setupTooltip() {
            this.tooltip = d3.select('body')
                .append('div')
                .attr('class', 'kinship-tooltip')
                .style('position', 'absolute')
                .style('background', '#0d0d0d')
                .style('border', `1px solid ${this.options.colors.nodes}`)
                .style('color', this.options.colors.text)
                .style('padding', '8px 12px')
                .style('border-radius', '4px')
                .style('font-size', '12px')
                .style('font-family', 'DM Mono, monospace')
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .style('opacity', '0')
                .style('transition', 'opacity 0.2s');
        }

        // Setup controls
        setupControls() {
            const controls = d3.select(`#${this.container.id}`)
                .append('div')
                .attr('class', 'kinship-controls')
                .style('position', 'absolute')
                .style('top', '10px')
                .style('right', '10px')
                .style('display', 'flex')
                .style('gap', '5px')
                .style('z-index', '10');

            controls.append('button')
                .attr('class', 'viz-btn')
                .style('background', '#0d0d0d')
                .style('border', `1px solid ${this.options.colors.nodes}`)
                .style('color', this.options.colors.text)
                .style('padding', '5px 10px')
                .style('cursor', 'pointer')
                .style('border-radius', '3px')
                .text('Zoom In')
                .on('click', () => this.zoomIn());

            controls.append('button')
                .attr('class', 'viz-btn')
                .style('background', '#0d0d0d')
                .style('border', `1px solid ${this.options.colors.nodes}`)
                .style('color', this.options.colors.text)
                .style('padding', '5px 10px')
                .style('cursor', 'pointer')
                .style('border-radius', '3px')
                .text('Zoom Out')
                .on('click', () => this.zoomOut());

            controls.append('button')
                .attr('class', 'viz-btn')
                .style('background', '#0d0d0d')
                .style('border', `1px solid ${this.options.colors.nodes}`)
                .style('color', this.options.colors.text)
                .style('padding', '5px 10px')
                .style('cursor', 'pointer')
                .style('border-radius', '3px')
                .text('Reset')
                .on('click', () => this.resetZoom());
        }

        // Zoom controls
        zoomIn() {
            this.svg.transition()
                .duration(300)
                .call(this.zoom.scaleBy, 1.3);
        }

        zoomOut() {
            this.svg.transition()
                .duration(300)
                .call(this.zoom.scaleBy, 0.7);
        }

        resetZoom() {
            this.svg.transition()
                .duration(300)
                .call(this.zoom.transform, d3.zoomIdentity);
        }

        // Load data
        loadData(data) {
            this.data = data;
            this.render();
        }

        // Load from URL
        async loadFromUrl(url) {
            try {
                const response = await fetch(url);
                this.data = await response.json();
                this.render();
            } catch (error) {
                console.error('Failed to load kinship data:', error);
                this.showError('Failed to load data');
            }
        }

        // Render the tree
        render() {
            if (!this.data) return;

            // Convert to hierarchical data
            this.root = d3.hierarchy(this.data, d => d.children);
            
            // Compute tree layout
            this.tree(this.root);
            
            // Get dimensions
            this.updateDimensions();
            
            // Update viewBox
            this.svg.attr('viewBox', `0 0 ${this.width} ${this.height}`);
            
            // Get group
            const group = this.svg.select('.tree-group');
            group.selectAll('*').remove();

            // Draw edges
            group.selectAll('.edge')
                .data(this.root.links())
                .enter()
                .append('line')
                .attr('class', 'edge')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
                .attr('stroke', this.options.colors.edges)
                .attr('stroke-width', d => d.target.data.similarity ? 1 + d.target.data.similarity * 3 : 1)
                .attr('stroke-opacity', 0.3)
                .attr('stroke-dasharray', d => d.target.data.influence === 'indirect' ? '5,5' : null);

            // Create nodes
            const nodes = group.selectAll('.node')
                .data(this.root.descendants())
                .enter()
                .append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.x},${d.y})`)
                .on('click', this.handleClick)
                .on('mouseover', this.handleHover)
                .on('mouseout', this.handleHover);

            // Add node circles
            nodes.append('circle')
                .attr('r', d => d.data.importance ? 15 + d.data.importance * 10 : this.options.dimensions.nodeRadius)
                .attr('fill', d => d.data.color || this.options.colors.nodes)
                .attr('fill-opacity', d => d.data.opacity || 0.8)
                .attr('stroke', d => d.data.highlight ? this.options.colors.highlight : 'none')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .style('transition', 'r 0.2s');

            // Add node labels
            nodes.append('text')
                .attr('dy', -25)
                .attr('text-anchor', 'middle')
                .attr('fill', this.options.colors.text)
                .style('font-size', '10px')
                .style('font-family', 'DM Mono, monospace')
                .text(d => d.data.name || d.data.id);

            // Add similarity badges
            nodes.filter(d => d.data.similarity)
                .append('text')
                .attr('dy', 30)
                .attr('text-anchor', 'middle')
                .attr('fill', this.options.colors.nodes)
                .style('font-size', '9px')
                .style('font-family', 'DM Mono, monospace')
                .text(d => utils.formatSimilarity(d.data.similarity));

            // Center the view
            this.centerView();
        }

        // Update dimensions based on tree layout
        updateDimensions() {
            if (!this.root) return;

            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;

            this.root.descendants().forEach(d => {
                minX = Math.min(minX, d.x);
                maxX = Math.max(maxX, d.x);
                minY = Math.min(minY, d.y);
                maxY = Math.max(maxY, d.y);
            });

            this.width = (maxX - minX) + this.options.dimensions.nodeSpacing * 2;
            this.height = (maxY - minY) + this.options.dimensions.levelSpacing * 2;

            // Shift all coordinates to positive
            this.root.descendants().forEach(d => {
                d.x = d.x - minX + this.options.dimensions.nodeSpacing;
                d.y = d.y - minY + this.options.dimensions.levelSpacing;
            });
        }

        // Center view
        centerView() {
            const svgNode = this.svg.node();
            if (!svgNode) return;

            const bbox = svgNode.getBBox();
            const scale = Math.min(
                svgNode.clientWidth / bbox.width,
                svgNode.clientHeight / bbox.height
            ) * 0.9;

            const transform = d3.zoomIdentity
                .translate(
                    (svgNode.clientWidth - bbox.width * scale) / 2 - bbox.x * scale,
                    (svgNode.clientHeight - bbox.height * scale) / 2 - bbox.y * scale
                )
                .scale(scale);

            this.svg.transition()
                .duration(500)
                .call(this.zoom.transform, transform);
        }

        // Handle node click
        handleClick(event, d) {
            // Highlight clicked node
            d3.select(event.currentTarget).select('circle')
                .attr('stroke', this.options.colors.highlight)
                .attr('stroke-width', 3);

            // Show info in tooltip
            this.tooltip.style('opacity', '1')
                .html(`
                    <strong>${d.data.name || d.data.id}</strong><br>
                    Similarity: ${d.data.similarity ? utils.formatSimilarity(d.data.similarity) : 'N/A'}<br>
                    Generations: ${d.data.generations || 'N/A'}<br>
                    Fitness: ${d.data.fitness ? d.data.fitness.toFixed(1) + '%' : 'N/A'}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 40) + 'px');

            // Trigger custom event
            const customEvent = new CustomEvent('kinship:node-click', {
                detail: { node: d.data }
            });
            this.container.dispatchEvent(customEvent);
        }

        // Handle hover
        handleHover(event, d) {
            const circle = d3.select(event.currentTarget).select('circle');
            
            if (event.type === 'mouseover') {
                // Highlight node
                circle.attr('r', d.data.importance ? 20 + d.data.importance * 10 : 25);
                
                // Show tooltip
                this.tooltip.style('opacity', '1')
                    .html(`
                        <strong>${d.data.name || d.data.id}</strong><br>
                        Similarity: ${d.data.similarity ? utils.formatSimilarity(d.data.similarity) : 'N/A'}<br>
                        Click for details
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 40) + 'px');
            } else {
                // Reset node
                circle.attr('r', d.data.importance ? 15 + d.data.importance * 10 : this.options.dimensions.nodeRadius)
                    .attr('stroke', d.data.highlight ? this.options.colors.highlight : 'none');
                
                // Hide tooltip
                this.tooltip.style('opacity', '0');
            }
        }

        // Handle resize
        handleResize() {
            if (this.svg) {
                this.centerView();
            }
        }

        // Show error
        showError(message) {
            this.svg.append('text')
                .attr('x', '50%')
                .attr('y', '50%')
                .attr('text-anchor', 'middle')
                .attr('fill', this.options.colors.highlight)
                .style('font-size', '14px')
                .text(message);
        }

        // Update data
        updateData(newData) {
            this.data = newData;
            this.render();
        }

        // Clear visualization
        clear() {
            this.svg.select('.tree-group').selectAll('*').remove();
            this.data = null;
            this.root = null;
        }

        // Export as SVG
        exportSVG() {
            const svgNode = this.svg.node();
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svgNode);
            
            // Add namespace
            if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            
            const blob = new Blob([source], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'kinship-tree.svg';
            a.click();
            
            URL.revokeObjectURL(url);
        }

        // Export as PNG
        exportPNG() {
            const svgNode = this.svg.node();
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            const bbox = svgNode.getBBox();
            canvas.width = bbox.width * 2;
            canvas.height = bbox.height * 2;
            
            const data = new XMLSerializer().serializeToString(svgNode);
            const svgBlob = new Blob([data], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            
            const img = new Image();
            img.onload = () => {
                context.fillStyle = this.options.colors.background;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = 'kinship-tree.png';
                a.click();
                
                URL.revokeObjectURL(url);
            };
            img.src = url;
        }

        // Destroy instance
        destroy() {
            window.removeEventListener('resize', this.handleResize);
            this.svg.remove();
            this.tooltip.remove();
            d3.select(`#${this.container.id} .kinship-controls`).remove();
        }
    }

    // Helper function to create sample data
    function createSampleData() {
        return {
            id: 'root',
            name: 'Original Work',
            children: [
                {
                    id: 'child1',
                    name: 'Variant A',
                    similarity: 0.85,
                    importance: 0.9,
                    children: [
                        {
                            id: 'grandchild1',
                            name: 'Variant A1',
                            similarity: 0.72,
                            importance: 0.7
                        },
                        {
                            id: 'grandchild2',
                            name: 'Variant A2',
                            similarity: 0.68,
                            importance: 0.6
                        }
                    ]
                },
                {
                    id: 'child2',
                    name: 'Variant B',
                    similarity: 0.78,
                    importance: 0.8,
                    children: [
                        {
                            id: 'grandchild3',
                            name: 'Variant B1',
                            similarity: 0.62,
                            importance: 0.5
                        }
                    ]
                },
                {
                    id: 'child3',
                    name: 'Variant C',
                    similarity: 0.65,
                    importance: 0.6,
                    influence: 'indirect'
                }
            ]
        };
    }

    // Public API
    return {
        create: (containerId, options) => new KinshipTree(containerId, options),
        sample: createSampleData,
        version: '1.0.0'
    };
})();

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-kinship-viz]');
    containers.forEach(container => {
        const options = container.dataset.options ? JSON.parse(container.dataset.options) : {};
        const viz = KinshipViz.create(container.id, options);
        
        // Load sample data if no data provided
        if (container.dataset.source) {
            viz.loadFromUrl(container.dataset.source);
        } else {
            viz.loadData(KinshipViz.sample());
        }
    });
});