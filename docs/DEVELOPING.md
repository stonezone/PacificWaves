# PacificWaves Development Guide

This guide helps new contributors get started with developing PacificWaves.

## Prerequisites

- **Node.js** v14+ (for `npm run serve-node`)
- **Python** 3.7+ (for `npm run serve-python`)
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git for version control

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/stonezone/PacificWaves.git
   cd PacificWaves
   ```

2. **Start a development server**

   Choose your preferred method:

   ```bash
   # Node.js server (recommended - has security fixes)
   npm run serve-node

   # Python server (fallback option)
   npm run serve-python

   # Or use the default
   npm start
   ```

3. **Open in browser**
   Navigate to http://localhost:8000/waves.html

## Project Structure

```
PacificWaves/
├── waves.html              # Main application file
├── server.cjs              # Node.js development server (CommonJS)
├── package.json            # Project metadata and npm scripts
│
├── src/                    # Source modules
│   ├── core/               # Core systems
│   │   ├── constants.js    # Physics constants, map projections
│   │   ├── prng.js         # Pseudo-random number generator
│   │   ├── state-manager.js # State management with undo/redo
│   │   ├── validation.js   # Input validation and XSS protection
│   │   ├── error-boundary.js # Error handling wrapper
│   │   └── feature-detector.js # Browser capability detection
│   │
│   └── utilities/          # Utility functions
│       └── coordinate-utils.js # Geographic calculations
│
├── css/                    # Stylesheets
│   └── forecast-theme.css  # Professional forecast UI theme
│
└── docs/                   # Documentation
    ├── DEVELOPING.md       # This file
    └── REFACTOR_SUMMARY.md # Architecture refactor details
```

## Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test in browser (refresh to see updates)

4. Use browser DevTools console to check for errors

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/updates
- `chore:` Build/tooling changes
- `security:` Security fixes

## Testing

### Browser Console Tests

PacificWaves includes a built-in test suite accessible via the browser console.

1. Open browser DevTools (F12 or right-click → Inspect)
2. Open Console tab
3. Run tests:
   ```javascript
   // Run all tests
   Tests.runAll()

   // Run specific test
   Tests.testGridCoordinates()
   Tests.testLatLonConversions()
   Tests.testBilinearInterpolation()
   Tests.testPRNG()
   ```

### Debug Helpers

Use these console commands for debugging:

```javascript
// Inspect current state
App.state

// Get specific storm
App.state.storms[0]

// Toggle debug mode (if implemented)
App.debug = true

// Access constants
CONSTS

// Test coordinate conversion
Utils.latLonToCell(21.5, 202.2)
```

### Feature Detection

Check browser compatibility:

```javascript
FeatureDetector.runChecks()
FeatureDetector.getBrowserInfo()
```

## Common Tasks

### Adding a New Module

1. Create file in `src/core/` or `src/utilities/`
2. Use ES6 module syntax:
   ```javascript
   export class MyModule {
     // ... your code
   }
   ```
3. Import in `waves.html`:
   ```javascript
   import { MyModule } from './src/core/my-module.js';
   ```

### Updating Physics Constants

Edit `src/core/constants.js`:

```javascript
export const CONSTS = {
  // Add your constant here
  MY_CONSTANT: 42,
  // ...
};
```

### Adding Land Polygons

Edit `LAND_POLYGONS` in `src/core/constants.js`:

```javascript
LAND_POLYGONS: {
  myIsland: [
    [lat1, lon1],
    [lat2, lon2],
    // ... more points (closed polygon)
  ]
}
```

### Using State Manager

```javascript
// Update state without history
stateManager.update({ paused: true });

// Update state WITH history (undo-able)
stateManager.updateWithHistory({ stormLat: 35 });

// Listen for state changes
stateManager.on('update', (newState) => {
  console.log('State changed:', newState);
});

// Undo/Redo
stateManager.undo();
stateManager.redo();
```

## Code Style

- **Language**: ES6+ JavaScript (module pattern)
- **Naming**:
  - camelCase for variables and functions
  - UPPER_CASE for constants
  - PascalCase for classes
- **Indentation**: 4 spaces
- **Comments**: JSDoc for functions, inline for complex logic
- **Line length**: 120 characters (soft limit)

## Performance Considerations

### Typed Arrays
Physics grids use `Float32Array` and `Uint8Array` for performance:
- Faster than regular arrays
- Fixed memory layout
- Not JSON serializable (excluded from state history)

### Animation Loop
- Uses `requestAnimationFrame` for smooth 60 FPS
- Physics updates in fixed timesteps
- Rendering decoupled from physics

### State History
- Only control state is saved (not physics grids)
- Limited to 50 snapshots to prevent memory bloat
- Use `updateWithHistory()` sparingly (only for user actions)

## Security Best Practices

### Input Validation
Always validate user input:

```javascript
import { Validator } from './src/core/validation.js';

// Validate storm config
const validConfig = Validator.validateStormConfig({
  lat: userInput.lat,
  lon: userInput.lon,
  wind: userInput.wind
});
```

### XSS Prevention
User-generated text is automatically sanitized:

```javascript
// Automatic sanitization if schema has sanitize: true
const safe = Validator.sanitizeHTML(userInput);
```

### Content Security Policy
CSP headers prevent inline script execution. Avoid:
- `eval()`
- `innerHTML` with unsanitized data
- Inline event handlers (`onclick="..."`)

## Troubleshooting

### Module Import Errors
- Ensure file extension is `.js` or `.mjs`
- Check `package.json` has `"type": "module"`
- Use relative paths: `'./src/core/module.js'`

### State Not Updating
- Check if you called `update()` or `updateWithHistory()`
- Verify listeners are registered: `stateManager.on('update', ...)`
- Look for errors in browser console

### Physics Grid Issues
- Verify grid dimensions match `CONSTS.GRID_WIDTH/HEIGHT`
- Check bounds: `0 <= i < GRID_WIDTH`, `0 <= j < GRID_HEIGHT`
- Use `Utils.clamp()` for boundary values

### Server Port Conflicts
If port 8000 is in use:

```bash
# For Node server
PORT=3000 npm run serve-node

# For Python server
python3 -m http.server 3000
```

## Resources

- **Repository**: https://github.com/stonezone/PacificWaves
- **Issues**: https://github.com/stonezone/PacificWaves/issues
- **MDN Web Docs**: https://developer.mozilla.org/
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

## Getting Help

- Check existing issues on GitHub
- Ask questions in GitHub Discussions
- Review code comments and JSDoc
- Use browser DevTools for debugging

## Contributing

See the main README.md for contribution guidelines.

---

**Happy Coding!** 🌊

Generated with [Claude Code](https://claude.com/claude-code)
