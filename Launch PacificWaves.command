#!/bin/bash

# PacificWaves Launcher - Double-click to run!

GAME_DIR="/Users/zackjordan/code/PacificWaves"
PORT=8000
GAME_URL="http://localhost:$PORT/waves.html"

# Function to cleanup
cleanup() {
    echo ""
    echo "🌊 Shutting down PacificWaves server..."
    if [ ! -z "$SERVER_PID" ] && ps -p $SERVER_PID > /dev/null 2>&1; then
        kill $SERVER_PID
        echo "✅ Server stopped"
    fi
    lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

clear
echo "╔════════════════════════════════════════╗"
echo "║    🌊 PacificWaves is starting...     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Kill any existing server
lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null

# Start server
cd "$GAME_DIR" || exit 1
echo "Starting server on port $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

sleep 1

# Open browser
echo "Opening browser..."
open "$GAME_URL"

echo ""
echo "✅ PacificWaves is running!"
echo "📍 URL: $GAME_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  CLOSE THIS WINDOW to stop the server"
echo "  or press Ctrl+C"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Keep running
wait $SERVER_PID
