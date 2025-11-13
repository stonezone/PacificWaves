/**
 * PHASE 5: Realistic Swell Ray Propagation
 * Complete implementation of drawSwell() and helper functions
 *
 * INSERT THIS CODE IN waves.html BETWEEN drawMap() AND drawWind() (around line 1855)
 */

/**
 * PHASE 5: Realistic Swell Ray Propagation
 * Draws swell rays emanating from each storm with:
 * - Ray tracing in multiple directions
 * - Land bending/refraction around obstacles
 * - Period growth (wider spacing with distance)
 * - Energy-based coloring and transparency
 */
drawSwell(ctx, w, h) {
    const { gridWidth, gridHeight, storms, staticGrid } = state;
    const cellW = w / gridWidth;
    const cellH = h / gridHeight;

    // Ray configuration
    const rayAngleStep = 15; // Emit ray every 15 degrees (24 rays per storm)
    const maxDistance = 150; // Maximum cells to propagate
    const stepSize = 1.5;    // Cells per step

    // Draw rays for each active storm
    storms.forEach(storm => {
        // Skip storms with very low wind (< 15 kts)
        if (storm.wind < 15) return;

        const { i: stormI, j: stormJ } = Utils.latLonToCell(storm.lat, storm.lon);
        const stormX = stormI * cellW;
        const stormY = stormJ * cellH;

        // Calculate wave energy from storm parameters
        const waveHeight = this.estimateWaveHeight(storm);
        const wavePeriod = this.estimateWavePeriod(storm);

        // Emit rays in all directions
        for (let angle = 0; angle < 360; angle += rayAngleStep) {
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
                maxDistance,
                stepSize
            );
        }
    });
},

/**
 * Trace a single swell ray from storm outward
 * Handles land collision, refraction, and period growth
 */
traceSwellRay(ctx, startX, startY, angle, waveHeight, wavePeriod, storm, cellW, cellH, maxDistance, stepSize) {
    const { gridWidth, gridHeight, staticGrid } = state;

    let x = startX;
    let y = startY;
    let currentAngle = angle;
    let distance = 0;

    const rayPoints = [];
    let energyDecay = 1.0; // Energy decreases with distance

    // Trace ray outward step by step
    while (distance < maxDistance) {
        // Convert to grid coordinates
        const i = Math.floor(x / cellW);
        const j = Math.floor(y / cellH);

        // Bounds check
        if (i < 0 || i >= gridWidth || j < 0 || j >= gridHeight) break;

        const idx = j * gridWidth + i;

        // Check for land collision
        if (staticGrid.isLand[idx] === 1) {
            // Calculate refraction around land
            const newAngle = this.calculateRefraction(i, j, currentAngle, cellW, cellH);

            // If refraction fails (dead end), stop ray
            if (newAngle === null) break;

            currentAngle = newAngle;

            // Energy loss when encountering land
            energyDecay *= 0.85;
            if (energyDecay < 0.1) break; // Ray too weak
        }

        // Record point for drawing
        rayPoints.push({
            x,
            y,
            distance,
            energy: energyDecay
        });

        // Move to next point
        const dx = Math.cos(currentAngle) * stepSize * cellW;
        const dy = Math.sin(currentAngle) * stepSize * cellH;
        x += dx;
        y += dy;
        distance += stepSize;

        // Natural energy decay with distance (spreading)
        energyDecay *= 0.997;
    }

    // Draw the ray as a line with period-based segmentation
    if (rayPoints.length > 2) {
        this.drawRayPath(ctx, rayPoints, waveHeight, wavePeriod, storm);
    }
},

/**
 * Draw ray path with realistic period growth and energy visualization
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
        // Start with tight spacing, grow to wider spacing
        const baseSpacing = 3;
        const growthFactor = Math.sqrt(point.distance / 50); // Gradual growth
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
    const finalAlpha = alpha * avgEnergy * 0.6; // Adjust opacity

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
 * Calculate refraction when ray hits land
 * Returns new angle or null if ray should stop
 */
calculateRefraction(i, j, angle, cellW, cellH) {
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
    if (left === 0) openDirections.push(Math.PI); // West
    if (right === 0) openDirections.push(0); // East
    if (up === 0) openDirections.push(-Math.PI / 2); // North
    if (down === 0) openDirections.push(Math.PI / 2); // South

    // Diagonals
    if (checkLand(-1, -1) === 0) openDirections.push(-3 * Math.PI / 4); // NW
    if (checkLand(1, -1) === 0) openDirections.push(-Math.PI / 4); // NE
    if (checkLand(-1, 1) === 0) openDirections.push(3 * Math.PI / 4); // SW
    if (checkLand(1, 1) === 0) openDirections.push(Math.PI / 4); // SE

    // No open directions - ray blocked
    if (openDirections.length === 0) return null;

    // Find direction closest to current angle (prefer continuing forward)
    let bestAngle = openDirections[0];
    let bestDiff = Math.abs(this.angleDiff(angle, bestAngle));

    for (let i = 1; i < openDirections.length; i++) {
        const diff = Math.abs(this.angleDiff(angle, openDirections[i]));
        if (diff < bestDiff) {
            bestDiff = diff;
            bestAngle = openDirections[i];
        }
    }

    // If deflection is too sharp (> 120 degrees), stop ray
    if (bestDiff > 2 * Math.PI / 3) return null;

    return bestAngle;
},

/**
 * Calculate smallest difference between two angles
 */
angleDiff(a1, a2) {
    let diff = a2 - a1;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return diff;
},

/**
 * Estimate wave height from storm parameters (simplified model)
 */
estimateWaveHeight(storm) {
    // Simplified significant wave height estimation
    // Based on wind speed and fetch (storm radius)
    const windSpeed_mps = storm.wind * CONSTS.KT_TO_MPS;
    const fetch_m = storm.radius * CONSTS.NM_TO_M;

    // Simplified fetch-limited wave height
    // Hs ≈ 0.0016 * sqrt(fetch) * windSpeed
    const Hs = 0.0016 * Math.sqrt(fetch_m) * windSpeed_mps;

    return Math.min(Hs, 20); // Cap at 20m (safety)
},

/**
 * Estimate wave period from storm parameters
 */
estimateWavePeriod(storm) {
    // Simplified period estimation
    // Larger storms and higher winds create longer period swells
    const windSpeed_mps = storm.wind * CONSTS.KT_TO_MPS;
    const Tp = 0.5 * windSpeed_mps; // Rough approximation

    return Math.max(8, Math.min(Tp, 25)); // Range: 8-25 seconds
},

/**
 * Get swell color based on wave height (energy)
 */
getSwellColor(waveHeight) {
    // Color gradient based on wave energy
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
},
