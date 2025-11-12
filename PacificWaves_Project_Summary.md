# PacificWaves - Project Summary

## Project Overview
**PacificWaves** (formerly "North Shore Swell Lab") is an educational browser-based interactive simulation that teaches how North Pacific storm systems generate surf at O'ahu's North Shore. The game allows users to place storm systems and observe realistic wave propagation across the Pacific Ocean.

**Repository**: https://github.com/stonezone/PacificWaves
**Technology Stack**: Pure HTML5 Canvas + Vanilla JavaScript (zero dependencies, zero build tools)
**Target Audience**: Surfers, wind sport enthusiasts, weather geeks, students
**Educational Goal**: Understand the storm → swell → surf relationship

---

## Current Development Status

### ✅ Completed Features (Phase 1-3)

#### **Core Simulation Engine**
- **Wave Physics Model**: Accurate wave height (Hs), period (Tp), and direction (θ) calculations
- **Wind Fetch Calculations**: Realistic fetch-limited wave generation from storm systems
- **Swell Propagation**: Semi-Lagrangian advection with dispersion and energy decay
- **Nearshore Transformation**: Shoaling, refraction, and wave breaking physics
- **Multiple Swell Trains**: Superposition of wave energy from multiple sources
- **Grid System**: 200×160 cells at 20km resolution covering 10°N-65°N, 130°E-250°E

#### **Graphics & Rendering**
- **Sprite-Based Graphics System**:
  - ES6 module sprite loader (`js/sprite-loader.js`)
  - 11 pixel art sprites generated (1024×1024 resolution):
    - `ocean_tile.png` - Base ocean water texture
    - `deep_ocean_tile.png` - Deep ocean variant
    - `land_tiles.png` - Coastal land tiles
    - `storm_weak.png` - Small cyclone icon (32×32)
    - `storm_moderate.png` - Medium cyclone icon (48×48)
    - `storm_strong.png` - Large cyclone icon (64×64)
    - `wave_ripple.png` - Animated wave propagation effect
    - `oahu_island.png` - Oahu island sprite (128×96)
    - `kauai_island.png` - Kauai island sprite (32×24)
    - `surf_spot_marker.png` - Surf spot flag marker
    - `swell_shadow.png` - Semi-transparent swell shadow overlay
- **Clean Cartographic Map Style**:
  - Light blue ocean background (#e8f4fc)
  - Pacific rim landmasses (Japan, Alaska, Kamchatka, North America) with clean outlines
  - Light tan land fill (#f5f0e8) with dark blue-gray strokes (#2c3e50)
  - Hawaiian islands centered and prominently displayed
- **Larger Canvas**: 600×800px minimum (increased from 200×250px)
- **Grid Lines**: Lat/lon grid overlay with 10° spacing

#### **Storm Management**
- **Interactive Storm Placement**: Click-to-place storms on the map
- **Storm Parameters**:
  - Position (lat/lon)
  - Intensity (radius in km, affects wind speed)
  - Direction (deg, 0-360)
  - Duration (hours)
- **Visual Representation**: Size-coded cyclone sprites based on intensity
- **Storm Manager Panel**: Create, clone, delete storms with detailed parameter controls

#### **User Interface**
- **Playback Controls**: Play/Pause, Step, Reset buttons
- **Speed Control**: Adjustable simulation speed slider (1-10×)
- **Seed Input**: Custom PRNG seed for reproducible simulations
- **Time Display**: Current simulation time (T + hours)
- **Side Panel Tabs**:
  - Storms (storm manager)
  - Sites (surf spot monitoring)
  - Env (environment settings)
  - Scenarios (pre-configured storm setups)
  - Diag (diagnostics/testing)
- **Loading Indicator**: Shows during sprite loading and initialization
- **Responsive Layout**: Side panel collapses on mobile (<768px)

#### **Performance & Optimization**
- **60 FPS Target**: RequestAnimationFrame-based game loop
- **Efficient Rendering**: Only draws visible cells, sprites pre-loaded
- **Float32Array Buffers**: Memory-efficient grid storage
- **Semi-Lagrangian Advection**: Stable even at large time steps

#### **Code Architecture**
- **Modular Structure** (in single waves.html file):
  - `CONSTS` - Physics constants, map data, land polygons
  - `PRNG` - Pseudo-random number generator (LCG algorithm)
  - `Sim` - Core simulation engine
  - `Render` - Canvas rendering module
  - `UI` - User interface controls
  - `Utils` - Helper functions (coordinate transforms, etc.)
  - `Tests` - Self-check validation functions
  - `MainLoop` - Game loop
  - `App` - Initialization orchestrator
- **ES6 Module**: Sprite loader extracted to `js/sprite-loader.js`
- **Async Initialization**: Sprites load before first render

---

## Requested Features (Not Yet Implemented)

### Phase 4: Interactive Gameplay Features

#### **Surf Spot Monitoring**
- [ ] Multiple surf spot locations around Oahu
- [ ] Real-time swell height/period/direction readings at each spot
- [ ] Visual indicators when spots are "firing" (good conditions)
- [ ] Historical tracking of surf conditions over simulation time

#### **Map Interaction**
- [ ] Zoom/pan functionality for detailed viewing
- [ ] Click on surf spots for detailed forecast
- [ ] Drag-to-move storms after placement
- [ ] Visual swell "rays" showing propagation paths

#### **Save/Load System**
- [ ] Save current simulation state to localStorage
- [ ] Load saved simulations
- [ ] Export/import simulation configurations (JSON)
- [ ] Share simulation via URL parameters

#### **Historical Storms**
- [ ] Pre-configured scenarios based on famous North Pacific storms
- [ ] "Eddie Would Go" 1985-86 scenario
- [ ] "Biggest Wednesday" 1998 scenario
- [ ] Tutorial scenarios for learning

#### **Scoring & Challenges**
- [ ] Challenge mode: "Generate X ft waves at Sunset Beach"
- [ ] Optimal storm placement scoring
- [ ] Time-based challenges
- [ ] Educational tutorials with step-by-step guidance

### Phase 5: Polish & Enhancement

#### **Visual Effects**
- [ ] Animated wave propagation ripples (currently sprites exist but not fully utilized)
- [ ] Storm rotation animation
- [ ] Particle effects for breaking waves at shore
- [ ] Day/night cycle or weather overlay

#### **Sound & Music**
- [ ] Ocean ambient sounds
- [ ] Storm sound effects
- [ ] UI click/feedback sounds
- [ ] Background music (optional, toggleable)

#### **Enhanced Graphics**
- [ ] More detailed coastline data for Pacific rim
- [ ] Additional island sprites (Big Island, Maui, Molokai, Lanai)
- [ ] Better storm eye/spiral visualization
- [ ] Swell direction arrows overlay

#### **Educational Features**
- [ ] Info tooltips explaining physics concepts
- [ ] "Learn Mode" with explanations during simulation
- [ ] Glossary of surf/meteorology terms
- [ ] Links to real-world resources (NOAA, Surfline, etc.)

#### **Performance & UX**
- [ ] Mobile touch controls optimization
- [ ] Keyboard shortcuts (already partially implemented: Space, Esc, Delete, +/-)
- [ ] Accessibility improvements (ARIA labels exist, need testing)
- [ ] Progressive Web App (PWA) for offline use
- [ ] Service worker for sprite caching

---

## Technical Details

### File Structure
```
PacificWaves/
├── waves.html                          # Main application (2,900+ lines)
├── js/
│   └── sprite-loader.js               # ES6 sprite loading module
├── assets/
│   └── generated/                     # Generated sprite assets
│       ├── ocean_tile.png
│       ├── deep_ocean_tile.png
│       ├── land_tiles.png
│       ├── storm_weak.png
│       ├── storm_moderate.png
│       ├── storm_strong.png
│       ├── wave_ripple.png
│       ├── oahu_island.png
│       ├── kauai_island.png
│       ├── surf_spot_marker.png
│       └── swell_shadow.png
├── test-sprites.html                  # Sprite loading test page
├── minimal-test.html                  # ES6 module test page
├── debug.html                         # Debugging helper
├── console-debug.js                   # Browser console debugging script
├── README.md                          # Project documentation
├── .claude/
│   ├── CLAUDE.md                      # Claude AI context file
│   └── BACKTRACK_ANALYSIS.md          # Architectural analysis
└── PacificWaves_Project_Summary.md    # This file
```

### Physics Constants
- **Gravity**: 9.81 m/s²
- **Grid**: 200 cells wide × 160 cells tall
- **Cell Size**: 20 km per cell
- **Coverage**:
  - Latitude: 10°N to 65°N
  - Longitude: 130°E to 250°E (spans dateline)
- **Hawaii Center**: 21.5°N, 202.2°W (157.8°W)
- **Time Step**: 1 hour (adjustable)
- **Nearshore Cells**: 15 cells (~300 km) around Hawaii

### Wave Physics Parameters
- **Wave Period Range**: 3-22 seconds (Tp)
- **Deep Water Depth**: 4000m
- **Shallow Water Start**: 100m
- **Breaking Gamma**: 0.78 (H/h ratio)
- **Energy Decay**: Distance-dependent with alpha/beta coefficients
- **Dispersion**: Frequency-dependent group velocity

### Browser Compatibility
- **Minimum Requirements**:
  - ES6 module support (Chrome 61+, Firefox 60+, Safari 11+)
  - HTML5 Canvas
  - Async/await support
  - Float32Array support
- **HTTP Server Required**: ES6 modules don't work with file:// protocol (CORS)
- **Tested On**: Chrome 131+, Safari 18+ (macOS)

---

## Development Workflow

### Running Locally
```bash
# Clone repository
git clone https://github.com/stonezone/PacificWaves.git
cd PacificWaves

# Start local web server (required for ES6 modules)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/waves.html
```

### Making Changes
1. Edit `waves.html` for core logic/UI changes
2. Edit `js/sprite-loader.js` for sprite system changes
3. Refresh browser to test (Cmd+Shift+R for hard reload)
4. Use Chrome DevTools Console for debugging
5. Check browser console for errors
6. Commit working changes to git

### Code Style Guidelines
- **Language**: ES6+ JavaScript (module pattern)
- **Naming**: camelCase for variables/functions, UPPER_CASE for constants
- **Indentation**: 4 spaces
- **Comments**: Inline for complex physics, section headers for modules
- **Formatting**: Verbose variable names for readability

---

## Known Issues & Technical Debt

### Current Bugs
- None currently blocking (PRNG BigInt error fixed)

### Technical Debt
- **Monolithic Architecture**: All code in single waves.html file (~2,900 lines)
  - Should be split into separate ES6 modules:
    - `sim.js` - Simulation engine
    - `render.js` - Rendering
    - `ui.js` - User interface
    - `utils.js` - Utilities
    - `consts.js` - Constants
- **No Unit Tests**: All testing is manual browser testing
- **Hardcoded Constants**: Many physics parameters should be configurable
- **Limited Error Handling**: Need better error messages and recovery
- **No Build System**: Intentional (zero dependencies), but could benefit from optional bundling
- **Accessibility**: ARIA labels exist but need full screen reader testing

### Performance Bottlenecks (Minor)
- Wave rendering with sprites could use optimization for very large grids
- No spatial indexing for storm-cell interactions
- Grid lines redraw every frame (could cache)

---

## Future Architectural Improvements

### Refactoring Roadmap
1. **Phase 1**: Extract modules (sim, render, ui, utils, consts)
2. **Phase 2**: Add TypeScript definitions (optional .d.ts files)
3. **Phase 3**: Implement proper state management (single store pattern)
4. **Phase 4**: Add proper testing framework (Jest or similar)
5. **Phase 5**: Optional build step for production optimization

### Code Quality Improvements
- [ ] ESLint configuration
- [ ] Prettier for formatting
- [ ] JSDoc comments for all public APIs
- [ ] Type checking with TypeScript or JSDoc types
- [ ] Git hooks for pre-commit linting

---

## Resources & References

### Educational Resources
- **Wave Physics**: NOAA Wave Models, Coastal Engineering Manual
- **Surfing Context**: Surfline forecasts, Eddie Aikau history
- **Meteorology**: North Pacific storm tracks, fetch-limited wave generation

### Technical Resources
- **Graphics**: Piskel (pixel art editor), Lospec (color palettes)
- **Maps**: NOAA Pacific ocean maps, Google Earth for coastline data
- **APIs**: (Future) NOAA NDBC buoy data, NWS marine forecasts

### Inspiration
- **Games**: Civilization II, SimCity 2000 (retro aesthetic)
- **Educational**: PhET simulations (interactive learning)
- **Real Tools**: Surfline, Windy, Ventusky (professional forecasting)

---

## Contact & Contribution

**Repository**: https://github.com/stonezone/PacificWaves
**Developer**: Zack Jordan
**License**: (To be determined)

### Contributing
This project is currently in active development. Key areas for contribution:
- Additional storm scenarios (historical events)
- Improved coastline data (higher resolution polygons)
- Physics model refinement
- Educational content and tutorials
- Mobile optimization and PWA features

---

## Version History

- **2025-11-11 (v0.3)**: Sprite-based graphics system integrated, clean map style, bigger canvas
- **2025-11-11 (v0.2)**: Initial commit with functional simulation engine
- **2024-XX-XX (v0.1)**: Original prototype (before git)

---

## Quick Start Guide (For AI Assistants)

### Understanding the Codebase
1. Read `.claude/CLAUDE.md` for project context
2. Main logic is in `waves.html` (search for module names: Sim, Render, UI, etc.)
3. Sprite system is in `js/sprite-loader.js`
4. Physics constants are in `CONSTS` object (line ~970)
5. State management is in global `state` object (initialized in Sim.init)

### Common Tasks
- **Add new storm parameter**: Modify storm object in UI.js, update Sim calculations
- **Change map appearance**: Edit Render.drawMap() function (~line 1767)
- **Add new sprite**: Generate PNG, add to SpriteLoader.SPRITES list, update drawMap/drawSwell
- **Modify physics**: Edit Sim.stepWaveField() or Sim.calculateWaveGeneration()
- **Add UI control**: Add HTML in main file, wire up event listener in UI.init()

### Testing Checklist
- [ ] Sprites load correctly (check console for "All sprites loaded")
- [ ] Map renders with light blue ocean and coastlines
- [ ] Storms can be placed and appear as cyclone icons
- [ ] Play/Pause works and simulation advances
- [ ] Wave propagation is visible (if waves present)
- [ ] No console errors
- [ ] Canvas resizes properly on window resize

---

**Last Updated**: 2025-11-11
**Status**: Active Development (Phase 3 Complete, Phase 4 Planning)
