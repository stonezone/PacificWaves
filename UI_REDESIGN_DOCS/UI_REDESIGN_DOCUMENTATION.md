# PacificWaves UI Redesign Documentation

## Overview

This document outlines the comprehensive UI/UX redesign for PacificWaves, transforming the cramped, unclear interface into a modern, spacious, and intuitive experience.

---

## Design Philosophy

### Core Principles

1. **Information Hierarchy** - Clear visual distinction between primary, secondary, and tertiary content
2. **Generous Spacing** - Proper breathing room between elements (8px base unit)
3. **Card-Based Architecture** - Group related information in visually distinct containers
4. **Real-Time Feedback** - Always show current simulation state and measurements
5. **Progressive Disclosure** - Show essential info first, details on demand

---

## Layout Structure

### Grid System

```
┌─────────────────────────────────────────────────────────────┐
│  STATUS BAR (64px height)                                   │
│  Time | Speed | Storms | FPS | [Play] [Step] [Reset]       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │                      │  │  TAB BAR (48px)            │  │
│  │                      │  │  [Storms] [Sites] [Env]    │  │
│  │   CANVAS AREA        │  ├────────────────────────────┤  │
│  │   (Flexible)         │  │                            │  │
│  │                      │  │   PANEL CONTENT            │  │
│  │   Pacific Ocean      │  │   (420px wide)             │  │
│  │   Simulation         │  │                            │  │
│  │                      │  │   - Storm Cards            │  │
│  │                      │  │   - Site Measurements      │  │
│  │                      │  │   - Controls               │  │
│  └──────────────────────┘  └────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dimensions

- **Side Panel Width**: 420px (min 380px, max 45% viewport)
- **Status Bar Height**: 64px
- **Tab Bar Height**: 48px
- **Canvas**: Flexible (fills remaining space)

---

## Design System

### Spacing Scale

Based on 8px increments:

```css
--space-xs: 4px    /* Tight spacing within elements */
--space-sm: 8px    /* Default gap between related items */
--space-md: 16px   /* Gap between sections */
--space-lg: 24px   /* Major section padding */
--space-xl: 32px   /* Large section breaks */
--space-2xl: 40px  /* Page-level spacing */
--space-3xl: 48px  /* Maximum spacing */
```

### Color Palette

**Backgrounds:**
- `--bg-deep: #0a0f14` - Canvas background
- `--bg-main: #111827` - Base background
- `--bg-panel: #1f2937` - Panel background
- `--bg-header: #374151` - Header/tabs
- `--bg-control: #4b5563` - Buttons
- `--card-bg: #1a2332` - Card backgrounds

**Text:**
- `--text-light: #f3f4f6` - Primary text
- `--text-heading: #e5e7eb` - Headers
- `--text-dim: #9ca3af` - Secondary text

**Accent Colors:**
- `--accent-blue: #3b82f6` - Primary actions
- `--accent-green: #22c55e` - Success/active
- `--accent-red: #ef4444` - Danger/warning
- `--accent-yellow: #eab308` - Highlights

**Status Indicators:**
- `--status-active: #22c55e` - Active storms
- `--status-warning: #eab308` - Warning states
- `--status-danger: #ef4444` - Critical states
- `--status-info: #3b82f6` - Information

### Typography

**Font Families:**
```css
--font-family: system-ui, -apple-system, sans-serif
--font-family-mono: 'SF Mono', Consolas, monospace
```

**Font Sizes:**
- Headings: 16-20px (bold, tight letter-spacing)
- Body: 13-14px (regular weight)
- Labels: 11-12px (medium weight, uppercase)
- Data: 13-15px (mono, bold)

### Border Radius

```css
--radius-sm: 4px    /* Small inputs */
--radius-md: 8px    /* Buttons */
--radius-lg: 12px   /* Cards */
--radius-xl: 16px   /* Modal windows */
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.2)
```

---

## Component Library

### 1. Status Bar

**Location**: Top of screen
**Purpose**: Show real-time simulation state

**Elements**:
- Simulation time (T+ hours)
- Speed multiplier
- Active storm count
- FPS counter
- Play/Pause/Step/Reset buttons

**Visual Design**:
```css
padding: 16px 24px
background: var(--bg-panel)
border-bottom: 2px solid var(--border-color)
display: flex with gap: 24px
```

### 2. Storm Cards

**Purpose**: Display individual storm information with clear visual hierarchy

**Structure**:
```html
<div class="storm-card [selected]">
  <header>
    <h4>Storm Name</h4>
    <status-badge>Active</status-badge>
  </header>

  <stats-grid>
    <stat>Wind Speed: 45 kts</stat>
    <stat>Position: 45°N 180°W</stat>
    <stat>Direction: SE (135°)</stat>
    <stat>Radius: 300 nm</stat>
  </stats-grid>

  <actions>
    <button>Edit</button>
    <button>Locate</button>
    <button>Clone</button>
  </actions>
</div>
```

**Visual Features**:
- 2px border (blue when selected)
- 16px padding
- 12px border-radius
- Hover: translateY(-2px) + shadow
- Selected: blue border + blue background tint
- Animated status dot (pulse)

### 3. Site Measurements

**Purpose**: Show real-time wave conditions at monitoring sites

**Structure**:
```html
<div class="site-measurement">
  <header>
    <name>Oahu North Shore</name>
    <trend-icon>↗</trend-icon>
  </header>

  <metrics-grid>
    <metric>
      <value>4.2m</value>
      <label>Height</label>
    </metric>
    <metric>
      <value>14s</value>
      <label>Period</label>
    </metric>
    <metric>
      <value>315°</value>
      <label>Direction</label>
    </metric>
  </metrics-grid>

  <progress-bar>
    <label>Peak: 6.8m @ T+36h</label>
  </progress-bar>
</div>
```

**Visual Features**:
- Card background
- 3-column grid for metrics
- Large metric values (20px, bold, mono)
- Trend arrows (↗ green, ↘ red, → gray)
- Progress bar showing current vs peak

### 4. Information Cards

**Purpose**: Group related data in visually distinct containers

**Types**:

**Basic Info Card**:
- Used for breaking wave conditions
- Header with title + badge
- Key-value pairs in rows
- Optional footer with status indicator

**Storm Editor Card**:
- Form inputs in 2-column grid
- Consistent input styling
- Apply button at bottom

**Scenario Card**:
- Title + description
- Load/Edit buttons
- Hover effects

### 5. Tables

**Purpose**: Display tabular data (peak forecasts, current conditions)

**Enhanced Styling**:
- Separate border-spacing (not collapsed)
- Sticky header with background
- Hover row highlight
- Peak values in yellow
- Right-aligned numeric data (mono font)
- Left-aligned labels

### 6. Buttons

**Types**:

**Primary Buttons**:
```css
background: var(--accent-blue)
color: white
padding: 12px 16px
font-weight: 600
border-radius: 8px
hover: darken + translateY(-2px)
```

**Secondary Buttons**:
```css
background: var(--bg-control)
border: 1px solid var(--border-color)
hover: border-color blue
```

**Danger Buttons**:
```css
border: 2px solid var(--accent-red)
color: var(--accent-red)
hover: background red + color white
```

**Icon Buttons**:
- Small (32px × 32px)
- Icon + optional text
- Used in storm card actions

### 7. Status Indicators

**Badge**:
- Rounded pill shape
- Small (11-12px text)
- Background + contrasting text
- Used for counts, status labels

**Indicator Dot**:
- 6-8px circle
- Solid color
- Animated pulse for "active" state
- Used before status text

**Trend Arrows**:
- Large (18-20px)
- Color-coded: ↗ green, ↘ red, → gray
- Used in site measurements

### 8. Progress Bars

**Purpose**: Show progress toward peak conditions

**Design**:
- 6px height
- Rounded ends
- Gradient fill (blue → green or blue → yellow)
- Labels below: min, peak info, max
- Percentage-based width

---

## Tab Organization

### Storms Tab

**Content**:
1. Section header with active count badge
2. Action buttons (Place/Clone/Delete)
3. List of storm cards (scrollable)
4. Selected storm editor panel

**Layout**:
- Vertical stack
- 24px padding
- 16px gaps between sections

### Sites Tab

**Content**:
1. Section header
2. Current conditions (3 site measurement cards)
3. Peak forecast table
4. Nearshore breaking conditions (3 break cards)

**Information Density**:
- More dense than Storms tab
- Cards show real-time data
- Progress bars show forecasts

### Environment Tab

**Content**:
1. Bathymetry selector
2. Physics constants (2-column grid)
3. Reset button

**Purpose**: Advanced settings, less frequently accessed

### Scenarios Tab

**Content**:
1. List of scenario cards
2. Current scenario display
3. Load buttons

**Interaction**:
- Click card to preview
- Click "Load" to apply

### Diagnostics Tab

**Content**:
1. Self-check results
2. Performance metrics table
3. Simulation log (monospace)

**Purpose**: Developer/debugging info

---

## Information Hierarchy

### Primary Information (Always Visible)

1. **Simulation State**: Time, speed, status
2. **Active Storms**: Count and list
3. **Site Conditions**: Current measurements

### Secondary Information (One Click)

1. **Storm Details**: Full parameters in editor
2. **Peak Forecasts**: Table of predicted maximums
3. **Breaking Conditions**: Nearshore wave heights

### Tertiary Information (Two Clicks)

1. **Physics Constants**: Advanced tunables
2. **Diagnostics**: Performance metrics
3. **Logs**: Debug output

---

## Interaction Patterns

### Storm Management

**Place Storm**:
1. Click "Place Storm" button (turns blue)
2. Canvas cursor changes to crosshair
3. Click ocean location
4. New storm appears in list (selected)
5. Editor panel shows storm parameters

**Edit Storm**:
1. Click storm card to select
2. Edit values in editor panel
3. Changes apply in real-time
4. Drag storm on canvas to reposition

**Delete Storm**:
1. Select storm card
2. Click "Delete" button (red)
3. Confirmation (optional)
4. Storm removed from list and canvas

### Site Monitoring

**View Current Conditions**:
- Sites tab shows live data
- Updates every simulation tick
- Trend arrows show rising/falling

**View Forecast**:
- Scroll to "Peak Forecast" table
- See maximum expected values
- Time shows when peak occurs

**Breaking Waves**:
- Scroll to "Nearshore Breaking"
- Cards show surf heights
- Status indicators show quality

### Simulation Control

**Play/Pause**:
- Click Play button (or spacebar)
- Button changes to "Pause"
- Simulation advances

**Speed Control**:
- Adjust slider
- Value shows multiplier (0.5x - 5.0x)
- Real-time update

**Reset**:
- Click Reset button
- Confirmation prompt
- Simulation returns to T=0

---

## Accessibility Features

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys in sliders
- Escape to cancel tools

### Focus Indicators

```css
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5)
```

### ARIA Labels

- All interactive elements have labels
- Status messages use `aria-live`
- Tabs use proper ARIA roles

### Color Contrast

- All text meets WCAG AA standards
- Color is not sole indicator (icons + text)

---

## Responsive Behavior

### Desktop (> 1200px)

- Side panel: 420px wide
- Storm cards: 2-column stat grid
- All features visible

### Tablet (768px - 1200px)

- Side panel: 380px wide
- Storm cards: 2-column stat grid
- Slightly tighter spacing

### Mobile (< 768px)

- Side panel: Full width, bottom half of screen
- Storm cards: 1-column stat grid
- Tabs scroll horizontally
- Buttons stack vertically

---

## Animation & Transitions

### Hover Effects

```css
transition: all 0.15s ease-out
transform: translateY(-2px)
box-shadow: enhanced
```

### Tab Switching

```css
@keyframes fadeInUp {
  from: opacity 0, translateY(10px)
  to: opacity 1, translateY(0)
}
duration: 0.2s
```

### Status Pulse

```css
@keyframes pulse {
  0%, 100%: opacity 1
  50%: opacity 0.5
}
duration: 2s infinite
```

---

## Implementation Guide

### Step 1: Add CSS File

Link the new CSS file in `waves.html`:

```html
<link rel="stylesheet" href="css/improved-layout.css">
```

### Step 2: Update HTML Structure

Replace existing storm list with storm cards:

```html
<!-- OLD -->
<ul id="stormList">
  <li>Storm 1: 45N 180W</li>
</ul>

<!-- NEW -->
<div id="stormCardContainer">
  <!-- JS will populate with storm cards -->
</div>
```

### Step 3: Add Status Bar

Insert at top of main content:

```html
<div class="sim-status-bar">
  <div class="status-item">
    <div class="status-item-label">Time</div>
    <div class="status-item-value" id="statusTime">T+ 0.0 h</div>
  </div>
  <!-- more status items -->
</div>
```

### Step 4: Enhance Site Tab

Replace table with measurement cards:

```html
<div id="siteMeasurements">
  <!-- JS will populate with site-measurement divs -->
</div>
```

### Step 5: Update JavaScript

Modify rendering functions to populate new elements:

```javascript
// Storm card template
function createStormCard(storm) {
  return `
    <div class="storm-card" data-id="${storm.id}">
      <div class="storm-card-header">
        <h4 class="storm-name">${storm.name}</h4>
        <div class="storm-status active">
          <span class="storm-status-dot"></span>
          Active
        </div>
      </div>
      <div class="storm-stats">
        <div class="storm-stat">
          <div class="storm-stat-label">Wind Speed</div>
          <div class="storm-stat-value">
            ${storm.maxWind} <span class="unit">kts</span>
          </div>
        </div>
        <!-- more stats -->
      </div>
      <div class="storm-card-actions">
        <button class="storm-action-btn">Edit</button>
        <button class="storm-action-btn">Locate</button>
        <button class="storm-action-btn">Clone</button>
      </div>
    </div>
  `;
}

// Update storm list display
function updateStormDisplay() {
  const container = document.getElementById('stormCardContainer');
  container.innerHTML = storms.map(createStormCard).join('');
}
```

---

## Comparison: Before vs After

### Before (Current)

**Issues**:
- Controls cramped at bottom
- No visual hierarchy
- Missing real-time feedback
- Storm info hidden in form
- Sites tab shows only tables
- Poor spacing throughout

**Layout**:
- Tabs at bottom-left (awkward)
- Side panel 300px (too narrow)
- No status bar
- Basic HTML list for storms

### After (Redesigned)

**Improvements**:
- Generous spacing (8px system)
- Clear visual hierarchy (cards, headers)
- Real-time status bar at top
- Storm cards with all info visible
- Site measurements with progress bars
- Modern card-based architecture

**Layout**:
- Tabs at top of side panel
- Side panel 420px (more spacious)
- Status bar shows sim state
- Storm cards with stats + actions

---

## File Structure

```
/css/
  improved-layout.css          # New design system CSS

/docs/
  UI_LAYOUT_REDESIGN.html      # Storms tab example
  UI_SITES_TAB_EXAMPLE.html    # Sites tab example
  UI_REDESIGN_DOCUMENTATION.md # This file

/waves.html
  # Update to import new CSS
  # Modify HTML structure
  # Update JS rendering functions
```

---

## Future Enhancements

### Phase 2 Improvements

1. **Forecast Charts**: Line graph showing wave height over time
2. **Storm Tracks**: Historical path visualization
3. **Wind Barbs**: Standard meteorological symbols
4. **Comparison Mode**: Side-by-side scenario comparison
5. **Mobile Gestures**: Pinch-zoom, swipe between tabs
6. **Dark/Light Toggle**: User preference (currently dark only)

### Advanced Features

1. **Export Reports**: PDF/PNG of current conditions
2. **Share Scenarios**: URL with encoded storm data
3. **Replay Mode**: Time-lapse visualization
4. **Multi-Site Graph**: Overlay multiple site forecasts
5. **Alert Notifications**: When peak conditions approach

---

## Testing Checklist

### Visual Testing

- [ ] Spacing consistent across all tabs
- [ ] Cards have proper shadows and borders
- [ ] Hover effects work smoothly
- [ ] Text is readable (contrast)
- [ ] Icons align properly
- [ ] Progress bars fill correctly

### Functional Testing

- [ ] Storm cards update in real-time
- [ ] Site measurements show live data
- [ ] Status bar reflects sim state
- [ ] Buttons trigger correct actions
- [ ] Tab switching works smoothly
- [ ] Forms submit correctly

### Responsive Testing

- [ ] Desktop (1920×1080)
- [ ] Laptop (1366×768)
- [ ] Tablet portrait (768×1024)
- [ ] Tablet landscape (1024×768)
- [ ] Mobile (375×667)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast passes WCAG AA

---

## Credits

**Design System Inspired By**:
- Tailwind CSS (spacing scale)
- GitHub (dark theme colors)
- Linear (card-based UI)
- Figma (component architecture)

**Surf Forecasting References**:
- Surfline
- NOAA Wave Watch III
- Windy.com
- Magic Seaweed

---

## Questions & Support

For questions about implementation:
1. Review examples in `UI_LAYOUT_REDESIGN.html`
2. Check CSS comments in `improved-layout.css`
3. Reference this documentation

For design decisions:
- Spacing: 8px base unit maintains consistency
- Colors: Dark theme reduces eye strain for long sessions
- Cards: Group related info for easier scanning
- Mono fonts: Used for data (numbers, coordinates)

---

**Last Updated**: 2025-11-12
**Version**: 1.0
**Author**: Claude (UI/UX Design Assistant)
