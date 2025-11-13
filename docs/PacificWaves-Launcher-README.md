# 🌊 PacificWaves Launcher

## What is this?

**PacificWaves.app** is a native macOS launcher that makes running the PacificWaves game feel like a real app!

## How it works

1. **Double-click PacificWaves.app**
2. The app automatically:
   - Starts a local web server (port 8000)
   - Opens your default browser to the game
   - Shows a notification when ready
3. **Play the game!**
4. **When you're done:**
   - Quit the PacificWaves app from the dock (Cmd+Q)
   - Or right-click the app icon → Quit
   - The server automatically shuts down

## Features

✅ **One-click launch** - No terminal commands needed
✅ **Auto-cleanup** - Server stops when you quit the app  
✅ **macOS native** - Appears in Dock and App Switcher  
✅ **Notifications** - Shows status messages  
✅ **Zero configuration** - Just works!

## Installation

1. **Move PacificWaves.app to your Applications folder** (optional but recommended)
2. **Double-click to run**
3. First time: macOS may ask for permission to run - click "Open"

## Troubleshooting

**"App can't be opened" error:**
- Right-click the app → Open (first time only)
- Or go to System Settings → Privacy & Security → Click "Open Anyway"

**Server won't start:**
- Make sure port 8000 isn't already in use
- Quit any existing Python servers

**Browser doesn't open:**
- Check your default browser is set
- Manually navigate to: http://localhost:8000/waves.html

## Advanced

**To quit the server manually:**
```bash
# Kill any server on port 8000
lsof -ti:8000 | xargs kill -9
```

**To run from terminal instead:**
```bash
./launch-pacificwaves.sh
```

---

**Created:** November 12, 2025  
**For:** PacificWaves Educational Surf Game  
**Location:** /Users/zackjordan/code/PacificWaves
