# PacificWaves UI Redesign - Implementation Guide

## Quick Start

This guide shows you how to integrate the new UI design into `waves.html`.

---

## Step 1: Add CSS Link

Add the new stylesheet to the `<head>` section of `waves.html`:

```html
<head>
    <!-- Existing styles -->
    <style>
        /* ... existing inline styles ... */
    </style>

    <!-- Add this line -->
    <link rel="stylesheet" href="css/improved-layout.css">
</head>
```

---

## Step 2: Add Status Bar

Replace the existing control bar with a top status bar. Find this section:

```html
<!-- OLD: Control bar at bottom -->
<div class="control-bar">
    <button id="playPauseButton">Play</button>
    <!-- ... -->
</div>
```

Replace with:

```html
<!-- NEW: Status bar at top -->
<div class="sim-status-bar">
    <div class="status-item">
        <div class="status-item-label">Simulation Time</div>
        <div class="status-item-value" id="statusTime">T+ 0.0 h</div>
    </div>

    <div class="status-divider"></div>

    <div class="status-item">
        <div class="status-item-label">Speed</div>
        <div class="status-item-value" id="statusSpeed">1.0x</div>
    </div>

    <div class="status-divider"></div>

    <div class="status-item">
        <div class="status-item-label">Active Storms</div>
        <div class="status-item-value" id="statusStormCount">0</div>
    </div>

    <div class="status-divider"></div>

    <div class="status-item">
        <div class="status-item-label">FPS</div>
        <div class="status-item-value" id="statusFPS">--</div>
    </div>

    <div style="margin-left: auto; display: flex; gap: 8px;">
        <button id="playPauseButton" class="btn-enhanced btn-primary">
            ▶ Play
        </button>
        <button id="stepButton" class="btn-enhanced">
            ⏭ Step
        </button>
        <button id="resetButton" class="btn-enhanced">
            🔄 Reset
        </button>
    </div>
</div>
```

---

## Step 3: Update Storms Tab

Find the storms tab content:

```html
<!-- OLD: Simple list -->
<section class="tab-content active" id="tab-storms">
    <h3>Storm Manager</h3>
    <div class="button-group">
        <button id="placeStormButton">Place Storm</button>
        <!-- ... -->
    </div>
    <ul id="stormList">
        <li class="empty">No storms active.</li>
    </ul>
    <div id="stormEditor">
        <!-- Form -->
    </div>
</section>
```

Replace with:

```html
<!-- NEW: Card-based layout -->
<section class="tab-content active" id="tab-storms">

    <!-- Section Header -->
    <div class="section-header">
        <h3>Storm Manager</h3>
        <span class="badge" id="stormCountBadge">0 Active</span>
    </div>

    <!-- Action Buttons -->
    <div class="button-group-enhanced">
        <button id="placeStormButton" class="btn-enhanced btn-primary">
            <span class="icon">➕</span>
            Place Storm
        </button>
        <button id="cloneStormButton" class="btn-enhanced">
            <span class="icon">📋</span>
            Clone
        </button>
        <button id="deleteStormButton" class="btn-enhanced btn-danger">
            <span class="icon">🗑️</span>
            Delete
        </button>
    </div>

    <!-- Storm Cards Container -->
    <div id="stormCardsContainer">
        <!-- JS will populate with storm cards -->
        <div class="empty-state">
            <div class="empty-state-icon">🌀</div>
            <div class="empty-state-title">No Active Storms</div>
            <div class="empty-state-description">
                Click "Place Storm" to add a storm system to the simulation.
            </div>
        </div>
    </div>

    <!-- Storm Editor (shown when storm selected) -->
    <div id="stormEditor" style="display: none;">
        <div class="section-subheader">Edit Selected Storm</div>

        <div class="info-card">
            <form id="stormEditorForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                        Storm Name
                    </label>
                    <input type="text" id="stormName" class="panel-input"
                           style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px;">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                            Latitude (°N)
                        </label>
                        <input type="number" id="stormLat" step="0.5" class="panel-input"
                               style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family-mono);">
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                            Longitude (°E)
                        </label>
                        <input type="number" id="stormLon" step="0.5" class="panel-input"
                               style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family-mono);">
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                            Max Wind (kts)
                        </label>
                        <input type="number" id="stormWind" step="5" class="panel-input"
                               style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family-mono);">
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                            Gale Radius (nm)
                        </label>
                        <input type="number" id="stormRadius" step="10" class="panel-input"
                               style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family-mono);">
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                            Heading (°)
                        </label>
                        <input type="number" id="stormHeading" step="5" class="panel-input"
                               style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family-mono);">
                    </div>

                    <div>
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; color: var(--text-dim); font-weight: 600;">
                            Speed (kts)
                        </label>
                        <input type="number" id="stormSpeed" step="1" class="panel-input"
                               style="width: 100%; padding: 10px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 6px; font-family: var(--font-family-mono);">
                    </div>
                </div>

                <button type="button" class="btn-enhanced btn-primary"
                        style="width: 100%; margin-top: 16px;"
                        onclick="App.applyStormEdits()">
                    Apply Changes
                </button>
            </form>
        </div>
    </div>

</section>
```

---

## Step 4: Update Sites Tab

Replace the sites tab content:

```html
<!-- NEW: Card-based measurements -->
<section class="tab-content" id="tab-sites">

    <div class="section-header">
        <h3>Site Monitor</h3>
        <span class="badge" style="background: var(--status-active);">Live</span>
    </div>

    <div class="section-subheader">Current Conditions</div>

    <!-- Site Measurements Container -->
    <div id="siteMeasurementsContainer">
        <!-- JS will populate with site measurement cards -->
    </div>

    <div class="section-subheader" style="margin-top: 32px;">
        Peak Forecast (Next 48h)
    </div>

    <!-- Peak Table -->
    <table class="table-enhanced" id="sitePeakTable">
        <thead>
            <tr>
                <th>Site</th>
                <th>Hs</th>
                <th>Tp</th>
                <th>Dir</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody id="sitePeakTableBody">
            <!-- JS will populate -->
        </tbody>
    </table>

    <div class="section-subheader">Nearshore Breaking</div>

    <!-- Breaking Wave Cards -->
    <div id="breakingWavesContainer">
        <!-- JS will populate with breaking wave cards -->
    </div>

</section>
```

---

## Step 5: Update JavaScript Rendering

Add these functions to your JavaScript (inside the `<script>` tag):

### A. Storm Card Rendering

```javascript
// Add to your UI module or create new section
const UIEnhanced = {

    // Create a storm card element
    createStormCard(storm) {
        const isActive = storm.lifetime > 0;
        const statusClass = isActive ? 'active' : 'dissipating';
        const statusText = isActive ? 'Active' : 'Dissipating';

        // Cardinal direction from heading
        const cardinalDir = this.headingToCardinal(storm.heading);

        const card = document.createElement('div');
        card.className = 'storm-card';
        card.dataset.stormId = storm.id;

        card.innerHTML = `
            <div class="storm-card-header">
                <h4 class="storm-name">${storm.name || 'Storm ' + storm.id}</h4>
                <div class="storm-status ${statusClass}">
                    <span class="storm-status-dot"></span>
                    ${statusText}
                </div>
            </div>

            <div class="storm-stats">
                <div class="storm-stat">
                    <div class="storm-stat-label">Wind Speed</div>
                    <div class="storm-stat-value">
                        ${storm.maxWind} <span class="unit">kts</span>
                    </div>
                </div>

                <div class="storm-stat">
                    <div class="storm-stat-label">Position</div>
                    <div class="storm-stat-value">
                        ${storm.lat.toFixed(1)}°N ${storm.lon.toFixed(1)}°E
                    </div>
                </div>

                <div class="storm-stat">
                    <div class="storm-stat-label">Direction</div>
                    <div class="storm-stat-value">
                        ${cardinalDir} <span class="unit">(${storm.heading}°)</span>
                    </div>
                </div>

                <div class="storm-stat">
                    <div class="storm-stat-label">Radius</div>
                    <div class="storm-stat-value">
                        ${storm.galeRadius} <span class="unit">nm</span>
                    </div>
                </div>
            </div>

            <div class="storm-card-actions">
                <button class="storm-action-btn" onclick="UIEnhanced.editStorm(${storm.id})">
                    ✏️ Edit
                </button>
                <button class="storm-action-btn" onclick="UIEnhanced.locateStorm(${storm.id})">
                    📍 Locate
                </button>
                <button class="storm-action-btn" onclick="UIEnhanced.cloneStorm(${storm.id})">
                    📋 Clone
                </button>
            </div>
        `;

        // Click to select
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.selectStorm(storm.id);
            }
        });

        return card;
    },

    // Update storm cards display
    updateStormCards() {
        const container = document.getElementById('stormCardsContainer');
        const storms = App.storms || []; // Adjust to your storm array

        // Clear container
        container.innerHTML = '';

        if (storms.length === 0) {
            // Show empty state
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🌀</div>
                    <div class="empty-state-title">No Active Storms</div>
                    <div class="empty-state-description">
                        Click "Place Storm" to add a storm system to the simulation.
                    </div>
                </div>
            `;
            return;
        }

        // Create and append storm cards
        storms.forEach(storm => {
            const card = this.createStormCard(storm);
            if (App.selectedStormId === storm.id) {
                card.classList.add('selected');
            }
            container.appendChild(card);
        });

        // Update badge
        document.getElementById('stormCountBadge').textContent =
            `${storms.length} Active`;
        document.getElementById('statusStormCount').textContent =
            storms.length;
    },

    // Helper: Convert heading to cardinal direction
    headingToCardinal(heading) {
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(heading / 45) % 8;
        return dirs[index];
    },

    // Select a storm
    selectStorm(stormId) {
        App.selectedStormId = stormId;

        // Update card selection states
        document.querySelectorAll('.storm-card').forEach(card => {
            if (parseInt(card.dataset.stormId) === stormId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Show and populate editor
        const storm = App.storms.find(s => s.id === stormId);
        if (storm) {
            document.getElementById('stormEditor').style.display = 'block';
            document.getElementById('stormName').value = storm.name || '';
            document.getElementById('stormLat').value = storm.lat;
            document.getElementById('stormLon').value = storm.lon;
            document.getElementById('stormWind').value = storm.maxWind;
            document.getElementById('stormRadius').value = storm.galeRadius;
            document.getElementById('stormHeading').value = storm.heading;
            document.getElementById('stormSpeed').value = storm.speed;
        }
    },

    // Storm actions
    editStorm(stormId) {
        this.selectStorm(stormId);
        // Scroll editor into view
        document.getElementById('stormEditor').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    },

    locateStorm(stormId) {
        // Center canvas on storm
        const storm = App.storms.find(s => s.id === stormId);
        if (storm) {
            // Implement canvas centering logic
            console.log('Centering on storm:', storm);
        }
    },

    cloneStorm(stormId) {
        // Clone storm logic
        const storm = App.storms.find(s => s.id === stormId);
        if (storm) {
            // Implement cloning
            console.log('Cloning storm:', storm);
        }
    }
};
```

### B. Site Measurement Rendering

```javascript
// Add to UIEnhanced object
UIEnhanced.createSiteMeasurement = function(site, data) {
    const trend = this.calculateTrend(data);
    const trendIcon = trend > 0 ? '↗' : trend < 0 ? '↘' : '→';
    const trendClass = trend > 0 ? 'rising' : trend < 0 ? 'falling' : '';

    const progressPercent = (data.currentHs / data.peakHs) * 100;

    const div = document.createElement('div');
    div.className = 'site-measurement';

    div.innerHTML = `
        <div class="site-header">
            <span class="site-name">${site.name}</span>
            <span class="site-trend ${trendClass}">${trendIcon}</span>
        </div>

        <div class="site-metrics">
            <div class="metric">
                <div class="metric-value">${data.currentHs.toFixed(1)}m</div>
                <div class="metric-label">Height</div>
            </div>

            <div class="metric">
                <div class="metric-value">${data.currentTp.toFixed(0)}s</div>
                <div class="metric-label">Period</div>
            </div>

            <div class="metric">
                <div class="metric-value">${data.currentDir}°</div>
                <div class="metric-label">Direction</div>
            </div>
        </div>

        <div style="margin-top: 12px;">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%; background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-dim); margin-top: 4px;">
                <span>0m</span>
                <span>Peak: ${data.peakHs.toFixed(1)}m @ T+${data.peakTime}h</span>
                <span>8m</span>
            </div>
        </div>
    `;

    return div;
};

UIEnhanced.updateSiteMeasurements = function() {
    const container = document.getElementById('siteMeasurementsContainer');
    container.innerHTML = '';

    // Get site data (adjust to your data structure)
    const sites = [
        { name: 'Oahu North Shore', id: 'oahu' },
        { name: 'Kauai North', id: 'kauai' },
        { name: 'Maui North', id: 'maui' }
    ];

    sites.forEach(site => {
        const data = this.getSiteData(site.id); // Your data function
        const card = this.createSiteMeasurement(site, data);
        container.appendChild(card);
    });
};

UIEnhanced.calculateTrend = function(data) {
    // Compare current to previous measurement
    // Return: 1 (rising), -1 (falling), 0 (steady)
    return data.currentHs > data.previousHs ? 1 :
           data.currentHs < data.previousHs ? -1 : 0;
};
```

### C. Status Bar Updates

```javascript
// Add to your main loop or update function
UIEnhanced.updateStatusBar = function() {
    // Update time
    document.getElementById('statusTime').textContent =
        `T+ ${App.simTime.toFixed(1)} h`;

    // Update speed
    document.getElementById('statusSpeed').textContent =
        `${App.timeMultiplier.toFixed(1)}x`;

    // Update storm count
    document.getElementById('statusStormCount').textContent =
        App.storms.length;

    // Update FPS
    document.getElementById('statusFPS').textContent =
        Math.round(App.currentFPS);
};

// Call in your main loop
function mainLoop() {
    // ... existing code ...

    UIEnhanced.updateStatusBar();
    UIEnhanced.updateStormCards();
    UIEnhanced.updateSiteMeasurements();

    // ... existing code ...
}
```

---

## Step 6: Wire Up Event Handlers

Add these event listeners on page load:

```javascript
// In your initialization code
document.addEventListener('DOMContentLoaded', () => {

    // Place storm button
    document.getElementById('placeStormButton').addEventListener('click', () => {
        App.startPlacingStorm();
    });

    // Clone storm button
    document.getElementById('cloneStormButton').addEventListener('click', () => {
        if (App.selectedStormId !== null) {
            UIEnhanced.cloneStorm(App.selectedStormId);
        }
    });

    // Delete storm button
    document.getElementById('deleteStormButton').addEventListener('click', () => {
        if (App.selectedStormId !== null) {
            if (confirm('Delete this storm?')) {
                App.deleteStorm(App.selectedStormId);
                UIEnhanced.updateStormCards();
            }
        }
    });

    // Play/Pause button
    document.getElementById('playPauseButton').addEventListener('click', () => {
        App.togglePlayPause();
        const btn = document.getElementById('playPauseButton');
        btn.textContent = App.isPlaying ? '⏸ Pause' : '▶ Play';
    });

    // Step button
    document.getElementById('stepButton').addEventListener('click', () => {
        App.stepSimulation();
    });

    // Reset button
    document.getElementById('resetButton').addEventListener('click', () => {
        if (confirm('Reset simulation?')) {
            App.reset();
        }
    });

    // Initial render
    UIEnhanced.updateStormCards();
    UIEnhanced.updateSiteMeasurements();
    UIEnhanced.updateStatusBar();
});
```

---

## Step 7: Testing

### Visual Testing

1. Open `waves.html` in browser
2. Check that new CSS loads (inspect DevTools → Network)
3. Verify spacing looks correct
4. Test hover effects on cards
5. Check that colors match design

### Functional Testing

1. **Add Storm**: Click "Place Storm" → Click canvas → Card appears
2. **Select Storm**: Click card → Border turns blue
3. **Edit Storm**: Edit values → Changes apply
4. **Delete Storm**: Select → Delete → Card removed
5. **Site Updates**: Play simulation → Measurements update
6. **Status Bar**: Verify time, speed, count update

### Responsive Testing

1. Resize browser window
2. Check mobile breakpoint (< 768px)
3. Verify side panel stacks correctly
4. Test on actual mobile device

---

## Step 8: Optional Enhancements

### Add Animations

```javascript
// Animate card entrance
UIEnhanced.createStormCard = function(storm) {
    const card = // ... existing code ...

    // Add entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';

    setTimeout(() => {
        card.style.transition = 'all 0.3s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 10);

    return card;
};
```

### Add Tooltips

```html
<!-- Add to buttons -->
<button class="storm-action-btn"
        data-tooltip-enhanced="Center map on storm location"
        onclick="UIEnhanced.locateStorm(...)">
    📍 Locate
</button>
```

### Add Loading States

```javascript
UIEnhanced.showLoading = function(elementId) {
    const el = document.getElementById(elementId);
    el.innerHTML = `
        <div style="text-align: center; padding: 48px; color: var(--text-dim);">
            <div class="loading-spinner" style="margin: 0 auto 16px;"></div>
            Loading...
        </div>
    `;
};
```

---

## Troubleshooting

### CSS Not Loading

**Problem**: New styles don't appear

**Solutions**:
1. Check file path: `css/improved-layout.css`
2. Clear browser cache (Cmd+Shift+R / Ctrl+F5)
3. Check DevTools → Console for errors
4. Verify CSS file exists and has content

### Cards Not Appearing

**Problem**: Storm cards container is empty

**Solutions**:
1. Check that `UIEnhanced.updateStormCards()` is called
2. Verify `App.storms` array has data
3. Check browser console for JS errors
4. Test with mock data:

```javascript
// Temporary test
App.storms = [{
    id: 1,
    name: 'Test Storm',
    lat: 45,
    lon: 180,
    maxWind: 45,
    galeRadius: 300,
    heading: 135,
    speed: 15,
    lifetime: 48
}];
UIEnhanced.updateStormCards();
```

### Status Bar Not Updating

**Problem**: Values remain static

**Solutions**:
1. Verify `updateStatusBar()` is called in main loop
2. Check that element IDs match: `statusTime`, `statusSpeed`, etc.
3. Ensure `App.simTime` and other values exist
4. Add console.log to verify function runs

### Layout Issues

**Problem**: Cards too wide, overlapping, etc.

**Solutions**:
1. Check parent container has proper width
2. Verify no conflicting CSS rules (DevTools → Computed)
3. Test with CSS `!important` to isolate conflicts
4. Check browser compatibility (use latest Chrome/Firefox)

---

## Performance Optimization

### Reduce Redraws

Only update DOM when values change:

```javascript
UIEnhanced.updateStatusBar = function() {
    const newTime = `T+ ${App.simTime.toFixed(1)} h`;
    const timeEl = document.getElementById('statusTime');

    // Only update if changed
    if (timeEl.textContent !== newTime) {
        timeEl.textContent = newTime;
    }

    // Same for other values...
};
```

### Batch Updates

Use `requestAnimationFrame` for smooth updates:

```javascript
let rafId = null;

UIEnhanced.scheduleUpdate = function() {
    if (rafId) return; // Already scheduled

    rafId = requestAnimationFrame(() => {
        this.updateStormCards();
        this.updateSiteMeasurements();
        this.updateStatusBar();
        rafId = null;
    });
};
```

### Virtualize Long Lists

If you have many storms, only render visible ones:

```javascript
// For advanced users only
UIEnhanced.renderVisibleStorms = function() {
    const container = document.getElementById('stormCardsContainer');
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;

    const cardHeight = 200; // Approximate
    const startIndex = Math.floor(scrollTop / cardHeight);
    const endIndex = Math.ceil((scrollTop + viewportHeight) / cardHeight);

    // Only render storms in view
    const visibleStorms = App.storms.slice(startIndex, endIndex);
    // ... render only these ...
};
```

---

## Next Steps

1. **Implement in waves.html**: Follow steps 1-6
2. **Test thoroughly**: Check all interactions
3. **Iterate on design**: Adjust spacing/colors to your preference
4. **Add features**: Forecast charts, storm tracks, etc.
5. **Get feedback**: Show to users and refine

---

## Reference Files

- **CSS**: `/css/improved-layout.css`
- **Examples**:
  - `/UI_LAYOUT_REDESIGN.html` (Storms tab)
  - `/UI_SITES_TAB_EXAMPLE.html` (Sites tab)
- **Documentation**:
  - `/UI_REDESIGN_DOCUMENTATION.md` (Full specs)
  - `/UI_BEFORE_AFTER_COMPARISON.md` (Visual comparison)

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Review the example HTML files
3. Test with simplified data first
4. Compare your code to the examples

**Good luck with your implementation!**
