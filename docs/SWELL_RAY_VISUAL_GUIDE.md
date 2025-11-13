# Swell Ray Visualization - Visual Guide

## What You'll See

### Before (Old):
- Storms appeared as simple icons
- No swell visualization
- Couldn't see wave propagation

### After (New - Phase 5):
```
         🌀 STORM
        /||||||||\
       / ||||||||| \
      /  |||||||||  \
     /   |||  ||||   \
    /    ||    |||    \
   /     |      ||     \
  /             ||      \
 /               |       \
~~~~~~~~~~~~~~~~ (land) ~~
     \     |    /
      \    |   /
       \   |  /
        \  | /
         \ |/
          🏄 SURF SPOT
```

### Visual Elements

#### 1. Swell Rays
- **Appearance**: Semi-transparent blue lines
- **Count**: 24 rays per storm (every 15°)
- **Color**: Varies by wave height
  - Light cyan: Small waves (< 3m)
  - Light blue: Moderate (3-6m)
  - Blue: Large (6-10m)
  - Deep blue: Huge (> 10m)

#### 2. Land Bending
```
BEFORE LAND:
Storm → → → → → →
                |

HITTING LAND:
Storm → → → ⛰️
            ↓
            ↓

BENDING AROUND:
Storm → → → ⛰️
            ⤵
             →
              →
```

#### 3. Period Growth
```
NEAR STORM (tight spacing):
|||||||||||||||

MID-DISTANCE (wider):
|| || || || || ||

FAR FROM STORM (very wide):
|   |   |   |   |
```

## Real-World Comparison

### Example: Aleutian Storm → Hawaii

**Storm Position**: 52°N, 180°W (Aleutian Islands)
**Storm Parameters**:
- Wind: 45 kts
- Radius: 200 nm
- Direction: Southeast

**Expected Visualization**:

1. **Origin**: Bright blue rays emanate from storm center
2. **Alaska/Aleutians**: Rays bend around Alaskan Peninsula
3. **Open Pacific**: Rays spread and fade as they propagate south
4. **Period Growth**: Spacing widens (short period → long period)
5. **Hawaii**: Arriving rays show focused energy on north shores
6. **Energy Decay**: Rays are semi-transparent by arrival

### Color Coding (Wave Energy)

```
Storm Parameters     | Estimated Hs | Ray Color
---------------------|--------------|------------------
15 kts, 50 nm       | ~1.5m        | Light cyan (faint)
30 kts, 100 nm      | ~4.5m        | Light blue
45 kts, 200 nm      | ~9m          | Blue (bold)
60 kts, 300 nm      | ~13m         | Deep blue + glow
```

## Interactive Features

### 1. Storm Placement
- **Click map** to create storm
- **Adjust wind/radius** in controls
- **Watch rays update** in real-time

### 2. Ray Behavior
- **Weak storms** (< 15 kts): No rays shown
- **Moderate storms**: Partial ray coverage
- **Strong storms**: Full 360° ray emission
- **Land blocking**: Rays stop or deflect

### 3. Movement
- **Drag storm**: Rays recalculate from new position
- **Change wind**: Ray color/intensity updates
- **Change radius**: Ray reach extends/contracts

## Visual Effects

### Transparency
- **Near storm**: More opaque (high energy)
- **Far from storm**: More transparent (energy decay)
- **Land collision**: Abrupt transparency increase (energy loss)

### Glow Effect
- **Triggers**: Wave height > 8m
- **Appearance**: Soft blue halo around ray
- **Purpose**: Highlight powerful swells

### Line Width
- **Thin (0.5px)**: Small waves (< 2m)
- **Medium (1-2px)**: Moderate (2-8m)
- **Thick (3px)**: Large waves (> 8m)

## Comparison with Real Swell Models

### Similarities to NOAA/Surfline:
✅ Directional propagation
✅ Energy decay with distance
✅ Land blocking/refraction
✅ Period growth
✅ Wave height estimation

### Educational Simplifications:
⚠️ No bathymetric refraction (depth-based bending)
⚠️ Simplified land deflection (not true Snell's law)
⚠️ No directional spreading (rays are independent)
⚠️ Grid-based (not continuous wave field)

## Usage Tips

### Best Viewing
1. **Zoom**: Set canvas to fullscreen for best view
2. **Contrast**: Rays show best on dark ocean background
3. **Storm count**: 1-3 storms optimal for clarity
4. **Parameters**: Use realistic values (30-60 kts, 100-300 nm)

### Testing Scenarios

#### Scenario 1: North Pacific Classic
```
Storm: 45°N, 170°W
Wind: 50 kts
Radius: 250 nm
Expected: Rays bend around Aleutians, reach Hawaii ~2000 km away
```

#### Scenario 2: Island Shadow
```
Storm: 30°N, 160°W
Wind: 40 kts
Radius: 150 nm
Expected: Big Island blocks rays, leeward shores protected
```

#### Scenario 3: Multi-Swell
```
Storm A: 50°N, 180°W (NW swell)
Storm B: 20°N, 140°W (S swell)
Expected: Overlapping rays at Hawaii, different colors/angles
```

## Performance Indicators

### Good Performance (60 FPS):
- 1-3 active storms
- Rays render smoothly
- No lag when moving storms

### Degraded Performance (< 30 FPS):
- 5+ active storms
- Stuttering ray updates
- Slow storm dragging

**Solution**: Delete older storms or reduce `rayAngleStep` (e.g., 30°)

## Troubleshooting

### "No rays visible"
- Check storm wind speed (must be ≥ 15 kts)
- Verify storm is over ocean (not land)
- Check browser console for errors

### "Rays look blocky"
- Expected: Grid-based (200×160 cells)
- Smoothing: Decrease `stepSize` (slower)

### "Rays don't bend around land"
- Verify `staticGrid.isLand` populated
- Check land boundaries defined correctly
- Test with Hawaii (known land feature)

### "Colors too faint"
- Increase base alpha in `getSwellColor()`
- Adjust `finalAlpha` multiplier in `drawRayPath()`
- Increase line width

### "Performance issues"
- Reduce `rayAngleStep` (24 → 12 rays)
- Reduce `maxDistance` (150 → 100 cells)
- Limit active storms to 2-3

## Advanced Customization

### Make Rays More Visible
```javascript
// In getSwellColor(), increase alpha values:
alpha: 0.25 → 0.50 (small waves)
alpha: 0.35 → 0.60 (moderate)
alpha: 0.45 → 0.70 (large)
alpha: 0.55 → 0.80 (huge)
```

### Denser Ray Coverage
```javascript
// In drawSwell():
const rayAngleStep = 15; // Change to 10 or 5
// More rays = smoother coverage, but slower
```

### Longer Ray Propagation
```javascript
// In drawSwell():
const maxDistance = 150; // Change to 200 or 250
// Longer rays = see full Pacific propagation
```

### Smoother Curves
```javascript
// In drawSwell():
const stepSize = 1.5; // Change to 1.0 or 0.5
// Smaller steps = smoother curves, but slower
```

## Visual Glossary

**Ray**: Single directional swell line from storm
**Spacing**: Distance between ray segments (period growth)
**Energy decay**: Gradual fading of ray transparency
**Refraction**: Ray bending when hitting land
**Glow**: Soft halo on high-energy rays
**Color gradient**: Light→dark blue based on wave height

---

**Ready to Test!**

Open `waves.html` in your browser and create a storm to see realistic swell ray propagation in action!
