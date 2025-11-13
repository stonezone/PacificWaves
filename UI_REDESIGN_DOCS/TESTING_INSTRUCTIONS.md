# PacificWaves Testing Instructions

## Quick Start - Automated Testing

### Step 1: Open the Application
```bash
open /Users/zackjordan/code/PacificWaves/waves.html
```

### Step 2: Open Browser Console
- **Chrome/Safari:** Press `Cmd + Option + J` (Mac) or `Ctrl + Shift + J` (Windows)
- **Firefox:** Press `Cmd + Option + K` (Mac) or `Ctrl + Shift + K` (Windows)

### Step 3: Run the Automated Test Suite

**Option A - Load from file:**
```javascript
fetch('test-all-functions.js')
  .then(r => r.text())
  .then(eval);
```

**Option B - Copy and paste:**
1. Open `/Users/zackjordan/code/PacificWaves/test-all-functions.js`
2. Copy all contents
3. Paste into browser console
4. Press Enter

### Step 4: Review Results

The test suite will automatically:
- Test all 44 functions
- Display results in console with ✅ ⚠️ ❌ icons
- Generate a summary report
- Save results to `window.testResults`

---

## Manual Testing Checklist

### Core Functions (15 tests)

#### 1. Storm Placement
- [ ] Click "Place Storm" button (turns blue when active)
- [ ] Click on ocean area
- [ ] Verify storm appears with dashed circle
- [ ] Verify storm appears in Storms tab list
- [ ] Try clicking on land (should be prevented)

#### 2. Play/Pause Button
- [ ] Click "Play" button
- [ ] Verify button text changes to "Pause"
- [ ] Verify time display updates (T+ X.X h)
- [ ] Click "Pause" button
- [ ] Verify simulation stops
- [ ] Press Spacebar to toggle (keyboard shortcut)

#### 3. Step Button
- [ ] Ensure simulation is paused
- [ ] Click "Step" button
- [ ] Verify time advances by ~1 hour
- [ ] Verify swell rings update

#### 4. Reset Button
- [ ] Place 2-3 storms
- [ ] Let simulation run to T+ 10h
- [ ] Click "Reset" button
- [ ] Verify time returns to T+ 0.0 h
- [ ] Verify all storms removed

#### 5. Speed Slider
- [ ] Drag slider to different positions
- [ ] Verify speed multiplier changes (0.1x to 10x)
- [ ] Press + key to increase speed
- [ ] Press - key to decrease speed

#### 6. Seed Input
- [ ] Type new seed value (e.g., "test123")
- [ ] Click "Set" button
- [ ] Verify simulation reinitializes
- [ ] Verify time resets to T+ 0.0 h

#### 7. Measure Button
- [ ] Click "Measure" button (turns green when active)
- [ ] Click two points on map
- [ ] Verify green dashed line appears
- [ ] Verify distance in km displays
- [ ] Verify bearing displays
- [ ] Press Escape to deactivate

#### 8. Help Button
- [ ] Click "Help" button (? icon)
- [ ] Verify modal/dialog appears
- [ ] Verify help content is readable
- [ ] Click X or Close button
- [ ] Verify modal disappears

#### 9. Tabs - Storms Tab
- [ ] Click "Storms" tab
- [ ] Verify storm list appears
- [ ] Verify Place/Clone/Delete buttons visible

#### 10. Tabs - Sites Tab
- [ ] Click "Sites" tab
- [ ] Verify two tables appear (Peak, Current)
- [ ] Verify 6 sites listed (Haleiwa, Sunset, Pipeline, Hanalei, Tunnels, PoiPu)

#### 11. Tabs - Environment Tab
- [ ] Click "Env" tab
- [ ] Verify physics constants visible
- [ ] Verify bathymetry preset dropdown

#### 12. Tabs - Scenarios Tab
- [ ] Click "Scenarios" tab
- [ ] Verify scenario list appears
- [ ] Click "Load Scenario" button on any scenario
- [ ] Verify storms load correctly

#### 13. Tabs - Diagnostics Tab
- [ ] Click "Diag" tab
- [ ] Verify FPS counter displays
- [ ] Verify update time displays
- [ ] Verify render time displays

#### 14. Storm Editing
- [ ] Place a storm
- [ ] Click storm in list (Storms tab)
- [ ] Verify storm editor appears below
- [ ] Change wind speed (e.g., to 50 kts)
- [ ] Verify change applies immediately
- [ ] Click "Clone" button
- [ ] Verify duplicate storm appears
- [ ] Click "Delete" button
- [ ] Verify storm removed

#### 15. Background Rendering
- [ ] Verify game-background.jpeg is visible
- [ ] Verify Pacific Ocean map visible
- [ ] Verify landmasses visible (Japan, Alaska, etc.)
- [ ] Verify dark gradient overlay applied

---

## Advanced Testing

### Swell Visualization (requires storms)
1. Place storm with 40+ kts wind
2. Click Play
3. Verify radial glow rings appear around storm
4. Verify rings expand over time
5. Check FPS in Diagnostics tab (should be 50-60 FPS)

### Measurement Sites
1. Place storm near Hawaii
2. Let simulation run to T+ 24h
3. Switch to Sites tab
4. Verify measurements populate in tables
5. Verify peak values recorded
6. Verify current values update

### Keyboard Shortcuts
- [ ] Press Spacebar (Play/Pause)
- [ ] Press + key (Increase speed)
- [ ] Press - key (Decrease speed)
- [ ] Select storm, press Delete (Remove storm)
- [ ] With tool active, press Escape (Deactivate)

---

## Console Error Checking

### Expected Console Messages (GOOD)
```
🌊 Loading sprites...
✓ All sprites loaded and ready
🌊 Loading background image...
✓ Background image loaded
✓ North Shore Swell Lab initialized.
✓ Help modal displayed
```

### Expected Warnings (OK - Non-Breaking)
```
⚠️ Sprites failed to load, continuing with basic rendering
⚠️ Background image failed to load, using fallback
```

### Errors to Report (BAD)
- Red error messages
- "Uncaught TypeError"
- "Cannot read property of undefined"
- "Failed to fetch"
- Any stack traces

---

## Performance Benchmarks

### Target Performance
- **FPS:** 50-60 FPS (check in Diagnostics tab)
- **Update Time:** < 5ms per frame
- **Render Time:** < 10ms per frame

### Heavy Load Test
1. Place 10+ storms across Pacific
2. Set speed to 10x
3. Click Play
4. Check FPS in Diagnostics tab
5. FPS should stay above 30 FPS

---

## Known Issues (Expected Behavior)

### Cosmetic Issues (Safe to Ignore)
1. Unicode characters in console may show as `u2713` instead of ✓
2. Sprite loading may warn if sprite files missing (uses fallback)
3. Background may warn if image file missing (uses fallback)

### Expected Behaviors (Not Bugs)
1. Storms dissipate when moving over land (physics feature)
2. Weak storms (<15 kts) don't show swell rings (optimization)
3. Help modal auto-shows on first load (feature)
4. Step button auto-pauses if simulation running (safety feature)

---

## Reporting Issues

If you find a bug, report with:
1. **Function:** Which button/feature
2. **Expected:** What should happen
3. **Actual:** What actually happened
4. **Console:** Any error messages
5. **Steps:** How to reproduce
6. **Browser:** Chrome/Safari/Firefox + version

Example bug report:
```
Function: Play button
Expected: Simulation starts running
Actual: Button text changes but time doesn't advance
Console: "TypeError: Sim.step is not a function"
Steps: 1. Open waves.html, 2. Click Play
Browser: Chrome 120.0
```

---

## Success Criteria

### All Tests Pass When:
- ✅ All 15 manual tests complete without errors
- ✅ Automated test suite shows 95%+ pass rate
- ✅ No red errors in console (warnings OK)
- ✅ FPS stays above 30 during heavy load
- ✅ All tabs switch correctly
- ✅ Storms place and propagate correctly
- ✅ UI controls respond immediately

### Current Status (from analysis):
**43/44 functions working (97.7% success rate)**

---

## Files Generated

1. **Test Suite:** `/Users/zackjordan/code/PacificWaves/test-all-functions.js`
   - Automated browser-based tests
   - Run in console for instant results

2. **Test Report:** `/Users/zackjordan/code/PacificWaves/COMPREHENSIVE_TEST_REPORT.md`
   - Detailed analysis of all functions
   - Code locations and status
   - Issues and recommendations

3. **This File:** `/Users/zackjordan/code/PacificWaves/TESTING_INSTRUCTIONS.md`
   - Quick reference for testing
   - Manual test checklist
   - Error reporting guide

---

Happy Testing!
