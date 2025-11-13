# PacificWaves - Implementation TODO
**Created**: 2025-11-11
**Strategy**: Path C - Code Quality First
**Approach**: Phased implementation with agent supervision

---

## 🚫 STOP CONDITIONS - Require User Approval

Before proceeding, STOP and ask user if:
- ❌ Major architecture changes not in this TODO
- ❌ Creating monolithic code (>500 lines in one file)
- ❌ Implementing new features not discussed
- ❌ Changing core physics algorithms
- ❌ Deleting existing functionality

---

## 📋 Overview

### Implementation Phases
1. **Code Refactoring & Architecture** (Foundation)
2. **Asset Generation & Graphics System** (Visual Infrastructure)
3. **Map & Visualization** (Core Graphics)
4. **Interactive Features** (Gameplay)
5. **Polish & Performance** (Optimization)

### Git Strategy
- Commit at end of each phase
- Push to remote after successful testing
- Feature branches for major changes
- Main branch always deployable

---

## PHASE 1: Code Refactoring & Architecture
**Goal**: Transform monolithic `waves.html` into modular, maintainable codebase
**Agent Lead**: `backend-architect`, `javascript-pro`
**Review**: `code-reviewer`, `architectural-overseer`

### 1.1 Architecture Design
**Agent**: `backend-architect`

- [ ] **Design modular file structure** (30 min)
  ```
  PacificWaves/
  ├── index.html (minimal, loads modules)
  ├── css/
  │   └── styles.css
  ├── js/
  │   ├── config.js (CONSTS, physics constants)
  │   ├── utils/
  │   │   ├── prng.js (PRNG class)
  │   │   └── helpers.js (utility functions)
  │   ├── core/
  │   │   ├── state.js (global state management)
  │   │   ├── simulation.js (Sim module)
  │   │   └── gameLoop.js (MainLoop)
  │   ├── rendering/
  │   │   ├── renderer.js (Render module, canvas)
  │   │   ├── spriteLoader.js (NEW - sprite management)
  │   │   └── effects.js (NEW - animations, ripples)
  │   ├── ui/
  │   │   ├── controls.js (UI module)
  │   │   └── spotMarkers.js (NEW - surf spot interactions)
  │   ├── features/
  │   │   ├── saveLoad.js (NEW - localStorage + JSON)
  │   │   ├── historical.js (NEW - preset storms)
  │   │   └── zoom.js (NEW - zoom controls)
  │   └── main.js (App init, orchestration)
  ├── assets/
  │   ├── sprites/
  │   ├── tiles/
  │   └── generated/ (output from image gen script)
  └── data/
      └── historicalStorms.json (storm presets)
  ```

- [ ] **Document module responsibilities** (15 min)
  - Create `docs/ARCHITECTURE.md` explaining:
    - Module boundaries
    - Data flow
    - Import/export conventions
    - State management strategy

- [ ] **Create migration checklist** (15 min)
  - Line-by-line extraction plan for waves.html
  - Dependency mapping (which modules import what)
  - Testing checkpoints

**Deliverable**: Architecture design document, file structure plan
**⚠️ CHECKPOINT**: User review architecture before proceeding

### 1.2 Extract CSS
**Agent**: `frontend-developer`

- [ ] **Move CSS to separate file** (30 min)
  - Extract lines 7-684 from `waves.html`
  - Create `css/styles.css`
  - Link in `index.html`: `<link rel="stylesheet" href="css/styles.css">`
  - Test: Verify no visual changes

- [ ] **Organize CSS sections** (15 min)
  - Add section comments (Variables, Layout, Controls, Responsive)
  - Consider splitting into multiple files if >500 lines

**Test**: Open in browser, verify identical appearance
**Commit**: `refactor: Extract CSS to separate file`

### 1.3 Create Base HTML
**Agent**: `frontend-developer`

- [ ] **Create minimal index.html** (20 min)
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="Interactive North Pacific swell simulation for O'ahu's North Shore">
      <title>North Shore Swell Lab</title>
      <link rel="stylesheet" href="css/styles.css">
  </head>
  <body>
      <!-- Copy HTML structure from waves.html lines 685-964 -->
      <div class="app-container" role="application" aria-label="North Shore Swell Lab">
          <!-- Loading, canvas, controls -->
      </div>

      <script type="module" src="js/main.js"></script>
  </body>
  </html>
  ```

**Test**: Page loads, shows UI (no functionality yet)
**Commit**: `refactor: Create modular HTML structure`

### 1.4 Extract Core Modules
**Agent**: `javascript-pro`

**1.4.1 Config Module** (20 min)
- [ ] Create `js/config.js`
  - Extract `CONSTS` object (lines 968-1002)
  - Add `export const CONSTS = { ... }`
  - Test: Import in console

**1.4.2 PRNG Utility** (15 min)
- [ ] Create `js/utils/prng.js`
  - Extract `PRNG` class (lines 1005-1035)
  - Add `export class PRNG { ... }`

**1.4.3 State Management** (20 min)
- [ ] Create `js/core/state.js`
  - Extract global `state` object (line 1038)
  - Create `StateManager` class with getters/setters
  - Export singleton instance
  ```javascript
  class StateManager {
      constructor() {
          this.state = { initialized: false };
      }
      get(key) { return this.state[key]; }
      set(key, value) { this.state[key] = value; }
      getAll() { return this.state; }
  }
  export const stateManager = new StateManager();
  ```

**1.4.4 Simulation Core** (45 min)
- [ ] Create `js/core/simulation.js`
  - Extract `Sim` object (lines 1041-1500+)
  - Import dependencies (PRNG, state, config)
  - Export `Sim` object
  - ⚠️ **DO NOT MODIFY PHYSICS LOGIC** (just move it)

**1.4.5 Renderer** (30 min)
- [ ] Create `js/rendering/renderer.js`
  - Extract `Render` object
  - Import dependencies
  - Export `Render` object

**1.4.6 UI Controls** (30 min)
- [ ] Create `js/ui/controls.js`
  - Extract `UI` object
  - Import dependencies
  - Export `UI` object

**1.4.7 Game Loop** (20 min)
- [ ] Create `js/core/gameLoop.js`
  - Extract `MainLoop` object
  - Export `MainLoop` object

**1.4.8 Main Orchestration** (30 min)
- [ ] Create `js/main.js`
  - Extract `App` object and initialization
  - Import all modules
  - Wire up initialization sequence
  ```javascript
  import { CONSTS } from './config.js';
  import { PRNG } from './utils/prng.js';
  import { stateManager } from './core/state.js';
  import { Sim } from './core/simulation.js';
  import { Render } from './rendering/renderer.js';
  import { UI } from './ui/controls.js';
  import { MainLoop } from './core/gameLoop.js';

  const App = {
      init() { /* existing init code */ }
  };

  document.addEventListener('DOMContentLoaded', () => App.init());
  ```

**Test After Each Module**:
- Import in browser console
- Verify no errors
- Check functionality unchanged

**Commit**: `refactor: Extract JavaScript into ES6 modules`

### 1.5 Code Review & Testing
**Agent**: `code-reviewer`

- [ ] **Review all extracted modules** (1 hour)
  - Check import/export consistency
  - Verify no circular dependencies
  - Ensure physics logic unchanged
  - Check for console errors
  - Test all existing functionality:
    - Storm placement
    - Simulation run/pause
    - Time controls
    - Reset button

- [ ] **Performance baseline** (30 min)
  - Measure FPS with DevTools
  - Profile canvas rendering
  - Document baseline metrics in `docs/PERFORMANCE.md`

**Agent**: `architectural-overseer`
- [ ] **Architecture compliance check** (30 min)
  - Verify structure matches design
  - Check module sizes (<500 lines each)
  - Validate separation of concerns

**Deliverable**: Working modular codebase, identical functionality
**Git**: Push to remote: `git push origin master`
**⏸️ PAUSE**: User testing and approval before Phase 2

---

## PHASE 2: Asset Generation & Graphics System
**Goal**: Generate pixel art assets, build sprite loading system
**Agent Lead**: `frontend-developer`, `ai-engineer` (for image prompts)

### 2.1 Asset Planning
**Agent**: `ui-ux-designer` (for visual design)

- [ ] **Define asset list** (30 min)
  ```
  Required Assets:
  1. Ocean tile (16x16px) - seamless water texture
  2. Deep ocean tile (16x16px) - darker blue
  3. Land tiles:
     - Coastline variations (4-8 tiles)
     - Interior land (grass/mountain)
  4. Storm sprites:
     - Weak (32x32px)
     - Moderate (48x48px)
     - Strong (64x64px)
     - Each with 4 rotation frames
  5. Wave propagation effect (32x32px, 4 animation frames)
  6. Island sprites:
     - O'ahu (oversized, ~128x96px)
     - Kauai (normal, ~32x24px)
     - Other islands (16x16px each)
  7. Surf spot markers (16x16px, 3 types)
  8. Shadow overlay (32x32px, semi-transparent)
  9. UI elements:
     - Zoom buttons (32x32px)
     - Play/pause icons
  ```

- [ ] **Create color palette** (15 min)
  - Ocean blues: #0a2463, #1e3a8a, #3b82f6, #60a5fa, #93c5fd
  - Land greens: #166534, #22c55e, #86efac
  - Land browns: #78350f, #a16207, #d97706
  - Storm reds: #7f1d1d, #dc2626, #f87171
  - UI grays: #1f2937, #374151, #6b7280, #d1d5db
  - Document in `assets/COLOR_PALETTE.md`

### 2.2 Generate Assets with Image Script
**Agent**: `ai-engineer` (craft prompts), User (run script)

**Instructions for User**:
For each asset, run:
```bash
cd /Users/zackjordan/code/PacificWaves
python openai_image_generator_api.py --prompt "[PROMPT]" --size 1024x1024
# Image saved to current directory as .bmp
mv generated_image.bmp assets/generated/[asset_name].bmp
```

**Prompts to Use**:

- [ ] **Ocean Tile** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "seamless tileable 16x16 pixel art ocean water texture, deep blue, gentle waves, retro game aesthetic, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/ocean_tile.bmp`

- [ ] **Deep Ocean Tile** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "seamless tileable 16x16 pixel art dark deep ocean water texture, navy blue, abyssal, retro game aesthetic, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/deep_ocean_tile.bmp`

- [ ] **Coastline Land** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "16x16 pixel art coastal land tiles, green grass, brown mountains, sandy beaches, retro game style, tileable edges, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/land_tiles.bmp`

- [ ] **Storm Sprites - Weak** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "32x32 pixel art cyclone storm icon, small weak storm, gentle spiral, light red orange, transparent background, retro game, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/storm_weak.bmp`

- [ ] **Storm Sprites - Moderate** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "48x48 pixel art cyclone storm icon, moderate storm, distinct spiral, bright red orange, transparent background, retro game, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/storm_moderate.bmp`

- [ ] **Storm Sprites - Strong** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "64x64 pixel art cyclone storm icon, massive powerful storm, dramatic spiral, intense red, transparent background, retro game, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/storm_strong.bmp`

- [ ] **Wave Propagation Effect** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "32x32 pixel art animated wave ripple effect, concentric circles, blue gradient, 4 animation frames, transparent background, retro game" \
    --size 1024x1536
  ```
  Save as: `assets/generated/wave_ripple.bmp`

- [ ] **O'ahu Island** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "128x96 pixel art Hawaiian island Oahu, green mountains, north shore coastline visible, oversized detailed, retro game style, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/oahu_island.bmp`

- [ ] **Kauai Island** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "32x24 pixel art Hawaiian island Kauai, green circular island, simple detail, retro game style, top-down view" \
    --size 1024x1024
  ```
  Save as: `assets/generated/kauai_island.bmp`

- [ ] **Surf Spot Marker** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "16x16 pixel art surf spot marker icon, yellow star or flag, bright visible, retro game style, transparent background" \
    --size 1024x1024
  ```
  Save as: `assets/generated/surf_marker.bmp`

- [ ] **Swell Shadow Overlay** (USER ACTION REQUIRED)
  ```bash
  python openai_image_generator_api.py \
    --prompt "32x32 pixel art semi-transparent shadow overlay, dark gray, 50% opacity, for blocking swell behind island, retro game" \
    --size 1024x1024
  ```
  Save as: `assets/generated/swell_shadow.bmp`

**Total**: 11 images to generate
**Time Estimate**: 15-20 minutes (user task)

### 2.3 Process Generated Assets
**Agent**: `frontend-developer`

**Install Image Processing Tool** (one-time setup):
```bash
# Option 1: ImageMagick (recommended)
brew install imagemagick

# Option 2: Sharp (Node.js)
npm install -g sharp-cli
```

- [ ] **Convert BMP to PNG** (automated script)
  Create `scripts/convert_assets.sh`:
  ```bash
  #!/bin/bash
  mkdir -p assets/sprites
  mkdir -p assets/tiles

  # Convert and resize tiles to 16x16
  magick assets/generated/ocean_tile.bmp -resize 16x16 assets/tiles/ocean.png
  magick assets/generated/deep_ocean_tile.bmp -resize 16x16 assets/tiles/deep_ocean.png

  # Process land tiles (extract from sheet)
  magick assets/generated/land_tiles.bmp -crop 16x16 assets/tiles/land_%d.png

  # Convert storm sprites
  magick assets/generated/storm_weak.bmp -resize 32x32 assets/sprites/storm_weak.png
  magick assets/generated/storm_moderate.bmp -resize 48x48 assets/sprites/storm_moderate.png
  magick assets/generated/storm_strong.bmp -resize 64x64 assets/sprites/storm_strong.png

  # Wave animation (extract frames)
  magick assets/generated/wave_ripple.bmp -crop 32x32 assets/sprites/wave_%d.png

  # Islands
  magick assets/generated/oahu_island.bmp -resize 128x96 assets/sprites/oahu.png
  magick assets/generated/kauai_island.bmp -resize 32x24 assets/sprites/kauai.png

  # Markers and overlays
  magick assets/generated/surf_marker.bmp -resize 16x16 assets/sprites/marker.png
  magick assets/generated/swell_shadow.bmp -resize 32x32 assets/sprites/shadow.png

  echo "Asset conversion complete!"
  ```

  Run: `chmod +x scripts/convert_assets.sh && ./scripts/convert_assets.sh`

- [ ] **Verify asset quality** (manual check)
  - Open each PNG in preview
  - Check transparency works
  - Verify pixel art crisp (no blur)
  - Document any issues in TODO.md

**Commit**: `assets: Add generated sprite and tile assets`

### 2.4 Build Sprite Loading System
**Agent**: `javascript-pro`

- [ ] **Create SpriteLoader class** (1 hour)
  Create `js/rendering/spriteLoader.js`:
  ```javascript
  export class SpriteLoader {
      constructor() {
          this.sprites = {};
          this.loaded = false;
          this.loadProgress = 0;
      }

      async loadSprite(name, path) {
          return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                  this.sprites[name] = img;
                  resolve(img);
              };
              img.onerror = reject;
              img.src = path;
          });
      }

      async loadAll() {
          const assets = [
              { name: 'ocean', path: 'assets/tiles/ocean.png' },
              { name: 'deepOcean', path: 'assets/tiles/deep_ocean.png' },
              { name: 'land', path: 'assets/tiles/land_0.png' },
              { name: 'stormWeak', path: 'assets/sprites/storm_weak.png' },
              { name: 'stormModerate', path: 'assets/sprites/storm_moderate.png' },
              { name: 'stormStrong', path: 'assets/sprites/storm_strong.png' },
              { name: 'wave1', path: 'assets/sprites/wave_0.png' },
              { name: 'wave2', path: 'assets/sprites/wave_1.png' },
              { name: 'wave3', path: 'assets/sprites/wave_2.png' },
              { name: 'wave4', path: 'assets/sprites/wave_3.png' },
              { name: 'oahu', path: 'assets/sprites/oahu.png' },
              { name: 'kauai', path: 'assets/sprites/kauai.png' },
              { name: 'marker', path: 'assets/sprites/marker.png' },
              { name: 'shadow', path: 'assets/sprites/shadow.png' },
          ];

          const total = assets.length;
          const promises = assets.map((asset, i) =>
              this.loadSprite(asset.name, asset.path).then(() => {
                  this.loadProgress = ((i + 1) / total) * 100;
              })
          );

          await Promise.all(promises);
          this.loaded = true;
          console.log('All sprites loaded!');
      }

      get(name) {
          if (!this.sprites[name]) {
              console.warn(`Sprite "${name}" not found`);
              return null;
          }
          return this.sprites[name];
      }
  }

  export const spriteLoader = new SpriteLoader();
  ```

- [ ] **Integrate sprite loader into App init** (30 min)
  Update `js/main.js`:
  ```javascript
  import { spriteLoader } from './rendering/spriteLoader.js';

  const App = {
      async init() {
          try {
              // Show loading indicator
              document.getElementById('loadingIndicator')?.classList.add('active');

              // Load sprites FIRST
              await spriteLoader.loadAll();

              // Then initialize everything else
              const canvas = document.getElementById('simCanvas');
              if (!canvas) throw new Error('Canvas not found');

              Sim.init(seedStr);
              Render.init(canvas);
              UI.init();

              // Hide loading indicator
              document.getElementById('loadingIndicator')?.classList.remove('active');

              MainLoop.run();
          } catch (error) {
              console.error('Initialization failed:', error);
          }
      }
  };
  ```

**Test**: Sprites load without errors
**Commit**: `feat: Add sprite loading system`

**⏸️ PAUSE**: Phase 2 complete, review before Phase 3

---

## PHASE 3: Map & Visualization
**Goal**: Render Pacific Ocean map with continents, islands, storms, waves
**Agent Lead**: `frontend-developer`, `javascript-pro`

### 3.1 Tile-Based Ocean Rendering
**Agent**: `frontend-developer`

- [ ] **Create TileRenderer class** (1 hour)
  Create `js/rendering/tileRenderer.js`:
  ```javascript
  import { spriteLoader } from './spriteLoader.js';
  import { CONSTS } from '../config.js';

  export class TileRenderer {
      constructor(ctx) {
          this.ctx = ctx;
          this.tileSize = 16; // pixels per tile
      }

      // Determine which tile to use based on lat/lon
      getTileType(lat, lon) {
          // Check if land (use CONSTS.LAND_POLYGONS)
          if (this.isLand(lat, lon)) return 'land';

          // Check ocean depth (deeper = darker)
          const depth = this.getOceanDepth(lat, lon);
          if (depth > 3000) return 'deepOcean';
          return 'ocean';
      }

      isLand(lat, lon) {
          // Check if point inside any land polygon
          for (const [name, polygon] of Object.entries(CONSTS.LAND_POLYGONS)) {
              if (this.pointInPolygon(lat, lon, polygon)) return true;
          }
          return false;
      }

      pointInPolygon(lat, lon, polygon) {
          // Ray-casting algorithm
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
              const [lat1, lon1] = polygon[i];
              const [lat2, lon2] = polygon[j];

              if ((lon1 > lon) !== (lon2 > lon) &&
                  lat < (lat2 - lat1) * (lon - lon1) / (lon2 - lon1) + lat1) {
                  inside = !inside;
              }
          }
          return inside;
      }

      getOceanDepth(lat, lon) {
          // Simplified: deeper in middle of Pacific
          const centerLat = (CONSTS.MAP_LAT_MIN + CONSTS.MAP_LAT_MAX) / 2;
          const centerLon = (CONSTS.MAP_LON_EAST_EDGE + CONSTS.MAP_LON_WEST_EDGE) / 2;
          const distFromCenter = Math.sqrt(
              Math.pow(lat - centerLat, 2) + Math.pow(lon - centerLon, 2)
          );
          return 1000 + distFromCenter * 50; // meters
      }

      renderTiles(gridWidth, gridHeight) {
          for (let y = 0; y < gridHeight; y++) {
              for (let x = 0; x < gridWidth; x++) {
                  // Convert grid to lat/lon
                  const lat = CONSTS.MAP_LAT_MIN +
                      (y / gridHeight) * (CONSTS.MAP_LAT_MAX - CONSTS.MAP_LAT_MIN);
                  const lon = CONSTS.MAP_LON_EAST_EDGE +
                      (x / gridWidth) * (CONSTS.MAP_LON_WEST_EDGE - CONSTS.MAP_LON_EAST_EDGE);

                  const tileType = this.getTileType(lat, lon);
                  const sprite = spriteLoader.get(tileType);

                  if (sprite) {
                      this.ctx.drawImage(
                          sprite,
                          x * this.tileSize,
                          y * this.tileSize,
                          this.tileSize,
                          this.tileSize
                      );
                  }
              }
          }
      }
  }
  ```

- [ ] **Integrate into main Render module** (30 min)
  Update `js/rendering/renderer.js`:
  ```javascript
  import { TileRenderer } from './tileRenderer.js';

  const Render = {
      init(canvas) {
          this.canvas = canvas;
          this.ctx = canvas.getContext('2d');
          this.tileRenderer = new TileRenderer(this.ctx);
          // ... existing init code
      },

      render() {
          // Clear canvas
          this.ctx.fillStyle = '#0a0f14';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

          // Render tile-based background
          this.tileRenderer.renderTiles(state.gridWidth, state.gridHeight);

          // ... render storms, waves, etc
      }
  };
  ```

**Test**: Ocean tiles render properly
**Commit**: `feat: Add tile-based ocean rendering`

### 3.2 Custom Island Rendering (O'ahu Oversized)
**Agent**: `frontend-developer`

- [ ] **Create IslandRenderer class** (1.5 hours)
  Create `js/rendering/islandRenderer.js`:
  ```javascript
  import { spriteLoader } from './spriteLoader.js';
  import { CONSTS } from '../config.js';

  export class IslandRenderer {
      constructor(ctx) {
          this.ctx = ctx;

          // Define island positions and scales
          this.islands = [
              {
                  name: 'oahu',
                  lat: 21.5,
                  lon: 202.0,
                  scale: 5.0, // 5x oversized
                  sprite: 'oahu'
              },
              {
                  name: 'kauai',
                  lat: 22.0,
                  lon: 200.5,
                  scale: 1.0,
                  sprite: 'kauai'
              },
              // Add other islands if needed
          ];

          // Define surf spots on O'ahu North Shore
          this.surfSpots = [
              { name: 'Laniakea', lat: 21.65, lon: 201.98, offsetX: -20, offsetY: -15 },
              { name: 'Pipeline', lat: 21.66, lon: 201.95, offsetX: 0, offsetY: -15 },
              { name: 'Sunset', lat: 21.68, lon: 201.92, offsetX: 20, offsetY: -15 },
          ];
      }

      latLonToPixel(lat, lon, canvasWidth, canvasHeight) {
          const x = ((lon - CONSTS.MAP_LON_EAST_EDGE) /
              (CONSTS.MAP_LON_WEST_EDGE - CONSTS.MAP_LON_EAST_EDGE)) * canvasWidth;
          const y = ((lat - CONSTS.MAP_LAT_MIN) /
              (CONSTS.MAP_LAT_MAX - CONSTS.MAP_LAT_MIN)) * canvasHeight;
          return { x, y };
      }

      renderIslands(canvasWidth, canvasHeight) {
          this.islands.forEach(island => {
              const sprite = spriteLoader.get(island.sprite);
              if (!sprite) return;

              const pos = this.latLonToPixel(island.lat, island.lon, canvasWidth, canvasHeight);
              const width = sprite.width * island.scale;
              const height = sprite.height * island.scale;

              this.ctx.drawImage(
                  sprite,
                  pos.x - width / 2,
                  pos.y - height / 2,
                  width,
                  height
              );
          });
      }

      renderSurfSpots(canvasWidth, canvasHeight, interactive = true) {
          const marker = spriteLoader.get('marker');
          if (!marker) return;

          this.surfSpots.forEach(spot => {
              const pos = this.latLonToPixel(spot.lat, spot.lon, canvasWidth, canvasHeight);

              // Apply offset for better positioning on O'ahu sprite
              const x = pos.x + spot.offsetX;
              const y = pos.y + spot.offsetY;

              // Draw marker
              this.ctx.drawImage(marker, x - 8, y - 8, 16, 16);

              // Store click areas if interactive
              if (interactive) {
                  spot.clickArea = { x: x - 8, y: y - 8, width: 16, height: 16 };
              }
          });
      }

      // Check if click hit a surf spot
      getSurfSpotAt(x, y) {
          for (const spot of this.surfSpots) {
              if (!spot.clickArea) continue;
              const { x: ax, y: ay, width, height } = spot.clickArea;
              if (x >= ax && x <= ax + width && y >= ay && y <= ay + height) {
                  return spot;
              }
          }
          return null;
      }
  }
  ```

- [ ] **Integrate into Render module** (20 min)
  ```javascript
  import { IslandRenderer } from './islandRenderer.js';

  const Render = {
      init(canvas) {
          // ... existing
          this.islandRenderer = new IslandRenderer(this.ctx);
      },

      render() {
          // ... tiles, etc
          this.islandRenderer.renderIslands(this.canvas.width, this.canvas.height);
          this.islandRenderer.renderSurfSpots(this.canvas.width, this.canvas.height);
          // ... storms, waves
      }
  };
  ```

**Test**: O'ahu appears 5x larger, surf spots visible
**Commit**: `feat: Add custom island rendering with oversized O'ahu`

### 3.3 Storm Visualization
**Agent**: `frontend-developer`

- [ ] **Create StormRenderer class** (2 hours)
  Create `js/rendering/stormRenderer.js`:
  ```javascript
  import { spriteLoader } from './spriteLoader.js';
  import { stateManager } from '../core/state.js';

  export class StormRenderer {
      constructor(ctx) {
          this.ctx = ctx;
          this.animationFrame = 0;
          this.rotationAngle = 0;
      }

      getStormSprite(intensity) {
          // intensity: 0-1 scale
          if (intensity < 0.33) return spriteLoader.get('stormWeak');
          if (intensity < 0.66) return spriteLoader.get('stormModerate');
          return spriteLoader.get('stormStrong');
      }

      renderStorm(storm, x, y) {
          const sprite = this.getStormSprite(storm.intensity);
          if (!sprite) return;

          this.ctx.save();

          // Translate to storm center
          this.ctx.translate(x, y);

          // Rotate for spinning effect
          this.ctx.rotate(this.rotationAngle);

          // Draw sprite centered
          this.ctx.drawImage(
              sprite,
              -sprite.width / 2,
              -sprite.height / 2
          );

          // Draw wind vectors (arrows)
          if (storm.windDirection) {
              this.drawWindVectors(storm);
          }

          // Draw track path (breadcrumbs)
          this.ctx.restore();
          if (storm.trackHistory && storm.trackHistory.length > 0) {
              this.drawTrackPath(storm.trackHistory);
          }
      }

      drawWindVectors(storm) {
          // Draw 8 arrows radiating from center
          const arrowCount = 8;
          const radius = 40;

          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          this.ctx.lineWidth = 2;

          for (let i = 0; i < arrowCount; i++) {
              const angle = (i / arrowCount) * Math.PI * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              this.ctx.beginPath();
              this.ctx.moveTo(0, 0);
              this.ctx.lineTo(x, y);
              this.ctx.stroke();

              // Arrowhead
              const arrowAngle = Math.atan2(y, x);
              const arrowSize = 5;
              this.ctx.beginPath();
              this.ctx.moveTo(x, y);
              this.ctx.lineTo(
                  x - arrowSize * Math.cos(arrowAngle - 0.5),
                  y - arrowSize * Math.sin(arrowAngle - 0.5)
              );
              this.ctx.moveTo(x, y);
              this.ctx.lineTo(
                  x - arrowSize * Math.cos(arrowAngle + 0.5),
                  y - arrowSize * Math.sin(arrowAngle + 0.5)
              );
              this.ctx.stroke();
          }
      }

      drawTrackPath(trackHistory) {
          if (trackHistory.length < 2) return;

          this.ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
          this.ctx.lineWidth = 2;
          this.ctx.setLineDash([5, 5]);

          this.ctx.beginPath();
          this.ctx.moveTo(trackHistory[0].x, trackHistory[0].y);

          for (let i = 1; i < trackHistory.length; i++) {
              this.ctx.lineTo(trackHistory[i].x, trackHistory[i].y);
          }

          this.ctx.stroke();
          this.ctx.setLineDash([]);
      }

      update(deltaTime) {
          // Rotate storm sprite (spinning animation)
          this.rotationAngle += 0.02; // radians per frame
          if (this.rotationAngle > Math.PI * 2) {
              this.rotationAngle -= Math.PI * 2;
          }
      }

      renderAllStorms(storms, gridToPixel) {
          storms.forEach(storm => {
              const pixel = gridToPixel(storm.gridX, storm.gridY);
              this.renderStorm(storm, pixel.x, pixel.y);
          });
      }
  }
  ```

- [ ] **Integrate into Render module** (30 min)
- [ ] **Add storm track history to simulation** (30 min)
  - Modify `Sim` to store `storm.trackHistory = []`
  - Push position each timestep

**Test**: Storms appear with correct size, rotate, show wind/track
**Commit**: `feat: Add enhanced storm visualization`

### 3.4 Wave Propagation Animation
**Agent**: `frontend-developer`

- [ ] **Create WaveRenderer class** (2 hours)
  Create `js/rendering/waveRenderer.js`:
  ```javascript
  import { spriteLoader } from './spriteLoader.js';

  export class WaveRenderer {
      constructor(ctx) {
          this.ctx = ctx;
          this.animationFrame = 0;
          this.waveFrames = ['wave1', 'wave2', 'wave3', 'wave4'];
      }

      renderWaveCell(x, y, waveHeight, period, direction) {
          // Only render if significant wave energy
          if (waveHeight < 0.5) return; // threshold in meters

          // Get current animation frame
          const frameIndex = Math.floor(this.animationFrame / 10) % this.waveFrames.length;
          const sprite = spriteLoader.get(this.waveFrames[frameIndex]);
          if (!sprite) return;

          this.ctx.save();

          // Position
          this.ctx.translate(x, y);

          // Rotate based on swell direction
          if (direction) {
              this.ctx.rotate(direction);
          }

          // Scale based on wave height (bigger waves = larger ripples)
          const scale = Math.min(waveHeight / 5.0, 2.0); // cap at 2x
          this.ctx.scale(scale, scale);

          // Opacity based on wave height
          this.ctx.globalAlpha = Math.min(waveHeight / 10.0, 0.8);

          // Draw ripple sprite
          this.ctx.drawImage(
              sprite,
              -sprite.width / 2,
              -sprite.height / 2
          );

          this.ctx.restore();
      }

      renderWaveField(gridData, gridToPixel) {
          // Render every Nth cell to avoid clutter
          const step = 5; // render every 5th cell

          for (let y = 0; y < gridData.height; y += step) {
              for (let x = 0; x < gridData.width; x += step) {
                  const idx = y * gridData.width + x;
                  const hs = gridData.hs[idx];
                  const tp = gridData.tp[idx];
                  const theta = gridData.theta[idx];

                  if (hs > 0.5) {
                      const pixel = gridToPixel(x, y);
                      this.renderWaveCell(pixel.x, pixel.y, hs, tp, theta);
                  }
              }
          }
      }

      update(deltaTime) {
          this.animationFrame++;
          if (this.animationFrame > 1000) this.animationFrame = 0;
      }
  }
  ```

- [ ] **Integrate into Render module** (20 min)

**Test**: Animated ripples spread from storms
**Commit**: `feat: Add wave propagation animation`

### 3.5 Kauai Swell Shadow
**Agent**: `frontend-developer`

- [ ] **Create ShadowRenderer class** (1 hour)
  Create `js/rendering/shadowRenderer.js`:
  ```javascript
  import { spriteLoader } from './spriteLoader.js';

  export class ShadowRenderer {
      constructor(ctx) {
          this.ctx = ctx;
      }

      // Calculate shadow area behind Kauai
      getShadowArea(swellDirection) {
          // Kauai position
          const kauaiLat = 22.0;
          const kauaiLon = 200.5;

          // Shadow extends downwind from Kauai
          // Simple cone shape
          const shadowLength = 50; // grid cells
          const shadowWidth = 30; // grid cells

          // Calculate shadow polygon based on swell direction
          const angle = swellDirection;
          const shadowPoints = [
              { lat: kauaiLat, lon: kauaiLon }, // apex at Kauai
              {
                  lat: kauaiLat + Math.cos(angle - 0.3) * shadowLength,
                  lon: kauaiLon + Math.sin(angle - 0.3) * shadowLength
              },
              {
                  lat: kauaiLat + Math.cos(angle + 0.3) * shadowLength,
                  lon: kauaiLon + Math.sin(angle + 0.3) * shadowLength
              }
          ];

          return shadowPoints;
      }

      renderShadow(shadowArea, latLonToPixel) {
          if (shadowArea.length < 3) return;

          const shadow = spriteLoader.get('shadow');

          // Fill shadow polygon
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          this.ctx.beginPath();

          const start = latLonToPixel(shadowArea[0].lat, shadowArea[0].lon);
          this.ctx.moveTo(start.x, start.y);

          for (let i = 1; i < shadowArea.length; i++) {
              const point = latLonToPixel(shadowArea[i].lat, shadowArea[i].lon);
              this.ctx.lineTo(point.x, point.y);
          }

          this.ctx.closePath();
          this.ctx.fill();

          // Optionally tile shadow sprite across area
          // (implementation depends on final design preference)
      }
  }
  ```

- [ ] **Integrate into simulation physics** (1 hour)
  - Modify `Sim` to reduce wave height in shadow zones
  - Calculate dominant swell direction
  - Apply shadow reduction factor

**Test**: Shadow visible behind Kauai when swell approaches
**Commit**: `feat: Add Kauai swell shadow visualization`

**Git**: Commit and push Phase 3
**⏸️ PAUSE**: Phase 3 complete, review rendering

---

## PHASE 4: Interactive Features
**Goal**: Add surf spot interaction, zoom, save/load, historical storms
**Agent Lead**: `frontend-developer`, `javascript-pro`

### 4.1 Surf Spot Data Display
**Agent**: `frontend-developer`

- [ ] **Create SurfSpotPanel component** (1.5 hours)
  Create `js/ui/surfSpotPanel.js`:
  ```javascript
  export class SurfSpotPanel {
      constructor() {
          this.activeSpot = null;
          this.createPanel();
      }

      createPanel() {
          const panel = document.createElement('div');
          panel.id = 'surfSpotPanel';
          panel.className = 'surf-spot-panel hidden';
          panel.innerHTML = `
              <div class="panel-header">
                  <h3 id="spotName">Surf Spot</h3>
                  <button id="closeSurfSpot" aria-label="Close">×</button>
              </div>
              <div class="panel-body">
                  <div class="data-row">
                      <span>Wave Height:</span>
                      <strong id="spotHeight">-- ft</strong>
                  </div>
                  <div class="data-row">
                      <span>Period:</span>
                      <strong id="spotPeriod">-- sec</strong>
                  </div>
                  <div class="data-row">
                      <span>Direction:</span>
                      <strong id="spotDirection">--°</strong>
                  </div>
                  <div class="data-row">
                      <span>Conditions:</span>
                      <strong id="spotConditions">--</strong>
                  </div>
              </div>
          `;
          document.body.appendChild(panel);

          // Close button
          document.getElementById('closeSurfSpot').addEventListener('click', () => {
              this.hide();
          });
      }

      show(spotName, waveData) {
          this.activeSpot = spotName;
          const panel = document.getElementById('surfSpotPanel');

          document.getElementById('spotName').textContent = spotName;
          document.getElementById('spotHeight').textContent =
              `${(waveData.height * 3.28084).toFixed(1)} ft`; // meters to feet
          document.getElementById('spotPeriod').textContent =
              `${waveData.period.toFixed(1)} sec`;
          document.getElementById('spotDirection').textContent =
              `${Math.round(waveData.direction)}°`;
          document.getElementById('spotConditions').textContent =
              this.getConditions(waveData.height, waveData.period);

          panel.classList.remove('hidden');
      }

      hide() {
          document.getElementById('surfSpotPanel').classList.add('hidden');
          this.activeSpot = null;
      }

      getConditions(height, period) {
          const heightFt = height * 3.28084;
          if (heightFt < 3) return 'Flat';
          if (heightFt < 6) return 'Small';
          if (heightFt < 10) return 'Good';
          if (heightFt < 20) return 'Epic';
          return 'Code Red!';
      }
  }
  ```

- [ ] **Add CSS for panel** (30 min)
  Add to `css/styles.css`:
  ```css
  .surf-spot-panel {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      background: var(--bg-panel);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      min-width: 250px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      z-index: 1000;
      transition: opacity 0.2s, transform 0.2s;
  }

  .surf-spot-panel.hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-50%) scale(0.95);
  }

  .surf-spot-panel .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
  }

  .surf-spot-panel .data-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(75, 85, 99, 0.3);
  }

  .surf-spot-panel .data-row:last-child {
      border-bottom: none;
  }
  ```

- [ ] **Wire up click detection** (1 hour)
  Update `js/ui/controls.js`:
  ```javascript
  import { SurfSpotPanel } from './surfSpotPanel.js';

  const UI = {
      init() {
          this.surfSpotPanel = new SurfSpotPanel();
          this.setupCanvasClicks();
          // ... existing code
      },

      setupCanvasClicks() {
          const canvas = document.getElementById('simCanvas');
          canvas.addEventListener('click', (e) => {
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              // Check if clicked on surf spot
              const spot = Render.islandRenderer.getSurfSpotAt(x, y);
              if (spot) {
                  // Get wave data at this location
                  const waveData = Sim.getWaveDataAt(spot.lat, spot.lon);
                  this.surfSpotPanel.show(spot.name, waveData);
              }
          });
      }
  };
  ```

- [ ] **Add Sim.getWaveDataAt()** (30 min)
  Update `js/core/simulation.js`:
  ```javascript
  const Sim = {
      getWaveDataAt(lat, lon) {
          // Convert lat/lon to grid coordinates
          const gridX = Math.floor(
              ((lon - CONSTS.MAP_LON_EAST_EDGE) /
              (CONSTS.MAP_LON_WEST_EDGE - CONSTS.MAP_LON_EAST_EDGE)) * state.gridWidth
          );
          const gridY = Math.floor(
              ((lat - CONSTS.MAP_LAT_MIN) /
              (CONSTS.MAP_LAT_MAX - CONSTS.MAP_LAT_MIN)) * state.gridHeight
          );

          const idx = gridY * state.gridWidth + gridX;

          return {
              height: state.grid.hs[idx] || 0,
              period: state.grid.tp[idx] || 0,
              direction: state.grid.theta[idx] || 0
          };
      }
  };
  ```

**Test**: Click surf spots, see wave data
**Commit**: `feat: Add interactive surf spot data panels`

### 4.2 Zoom Controls
**Agent**: `frontend-developer`

- [ ] **Create ZoomManager class** (1.5 hours)
  Create `js/features/zoom.js`:
  ```javascript
  import { CONSTS } from '../config.js';

  export class ZoomManager {
      constructor() {
          this.zoomLevel = 1; // 1x = full map, 2x = O'ahu focus
          this.focusPoint = {
              lat: CONSTS.HAWAII_MAIN_ISLAND_CENTER.lat,
              lon: CONSTS.HAWAII_MAIN_ISLAND_CENTER.lon
          };
          this.createZoomButtons();
      }

      createZoomButtons() {
          const container = document.createElement('div');
          container.id = 'zoomControls';
          container.className = 'zoom-controls';
          container.innerHTML = `
              <button id="zoomOut" aria-label="Zoom out" title="Full Pacific">1x</button>
              <button id="zoomIn" aria-label="Zoom in" title="O'ahu Focus">2x</button>
          `;
          document.body.appendChild(container);

          document.getElementById('zoomOut').addEventListener('click', () => this.setZoom(1));
          document.getElementById('zoomIn').addEventListener('click', () => this.setZoom(2));

          this.updateButtons();
      }

      setZoom(level) {
          this.zoomLevel = level;
          this.updateButtons();
          this.applyZoom();
      }

      updateButtons() {
          const outBtn = document.getElementById('zoomOut');
          const inBtn = document.getElementById('zoomIn');

          outBtn.classList.toggle('active', this.zoomLevel === 1);
          inBtn.classList.toggle('active', this.zoomLevel === 2);
      }

      applyZoom() {
          // Modify render viewport
          if (this.zoomLevel === 1) {
              // Full map
              Render.setViewport(
                  CONSTS.MAP_LAT_MIN, CONSTS.MAP_LAT_MAX,
                  CONSTS.MAP_LON_EAST_EDGE, CONSTS.MAP_LON_WEST_EDGE
              );
          } else {
              // O'ahu focus (zoom 2x)
              const latRange = (CONSTS.MAP_LAT_MAX - CONSTS.MAP_LAT_MIN) / 2;
              const lonRange = (CONSTS.MAP_LON_WEST_EDGE - CONSTS.MAP_LON_EAST_EDGE) / 2;

              Render.setViewport(
                  this.focusPoint.lat - latRange / 4,
                  this.focusPoint.lat + latRange / 4,
                  this.focusPoint.lon - lonRange / 4,
                  this.focusPoint.lon + lonRange / 4
              );
          }
      }
  }
  ```

- [ ] **Update Render module with viewport support** (1 hour)
  Add to `js/rendering/renderer.js`:
  ```javascript
  const Render = {
      setViewport(latMin, latMax, lonMin, lonMax) {
          this.viewport = { latMin, latMax, lonMin, lonMax };
      },

      latLonToPixel(lat, lon) {
          const vp = this.viewport || {
              latMin: CONSTS.MAP_LAT_MIN,
              latMax: CONSTS.MAP_LAT_MAX,
              lonMin: CONSTS.MAP_LON_EAST_EDGE,
              lonMax: CONSTS.MAP_LON_WEST_EDGE
          };

          const x = ((lon - vp.lonMin) / (vp.lonMax - vp.lonMin)) * this.canvas.width;
          const y = ((lat - vp.latMin) / (vp.latMax - vp.latMin)) * this.canvas.height;

          return { x, y };
      }
  };
  ```

- [ ] **Add CSS for zoom buttons** (15 min)

**Test**: Zoom buttons switch between full map and O'ahu focus
**Commit**: `feat: Add zoom controls for O'ahu focus`

### 4.3 Save/Load System
**Agent**: `javascript-pro`

- [ ] **Create SaveLoadManager class** (2 hours)
  Create `js/features/saveLoad.js`:
  ```javascript
  import { stateManager } from '../core/state.js';
  import { Sim } from '../core/simulation.js';

  export class SaveLoadManager {
      constructor() {
          this.storageKey = 'pacificWaves_scenarios';
          this.createUI();
      }

      createUI() {
          // Add save/load buttons to control bar
          const controlBar = document.querySelector('.control-bar');
          const saveLoadGroup = document.createElement('div');
          saveLoadGroup.className = 'control-group';
          saveLoadGroup.innerHTML = `
              <button id="saveScenario" title="Save current scenario">💾 Save</button>
              <button id="loadScenario" title="Load scenario">📂 Load</button>
              <button id="exportJSON" title="Export as JSON file">⬇️ Export</button>
              <input type="file" id="importJSON" accept=".json" style="display:none">
              <button id="importJSONBtn" title="Import JSON file">⬆️ Import</button>
          `;
          controlBar.appendChild(saveLoadGroup);

          this.setupEventListeners();
      }

      setupEventListeners() {
          document.getElementById('saveScenario').addEventListener('click', () => this.save());
          document.getElementById('loadScenario').addEventListener('click', () => this.showLoadDialog());
          document.getElementById('exportJSON').addEventListener('click', () => this.exportJSON());
          document.getElementById('importJSONBtn').addEventListener('click', () => {
              document.getElementById('importJSON').click();
          });
          document.getElementById('importJSON').addEventListener('change', (e) => {
              this.importJSON(e.target.files[0]);
          });
      }

      save() {
          const name = prompt('Scenario name:', `Scenario ${new Date().toLocaleString()}`);
          if (!name) return;

          const scenario = this.captureState();
          scenario.name = name;
          scenario.timestamp = Date.now();

          // Save to localStorage
          const saved = this.getSavedScenarios();
          saved.push(scenario);
          localStorage.setItem(this.storageKey, JSON.stringify(saved));

          alert(`Saved "${name}"!`);
      }

      captureState() {
          const state = stateManager.getAll();
          return {
              seed: state.seedStr,
              time: state.simTimeHours,
              storms: state.storms || [],
              gridData: {
                  hs: Array.from(state.grid.hs),
                  tp: Array.from(state.grid.tp),
                  theta: Array.from(state.grid.theta)
              }
          };
      }

      getSavedScenarios() {
          const saved = localStorage.getItem(this.storageKey);
          return saved ? JSON.parse(saved) : [];
      }

      showLoadDialog() {
          const scenarios = this.getSavedScenarios();
          if (scenarios.length === 0) {
              alert('No saved scenarios.');
              return;
          }

          // Create dialog
          const dialog = document.createElement('div');
          dialog.className = 'load-dialog';
          dialog.innerHTML = `
              <div class="dialog-overlay"></div>
              <div class="dialog-content">
                  <h3>Load Scenario</h3>
                  <ul id="scenarioList"></ul>
                  <button id="closeLoadDialog">Cancel</button>
              </div>
          `;
          document.body.appendChild(dialog);

          const list = dialog.querySelector('#scenarioList');
          scenarios.forEach((scenario, index) => {
              const item = document.createElement('li');
              item.innerHTML = `
                  <span>${scenario.name}</span>
                  <small>${new Date(scenario.timestamp).toLocaleString()}</small>
                  <button data-index="${index}">Load</button>
              `;
              list.appendChild(item);

              item.querySelector('button').addEventListener('click', () => {
                  this.load(scenario);
                  dialog.remove();
              });
          });

          dialog.querySelector('#closeLoadDialog').addEventListener('click', () => {
              dialog.remove();
          });
      }

      load(scenario) {
          // Restore state
          Sim.init(scenario.seed);
          stateManager.set('simTimeHours', scenario.time);
          stateManager.set('storms', scenario.storms);

          // Restore grid data
          const state = stateManager.getAll();
          state.grid.hs.set(scenario.gridData.hs);
          state.grid.tp.set(scenario.gridData.tp);
          state.grid.theta.set(scenario.gridData.theta);

          console.log(`Loaded scenario: ${scenario.name}`);
      }

      exportJSON() {
          const scenario = this.captureState();
          scenario.name = prompt('Export name:', 'scenario');

          const json = JSON.stringify(scenario, null, 2);
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `${scenario.name}.json`;
          a.click();

          URL.revokeObjectURL(url);
      }

      importJSON(file) {
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const scenario = JSON.parse(e.target.result);
                  this.load(scenario);
                  alert(`Imported "${scenario.name}"!`);
              } catch (error) {
                  alert('Invalid JSON file.');
                  console.error(error);
              }
          };
          reader.readAsText(file);
      }
  }
  ```

- [ ] **Add CSS for load dialog** (20 min)
- [ ] **Integrate into main.js** (10 min)

**Test**: Save, load, export, import scenarios
**Commit**: `feat: Add save/load system (localStorage + JSON)`

### 4.4 Historical Storms
**Agent**: `search-specialist`, `javascript-pro`

- [ ] **Research famous North Shore swells** (1 hour)
  **Agent**: `search-specialist`
  - Eddie 2009 (December)
  - Greg Noll 1968 swell
  - 2016 El Niño winter
  - Create `data/historicalStorms.json`

- [ ] **Create HistoricalStorms manager** (1 hour)
  Create `js/features/historical.js`:
  ```javascript
  export class HistoricalStorms {
      constructor() {
          this.storms = [];
          this.loadStorms();
          this.createUI();
      }

      async loadStorms() {
          const response = await fetch('data/historicalStorms.json');
          this.storms = await response.json();
      }

      createUI() {
          const controlBar = document.querySelector('.control-bar');
          const group = document.createElement('div');
          group.className = 'control-group';
          group.innerHTML = `
              <label for="historicalSelect">Historical:</label>
              <select id="historicalSelect">
                  <option value="">-- Select Storm --</option>
              </select>
              <button id="loadHistorical">Load</button>
          `;
          controlBar.appendChild(group);

          const select = document.getElementById('historicalSelect');
          this.storms.forEach((storm, index) => {
              const option = document.createElement('option');
              option.value = index;
              option.textContent = storm.name;
              select.appendChild(option);
          });

          document.getElementById('loadHistorical').addEventListener('click', () => {
              const index = select.value;
              if (index !== '') {
                  this.loadStorm(this.storms[index]);
              }
          });
      }

      loadStorm(storm) {
          // Place storm on map
          Sim.placeStorm(storm.lat, storm.lon, storm.intensity, storm.duration);
          console.log(`Loaded historical storm: ${storm.name}`);
      }
  }
  ```

- [ ] **Create historicalStorms.json** (30 min)
  ```json
  [
      {
          "name": "Eddie 2009 - December Swell",
          "description": "Massive northwest swell that ran the Eddie contest",
          "lat": 50,
          "lon": 170,
          "intensity": 0.9,
          "duration": 72,
          "windSpeed": 50,
          "direction": 315
      },
      {
          "name": "Greg Noll 1968 - Makaha Monster",
          "description": "Historic giant surf at Makaha, Noll's last wave",
          "lat": 48,
          "lon": 175,
          "intensity": 0.95,
          "duration": 48,
          "windSpeed": 55,
          "direction": 300
      }
  ]
  ```

**Test**: Load historical storms from dropdown
**Commit**: `feat: Add historical storm presets`

**Git**: Commit and push Phase 4
**⏸️ PAUSE**: Phase 4 complete, test all features

---

## PHASE 5: Polish & Performance
**Goal**: Optimize performance, fix bugs, improve UX
**Agent Lead**: `performance-engineer`, `code-reviewer`

### 5.1 Performance Optimization
**Agent**: `performance-engineer`

- [ ] **Profile canvas rendering** (1 hour)
  - Use Chrome DevTools Performance tab
  - Identify bottlenecks (tile rendering? wave animations?)
  - Document baseline metrics

- [ ] **Optimize render loop** (2 hours)
  - Implement dirty rectangle rendering (only redraw changed areas)
  - Use OffscreenCanvas for static background
  - Reduce wave render density if FPS < 30
  ```javascript
  // Example optimization
  const Render = {
      init(canvas) {
          // Create offscreen canvas for static background
          this.bgCanvas = new OffscreenCanvas(canvas.width, canvas.height);
          this.bgCtx = this.bgCanvas.getContext('2d');
          this.renderBackground(); // Only once
      },

      renderBackground() {
          // Render tiles to offscreen canvas
          this.tileRenderer.renderTiles(this.bgCtx, state.gridWidth, state.gridHeight);
          this.islandRenderer.renderIslands(this.bgCtx);
      },

      render() {
          // Copy static background
          this.ctx.drawImage(this.bgCanvas, 0, 0);

          // Render dynamic elements only
          this.stormRenderer.renderAllStorms(state.storms);
          this.waveRenderer.renderWaveField(state.grid);
      }
  };
  ```

- [ ] **Implement adaptive quality** (1 hour)
  - Monitor FPS
  - Reduce wave animation frames if slow
  - Skip storm rotation if FPS < 20

**Deliverable**: 60 FPS at 1x zoom, 30+ FPS at 2x zoom
**Commit**: `perf: Optimize canvas rendering pipeline`

### 5.2 Code Review & Quality
**Agent**: `code-reviewer`

- [ ] **Full codebase review** (2 hours)
  - Check all modules for:
    - Consistent naming conventions
    - Proper error handling
    - Memory leaks (event listeners cleaned up?)
    - Console.log statements removed
    - TODOs addressed

- [ ] **Verify physics accuracy** (1 hour)
  - Test wave propagation speeds
  - Verify swell direction calculations
  - Check nearshore transformation
  - Compare to NOAA data if possible

**Agent**: `architectural-overseer`
- [ ] **Architecture compliance** (30 min)
  - Module sizes reasonable (<500 lines)
  - No circular dependencies
  - Clear separation of concerns

**Deliverable**: Clean, production-ready code
**Commit**: `refactor: Code review improvements`

### 5.3 UX Improvements
**Agent**: `ui-ux-designer`

- [ ] **Add loading progress bar** (30 min)
  - Show sprite loading progress
  - Smooth fade-in when ready

- [ ] **Improve tooltips** (30 min)
  - Add helpful tooltips to all controls
  - Keyboard shortcuts hints

- [ ] **Add help modal** (1 hour)
  - "How to play" instructions
  - Explain storm parameters
  - Link to educational resources

- [ ] **Visual polish** (1 hour)
  - Smooth transitions
  - Hover effects on buttons
  - Better visual feedback

**Commit**: `ui: Polish user experience`

### 5.4 Testing & Bug Fixes
**Agent**: `debugger`

- [ ] **Test all features** (2 hours)
  - Storm placement
  - Swell propagation
  - Surf spot clicks
  - Zoom controls
  - Save/load
  - Historical storms
  - Export/import

- [ ] **Cross-browser testing** (1 hour)
  - Chrome
  - Safari
  - Firefox
  - Mobile browsers (iOS Safari, Chrome Android)

- [ ] **Fix identified bugs** (variable time)

**Deliverable**: Bug-free experience across browsers
**Commit**: `fix: Resolve bugs from testing`

### 5.5 Documentation
**Agent**: `api-documenter`

- [ ] **Update README.md** (30 min)
  - Add screenshots
  - Usage instructions
  - Feature list
  - Credits

- [ ] **Create CHANGELOG.md** (15 min)
  - Document all changes since initial commit

- [ ] **Code documentation** (1 hour)
  - JSDoc comments for public APIs
  - Explain complex physics calculations
  - Module purpose headers

**Commit**: `docs: Update documentation`

**Git**: Final commit and push
```bash
git add .
git commit -m "release: PacificWaves v1.0 - Complete refactor and feature additions"
git push origin master
```

---

## COMPLETION CHECKLIST

### Phase 1: Code Refactoring ✅
- [ ] CSS extracted to separate file
- [ ] HTML modularized
- [ ] JavaScript split into ES6 modules
- [ ] All modules under 500 lines
- [ ] No circular dependencies
- [ ] Architecture documented
- [ ] Committed and pushed

### Phase 2: Assets & Graphics System ✅
- [ ] 11 sprite assets generated
- [ ] Assets converted to PNG
- [ ] SpriteLoader implemented
- [ ] All sprites load without errors
- [ ] Committed and pushed

### Phase 3: Map & Visualization ✅
- [ ] Tile-based ocean rendering
- [ ] O'ahu oversized (visually prominent)
- [ ] 3 surf spots marked (Laniakea, Pipeline, Sunset)
- [ ] Storm sprites with rotation/wind/track
- [ ] Wave propagation animation
- [ ] Kauai swell shadow
- [ ] Committed and pushed

### Phase 4: Interactive Features ✅
- [ ] Surf spot data panels (click to view)
- [ ] Zoom controls (1x full, 2x O'ahu)
- [ ] Save/load (localStorage)
- [ ] Export/import (JSON files)
- [ ] Historical storms (dropdown presets)
- [ ] Committed and pushed

### Phase 5: Polish & Performance ✅
- [ ] 60 FPS rendering achieved
- [ ] Code reviewed and cleaned
- [ ] All features tested
- [ ] Cross-browser compatible
- [ ] Documentation updated
- [ ] Final commit and push

---

## USER ACTION ITEMS

**Required Before Phase 2**:
- [ ] Run image generation script 11 times (see Phase 2.2)
- [ ] Move generated .bmp files to `assets/generated/`

**Optional**:
- [ ] Test application at each phase checkpoint
- [ ] Provide feedback on visual design
- [ ] Suggest additional historical storms

---

## AGENT TASK SUMMARY

| Phase | Primary Agent | Supporting Agents | Estimated Time |
|-------|---------------|-------------------|----------------|
| 1 | backend-architect, javascript-pro | code-reviewer, architectural-overseer | 4-6 hours |
| 2 | ai-engineer, frontend-developer | user (image generation) | 2-3 hours |
| 3 | frontend-developer | javascript-pro | 6-8 hours |
| 4 | frontend-developer, javascript-pro | search-specialist | 5-7 hours |
| 5 | performance-engineer, code-reviewer | debugger, ui-ux-designer | 4-6 hours |

**Total Estimated Time**: 21-30 hours of agent work

---

## MONITORING & SUPERVISION

**During each phase, I will**:
1. Supervise all agent work
2. Review code changes before commits
3. Test functionality at checkpoints
4. STOP if deviations from TODO occur
5. Update this TODO.md with progress
6. Keep git repository current

**STOP Triggers** (require user approval):
- ❌ Creating files >500 lines
- ❌ Adding external dependencies
- ❌ Modifying core physics without discussion
- ❌ Implementing features not in this TODO
- ❌ Major architecture changes

---

## NEXT STEPS

**Immediate Action**:
1. User approval of this TODO.md
2. Begin Phase 1: Code Refactoring
3. Launch `backend-architect` agent for structure design

**Once approved, type**: "Begin Phase 1" and I'll start!

---

*TODO.md created: 2025-11-11*
*Last updated: 2025-11-11*
