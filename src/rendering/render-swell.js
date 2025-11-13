/**
 * Swell Ray Tracing Visualization Module
 * @module rendering/render-swell
 * @version 1.0.0
 *
 * Provides realistic swell ray propagation visualization from storm systems.
 * Includes ray tracing, land collision detection, refraction, and energy-based rendering.
 */

import { CONSTS } from '../core/constants.js';
import { Utils } from '../utilities/coordinate-utils.js';

/**
 * Swell Ray Renderer
 * Handles all swell ray visualization including propagation, land interaction, and rendering
 */
export const SwellRenderer = {
    /**
     * Main entry point - draws swell rays emanating from all active storms
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} w - Canvas width
     * @param {number} h - Canvas height
     * @param {Object} state - Application state (storms, grid, etc.)
     */
    drawSwellRays(ctx, w, h, state) {
        const { gridWidth, gridHeight, storms } = state;
        const cellW = w / gridWidth;
        const cellH = h / gridHeight;

        // Draw rays for each active storm
        storms.forEach(storm => {
            // Skip storms with very low wind
            if (storm.wind < CONSTS.SWELL_RAY.MIN_WIND) return;

            const { i: stormI, j: stormJ } = Utils.latLonToCell(storm.lat, storm.lon);
            const stormX = stormI * cellW;
            const stormY = stormJ * cellH;

            // Calculate wave energy from storm parameters
            const waveHeight = this.estimateWaveHeight(storm);
            const wavePeriod = this.estimateWavePeriod(storm);

            // Emit rays in all directions
            for (let angle = 0; angle < 360; angle += CONSTS.SWELL_RAY.ANGLE_STEP) {
                const radians = (angle * Math.PI) / 180;
                this.traceSwellRay(
                    ctx,
                    stormX,
                    stormY,
                    radians,
                    waveHeight,
                    wavePeriod,
                    storm,
                    cellW,
                    cellH,
                    state
                );
            }
        });
    },

    /**
     * Trace a single swell ray from storm outward with land collision detection
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} startX - Starting X position (pixels)
     * @param {number} startY - Starting Y position (pixels)
     * @param {number} angle - Initial angle (radians)
     * @param {number} waveHeight - Wave height (meters)
     * @param {number} wavePeriod - Wave period (seconds)
     * @param {Object} storm - Storm object
     * @param {number} cellW - Cell width (pixels)
     * @param {number} cellH - Cell height (pixels)
     * @param {Object} state - Application state
     */
    traceSwellRay(ctx, startX, startY, angle, waveHeight, wavePeriod, storm, cellW, cellH, state) {
        const { gridWidth, gridHeight, staticGrid } = state;

        let x = startX;
        let y = startY;
        let currentAngle = angle;
        let distance = 0;

        const rayPoints = [];
        let energyDecay = 1.0;

        // Trace ray outward step by step
        while (distance < CONSTS.SWELL_RAY.MAX_DISTANCE) {
            // Convert to grid coordinates
            const i = Math.floor(x / cellW);
            const j = Math.floor(y / cellH);

            // Bounds check
            if (i < 0 || i >= gridWidth || j < 0 || j >= gridHeight) break;

            const idx = j * gridWidth + i;

            // Check for land collision
            if (staticGrid.isLand[idx] === 1) {
                // Calculate refraction around land
                const newAngle = this.calculateRefraction(i, j, currentAngle, cellW, cellH, state);

                // If refraction fails (dead end), stop ray
                if (newAngle === null) break;

                currentAngle = newAngle;

                // Energy loss when encountering land
                energyDecay *= CONSTS.SWELL_RAY.LAND_PENALTY;
                if (energyDecay < CONSTS.SWELL_RAY.MIN_ENERGY) break;
            }

            // Record point for drawing
            rayPoints.push({
                x,
                y,
                distance,
                energy: energyDecay
            });

            // Move to next point
            const dx = Math.cos(currentAngle) * CONSTS.SWELL_RAY.STEP_SIZE * cellW;
            const dy = Math.sin(currentAngle) * CONSTS.SWELL_RAY.STEP_SIZE * cellH;
            x += dx;
            y += dy;
            distance += CONSTS.SWELL_RAY.STEP_SIZE;

            // Natural energy decay with distance (spreading)
            energyDecay *= CONSTS.SWELL_RAY.ENERGY_DECAY;
        }

        // Draw the ray as a line with period-based segmentation
        if (rayPoints.length > 2) {
            this.drawRayPath(ctx, rayPoints, waveHeight, wavePeriod, storm);
        }
    },

    /**
     * Draw ray path with realistic period growth and energy visualization
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Array} points - Array of ray points {x, y, distance, energy}
     * @param {number} waveHeight - Wave height (meters)
     * @param {number} wavePeriod - Wave period (seconds)
     * @param {Object} storm - Storm object
     */
    drawRayPath(ctx, points, waveHeight, wavePeriod, storm) {
        if (points.length < 2) return;

        // Calculate color based on wave height (energy)
        const { r, g, b, alpha } = this.getSwellColor(waveHeight);

        // Draw ray as segmented line with period spacing
        ctx.beginPath();

        let lastDrawn = -1;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];

            // Period growth: spacing increases with distance
            const baseSpacing = 3;
            const growthFactor = Math.sqrt(point.distance / 50);
            const spacing = Math.max(1, baseSpacing * (1 + growthFactor));

            // Only draw at intervals (creates wave-like pattern)
            if (i === 0 || i - lastDrawn >= spacing) {
                if (lastDrawn === -1) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
                lastDrawn = i;
            }
        }

        // Apply styling based on energy
        const avgEnergy = points.reduce((sum, p) => sum + p.energy, 0) / points.length;
        const finalAlpha = alpha * avgEnergy * 0.6;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;

        // Line width based on wave height
        const lineWidth = Math.max(0.5, Math.min(3, waveHeight / 4));
        ctx.lineWidth = lineWidth;

        // Optional: Add glow effect for high-energy swells
        if (waveHeight > 8) {
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.5})`;
            ctx.shadowBlur = 3;
        }

        ctx.stroke();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    },

    /**
     * Calculate refraction when ray hits land - finds best open water direction
     * @param {number} i - Grid column
     * @param {number} j - Grid row
     * @param {number} angle - Current angle (radians)
     * @param {number} cellW - Cell width (pixels)
     * @param {number} cellH - Cell height (pixels)
     * @param {Object} state - Application state
     * @returns {number|null} New angle or null if ray should stop
     */
    calculateRefraction(i, j, angle, cellW, cellH, state) {
        const { gridWidth, gridHeight, staticGrid } = state;

        // Check surrounding cells to determine land boundary direction
        const checkLand = (di, dj) => {
            const ni = i + di;
            const nj = j + dj;
            if (ni < 0 || ni >= gridWidth || nj < 0 || nj >= gridHeight) return 1;
            return staticGrid.isLand[nj * gridWidth + ni];
        };

        const left = checkLand(-1, 0);
        const right = checkLand(1, 0);
        const up = checkLand(0, -1);
        const down = checkLand(0, 1);

        // Find open water directions
        const openDirections = [];
        if (left === 0) openDirections.push(Math.PI);
        if (right === 0) openDirections.push(0);
        if (up === 0) openDirections.push(-Math.PI / 2);
        if (down === 0) openDirections.push(Math.PI / 2);

        // Diagonals
        if (checkLand(-1, -1) === 0) openDirections.push(-3 * Math.PI / 4);
        if (checkLand(1, -1) === 0) openDirections.push(-Math.PI / 4);
        if (checkLand(-1, 1) === 0) openDirections.push(3 * Math.PI / 4);
        if (checkLand(1, 1) === 0) openDirections.push(Math.PI / 4);

        // No open directions - ray blocked
        if (openDirections.length === 0) return null;

        // Find direction closest to current angle
        let bestAngle = openDirections[0];
        let bestDiff = Math.abs(this.angleDiff(angle, bestAngle));

        for (let i = 1; i < openDirections.length; i++) {
            const diff = Math.abs(this.angleDiff(angle, openDirections[i]));
            if (diff < bestDiff) {
                bestDiff = diff;
                bestAngle = openDirections[i];
            }
        }

        // If deflection is too sharp, stop ray
        const maxDeflectionRad = (CONSTS.SWELL_RAY.MAX_DEFLECTION * Math.PI) / 180;
        if (bestDiff > maxDeflectionRad) return null;

        return bestAngle;
    },

    /**
     * Calculate smallest difference between two angles (handles wraparound)
     * @param {number} a1 - First angle (radians)
     * @param {number} a2 - Second angle (radians)
     * @returns {number} Angle difference (radians)
     */
    angleDiff(a1, a2) {
        let diff = a2 - a1;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        return diff;
    },

    /**
     * Estimate significant wave height from storm parameters
     * Simplified fetch-limited wave height model
     * @param {Object} storm - Storm object with wind and radius
     * @returns {number} Wave height (meters)
     */
    estimateWaveHeight(storm) {
        const windSpeed_mps = storm.wind * CONSTS.KT_TO_MPS;
        const fetch_m = storm.radius * CONSTS.NM_TO_M;

        // Simplified fetch-limited wave height
        const Hs = 0.0016 * Math.sqrt(fetch_m) * windSpeed_mps;

        return Math.min(Hs, 20); // Cap at 20m
    },

    /**
     * Estimate wave period from storm parameters
     * @param {Object} storm - Storm object with wind speed
     * @returns {number} Wave period (seconds)
     */
    estimateWavePeriod(storm) {
        const windSpeed_mps = storm.wind * CONSTS.KT_TO_MPS;
        const Tp = 0.5 * windSpeed_mps;

        return Math.max(8, Math.min(Tp, 25)); // Range: 8-25 seconds
    },

    /**
     * Get swell color based on wave height (energy)
     * @param {number} waveHeight - Wave height (meters)
     * @returns {Object} Color object {r, g, b, alpha}
     */
    getSwellColor(waveHeight) {
        if (waveHeight < 3) {
            // Small waves: Light cyan
            return { r: 150, g: 220, b: 255, alpha: 0.25 };
        } else if (waveHeight < 6) {
            // Moderate waves: Light blue
            return { r: 100, g: 180, b: 255, alpha: 0.35 };
        } else if (waveHeight < 10) {
            // Large waves: Blue
            return { r: 70, g: 140, b: 240, alpha: 0.45 };
        } else {
            // Huge waves: Deep blue
            return { r: 40, g: 100, b: 200, alpha: 0.55 };
        }
    }
};
