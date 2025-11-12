# Button Debug Checklist

## The retro UI looks correct! ✅

From the screenshot, I can see:
- Gray retro panels
- 3D beveled buttons
- Blue headers
- Terminal-style displays
- Classic tabs

## Debugging Non-Working Buttons

### Step 1: Open Browser Console
1. Press **F12** or **Cmd+Option+I** (Mac)
2. Click the **Console** tab
3. Look for red error messages

### Step 2: Check for Common Errors

**Sprite Loading Errors:**
```
Access to script at '.../sprite-loader.js' from origin 'null' has been blocked
```
**Fix:** Make sure you're using `http://localhost:8000/waves.html`, NOT `file://`

**Initialization Errors:**
```
Cannot read property 'addEventListener' of null
```
**Fix:** Element ID mismatch or DOM not ready

**State Not Defined:**
```
State is not defined
ReferenceError: State is not defined
```
**Fix:** State object initialization failed

### Step 3: Test Buttons Manually

In the console, try these commands:

```javascript
// Test if UI module exists
UI

// Test if State exists
State

// Try clicking a button directly
document.getElementById('playPauseButton').click()

// Check if event listener is attached
document.getElementById('playPauseButton')
```

### Step 4: Verify Server is Running

```bash
# In terminal
lsof -i :8000

# Should show python3 server running
```

### Step 5: Hard Refresh

Sometimes cached JavaScript causes issues:
- **Mac:** Cmd+Shift+R
- **Windows:** Ctrl+Shift+R
- **Or:** Clear cache in DevTools (Network tab → Disable cache checkbox)

### Step 6: Check Network Tab

1. Open DevTools → Network tab
2. Refresh page
3. Look for failed requests (red)
4. Common issues:
   - sprite-loader.js (404 or CORS error)
   - sprite images (404)
   - CSS files (404)

### Step 7: Test Basic Functionality

Try these interactions:
1. **Click PLAY button** - Should change to PAUSE
2. **Click canvas** - Should respond to mouse
3. **Press SPACEBAR** - Should toggle play/pause
4. **Move speed slider** - Should update display

### Step 8: Check JavaScript Console Log

Look for these initialization messages:
```
[SpriteLoader] Starting to load sprites...
[SpriteLoader] All sprites loaded successfully
[App] Initialization complete
```

---

## Most Likely Issues

### Issue 1: Sprites Not Loading (CORS)
**Symptom:** Red errors about "blocked by CORS policy"
**Solution:**
```bash
# Make sure server is running
cd /Users/zackjordan/code/PacificWaves
python3 server.py

# Then open: http://localhost:8000/waves.html
# NOT: file:///Users/zackjordan/code/PacificWaves/waves.html
```

### Issue 2: State Object Not Initialized
**Symptom:** Buttons don't respond, no console errors
**Solution:** Check if initialization completed:
```javascript
// In console
State
// Should show object with properties, not "undefined"
```

### Issue 3: Event Listeners Not Attached
**Symptom:** Console shows "null" when clicking
**Solution:** Ensure DOM is loaded before binding:
```javascript
// Check if elements exist
document.getElementById('playPauseButton')
// Should show: <button id="playPauseButton">...</button>
```

### Issue 4: Cached Old JavaScript
**Symptom:** Old UI behavior persists
**Solution:**
- Hard refresh (Cmd+Shift+R)
- Or disable cache in DevTools
- Or clear browser cache completely

---

## Quick Test Script

Paste this into the console to diagnose:

```javascript
console.log('=== PacificWaves Debug ===');
console.log('UI module:', typeof UI);
console.log('State object:', typeof State);
console.log('Sim module:', typeof Sim);
console.log('Render module:', typeof Render);

console.log('\n=== Button Elements ===');
console.log('Play button:', document.getElementById('playPauseButton'));
console.log('Step button:', document.getElementById('stepButton'));
console.log('Reset button:', document.getElementById('resetButton'));

console.log('\n=== Sprite Loader ===');
console.log('Sprites:', window.sprites);
console.log('Loaded:', window.sprites?.loaded);

console.log('\n=== Try clicking ===');
document.getElementById('playPauseButton')?.click();
```

---

## Expected Console Output (When Working)

```
[SpriteLoader] Starting to load sprites...
[SpriteLoader] Loaded: ocean_tile (64x64)
[SpriteLoader] Loaded: deep_ocean_tile (64x64)
[SpriteLoader] Loaded: oahu_island (128x96)
[SpriteLoader] Loaded: kauai_island (32x24)
[SpriteLoader] Loaded: storm_weak (32x32)
[SpriteLoader] Loaded: storm_moderate (48x48)
[SpriteLoader] Loaded: storm_strong (64x64)
[SpriteLoader] Loaded: wave_ripple (64x64)
[SpriteLoader] Loaded: surf_spot_marker (24x24)
[SpriteLoader] All sprites loaded successfully
[App] Initialization complete
[Self-check] All tests passed ✓
```

---

## If Nothing Works

### Nuclear Option: Start Fresh

```bash
# 1. Kill any running servers
lsof -ti:8000 | xargs kill -9

# 2. Pull latest changes
cd /Users/zackjordan/code/PacificWaves
git pull origin claude/improve-ui-design-011CV3HH9XD9ZN2cwwEhzVAFy

# 3. Start clean server
python3 server.py

# 4. Open in INCOGNITO window (fresh cache)
# Cmd+Shift+N (Chrome) or Cmd+Shift+P (Firefox)
# Then: http://localhost:8000/waves.html
```

---

## Report Back

When reporting issues, please provide:
1. **Console errors** (copy/paste red errors)
2. **Network tab** (any failed requests?)
3. **What happens when you click** (nothing? error? partial response?)
4. **Browser/version** (Chrome 120? Safari 17?)

This will help me fix the exact issue!
