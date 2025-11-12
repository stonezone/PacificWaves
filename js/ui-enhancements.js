/**
 * UI Enhancements for PacificWaves
 * Adds status bar, map controls, legend, tooltips, and forecast charts
 */

(function() {
    'use strict';

    // UI Enhancement Module
    const UIEnhancements = {
        // References to UI elements
        elements: {},

        // Zoom state
        zoomLevel: 1.0,
        zoomMin: 0.5,
        zoomMax: 3.0,
        zoomStep: 0.2,

        // FPS tracking
        fpsHistory: [],
        lastFrameTime: Date.now(),

        // Forecast data
        forecastData: [],
        forecastCanvas: null,
        forecastCtx: null,

        /**
         * Initialize UI enhancements
         */
        init: function() {
            console.log('[UI Enhancements] Initializing...');

            // Get references to all UI elements
            this.elements = {
                statusBar: document.getElementById('statusBar'),
                statusStormCount: document.getElementById('statusStormCount'),
                statusTime: document.getElementById('statusTime'),
                statusFPS: document.getElementById('statusFPS'),

                mapControls: document.getElementById('mapControls'),
                zoomInBtn: document.getElementById('zoomInBtn'),
                zoomOutBtn: document.getElementById('zoomOutBtn'),
                resetViewBtn: document.getElementById('resetViewBtn'),

                mapLegend: document.getElementById('mapLegend'),

                stormTooltip: document.getElementById('stormInfoTooltip'),
                tooltipStormName: document.getElementById('tooltipStormName'),
                tooltipPosition: document.getElementById('tooltipPosition'),
                tooltipWind: document.getElementById('tooltipWind'),
                tooltipHeading: document.getElementById('tooltipHeading'),
                tooltipSpeed: document.getElementById('tooltipSpeed'),

                forecastCanvas: document.getElementById('forecastChartCanvas'),
                simCanvas: document.getElementById('simCanvas')
            };

            // Initialize forecast canvas
            if (this.elements.forecastCanvas) {
                this.forecastCanvas = this.elements.forecastCanvas;
                this.forecastCtx = this.forecastCanvas.getContext('2d');
                this.setupForecastCanvas();
            }

            // Bind event listeners
            this.bindEvents();

            // Start update loop
            this.startUpdateLoop();

            console.log('[UI Enhancements] Initialized successfully');
        },

        /**
         * Setup forecast canvas dimensions
         */
        setupForecastCanvas: function() {
            const parent = this.forecastCanvas.parentElement;
            const rect = parent.getBoundingClientRect();
            this.forecastCanvas.width = rect.width - 24; // Account for padding
            this.forecastCanvas.height = 160;
        },

        /**
         * Bind event listeners
         */
        bindEvents: function() {
            // Map control buttons
            if (this.elements.zoomInBtn) {
                this.elements.zoomInBtn.addEventListener('click', () => this.zoomIn());
            }
            if (this.elements.zoomOutBtn) {
                this.elements.zoomOutBtn.addEventListener('click', () => this.zoomOut());
            }
            if (this.elements.resetViewBtn) {
                this.elements.resetViewBtn.addEventListener('click', () => this.resetView());
            }

            // Storm hover tooltip
            if (this.elements.simCanvas) {
                this.elements.simCanvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
                this.elements.simCanvas.addEventListener('mouseleave', () => this.hideStormTooltip());
            }

            // Window resize
            window.addEventListener('resize', () => {
                if (this.forecastCanvas) {
                    this.setupForecastCanvas();
                    this.drawForecastChart();
                }
            });
        },

        /**
         * Zoom in on map
         */
        zoomIn: function() {
            if (this.zoomLevel < this.zoomMax) {
                this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.zoomMax);
                console.log(`[UI] Zoom in: ${this.zoomLevel.toFixed(1)}x`);
                // Note: Actual zoom implementation would require modifying the render system
                // This is a UI placeholder for future implementation
            }
        },

        /**
         * Zoom out on map
         */
        zoomOut: function() {
            if (this.zoomLevel > this.zoomMin) {
                this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.zoomMin);
                console.log(`[UI] Zoom out: ${this.zoomLevel.toFixed(1)}x`);
                // Note: Actual zoom implementation would require modifying the render system
            }
        },

        /**
         * Reset view to default zoom
         */
        resetView: function() {
            this.zoomLevel = 1.0;
            console.log('[UI] Reset view to 1.0x');
            // Note: Actual reset would require modifying the render system
        },

        /**
         * Handle mouse move over canvas for storm tooltips
         */
        handleCanvasMouseMove: function(e) {
            // Check if we have access to the Storm array
            if (typeof window.State === 'undefined' || !window.State.storms) {
                return;
            }

            const rect = this.elements.simCanvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Find storm under cursor
            const hoveredStorm = this.findStormAtPosition(mouseX, mouseY);

            if (hoveredStorm) {
                this.showStormTooltip(hoveredStorm, e.clientX, e.clientY);
            } else {
                this.hideStormTooltip();
            }
        },

        /**
         * Find storm at canvas position
         */
        findStormAtPosition: function(canvasX, canvasY) {
            if (!window.State || !window.State.storms) return null;

            for (let storm of window.State.storms) {
                // Get storm screen position (this would need to match the actual render coordinates)
                // For now, this is a placeholder
                // In real implementation, we'd need to convert lat/lon to canvas coords
                const distance = Math.sqrt(
                    Math.pow(canvasX - storm.screenX, 2) +
                    Math.pow(canvasY - storm.screenY, 2)
                );

                if (distance < 30) { // 30px hover radius
                    return storm;
                }
            }

            return null;
        },

        /**
         * Show storm info tooltip
         */
        showStormTooltip: function(storm, x, y) {
            if (!this.elements.stormTooltip) return;

            // Update tooltip content
            this.elements.tooltipStormName.textContent = storm.name || 'Unnamed Storm';
            this.elements.tooltipPosition.textContent = `${storm.lat.toFixed(1)}°N, ${storm.lon.toFixed(1)}°E`;
            this.elements.tooltipWind.textContent = `${Math.round(storm.wind_max)} kt`;
            this.elements.tooltipHeading.textContent = `${Math.round(storm.heading)}°`;
            this.elements.tooltipSpeed.textContent = `${Math.round(storm.speed)} kt`;

            // Position tooltip
            this.elements.stormTooltip.style.left = (x + 15) + 'px';
            this.elements.stormTooltip.style.top = (y + 15) + 'px';
            this.elements.stormTooltip.classList.add('visible');
        },

        /**
         * Hide storm info tooltip
         */
        hideStormTooltip: function() {
            if (this.elements.stormTooltip) {
                this.elements.stormTooltip.classList.remove('visible');
            }
        },

        /**
         * Update status bar
         */
        updateStatusBar: function() {
            // Update storm count
            if (window.State && window.State.storms) {
                const stormCount = window.State.storms.length;
                if (this.elements.statusStormCount) {
                    this.elements.statusStormCount.textContent = stormCount;
                }
            }

            // Update simulation time
            if (window.State && typeof window.State.time !== 'undefined') {
                const time = window.State.time.toFixed(1);
                if (this.elements.statusTime) {
                    this.elements.statusTime.textContent = `T+ ${time}h`;
                }
            }

            // Update FPS
            this.updateFPS();
        },

        /**
         * Update FPS counter
         */
        updateFPS: function() {
            const now = Date.now();
            const delta = now - this.lastFrameTime;
            this.lastFrameTime = now;

            if (delta > 0) {
                const fps = Math.round(1000 / delta);
                this.fpsHistory.push(fps);

                // Keep only last 30 frames
                if (this.fpsHistory.length > 30) {
                    this.fpsHistory.shift();
                }

                // Calculate average FPS
                const avgFPS = Math.round(
                    this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
                );

                if (this.elements.statusFPS) {
                    this.elements.statusFPS.textContent = avgFPS;
                }
            }
        },

        /**
         * Update forecast chart
         */
        updateForecastChart: function() {
            // Collect forecast data from sites
            if (!window.State || !window.State.sites) return;

            // Generate forecast data (simplified - in real version would use actual simulation data)
            this.forecastData = [];
            for (let i = 0; i <= 24; i++) {
                this.forecastData.push({
                    hour: i,
                    siteA: Math.random() * 5,
                    siteB: Math.random() * 4,
                    siteC: Math.random() * 6
                });
            }

            this.drawForecastChart();
        },

        /**
         * Draw forecast chart on canvas
         */
        drawForecastChart: function() {
            if (!this.forecastCtx || !this.forecastCanvas || this.forecastData.length === 0) {
                return;
            }

            const ctx = this.forecastCtx;
            const width = this.forecastCanvas.width;
            const height = this.forecastCanvas.height;

            // Clear canvas
            ctx.fillStyle = '#0a0f14';
            ctx.fillRect(0, 0, width, height);

            // Draw grid
            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 1;

            // Horizontal grid lines
            for (let i = 0; i <= 5; i++) {
                const y = (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Vertical grid lines (every 6 hours)
            for (let i = 0; i <= 4; i++) {
                const x = (width / 4) * i;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Draw data lines
            const colors = ['#3b82f6', '#22c55e', '#eab308']; // Blue, Green, Yellow
            const labels = ['Site A', 'Site B', 'Site C'];
            const dataKeys = ['siteA', 'siteB', 'siteC'];

            dataKeys.forEach((key, idx) => {
                ctx.strokeStyle = colors[idx];
                ctx.lineWidth = 2;
                ctx.beginPath();

                this.forecastData.forEach((point, i) => {
                    const x = (i / (this.forecastData.length - 1)) * width;
                    const y = height - (point[key] / 8) * height; // Scale to max 8m

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });

                ctx.stroke();
            });

            // Draw labels
            ctx.fillStyle = '#9ca3af';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';

            // Time labels
            for (let i = 0; i <= 4; i++) {
                const x = (width / 4) * i;
                const hour = i * 6;
                ctx.fillText(`${hour}h`, x, height - 2);
            }

            // Legend
            ctx.textAlign = 'left';
            labels.forEach((label, idx) => {
                const x = 10;
                const y = 15 + (idx * 15);

                ctx.fillStyle = colors[idx];
                ctx.fillRect(x, y - 8, 10, 2);

                ctx.fillStyle = '#f3f4f6';
                ctx.fillText(label, x + 15, y);
            });
        },

        /**
         * Start update loop
         */
        startUpdateLoop: function() {
            const update = () => {
                this.updateStatusBar();
                requestAnimationFrame(update);
            };
            requestAnimationFrame(update);

            // Update forecast chart every 5 seconds
            setInterval(() => {
                this.updateForecastChart();
            }, 5000);

            // Initial forecast update
            setTimeout(() => {
                this.updateForecastChart();
            }, 1000);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UIEnhancements.init());
    } else {
        UIEnhancements.init();
    }

    // Expose to global scope for debugging
    window.UIEnhancements = UIEnhancements;

})();
