#!/bin/bash

# PacificWaves Launcher Script
# Starts web server, opens game, and cleans up on exit

GAME_DIR="/Users/zackjordan/code/PacificWaves"
PORT=8000
GAME_URL="http://localhost:$PORT/waves.html"
PID_FILE="/tmp/pacificwaves-server.pid"

# Function to cleanup and kill server
cleanup() {
    echo "Shutting down PacificWaves server..."
    if [ -f "$PID_FILE" ]; then
        SERVER_PID=$(cat "$PID_FILE")
        if ps -p $SERVER_PID > /dev/null 2>&1; then
            kill $SERVER_PID
            echo "Server stopped (PID: $SERVER_PID)"
        fi
        rm -f "$PID_FILE"
    fi
    exit 0
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

# Change to game directory
cd "$GAME_DIR" || exit 1

# Kill any existing server on this port
lsof -ti:$PORT | xargs kill -9 2>/dev/null

# Start Python HTTP server in background
echo "Starting PacificWaves server on port $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > "$PID_FILE"

# Wait for server to start
sleep 1

# Open the game in default browser
echo "Opening PacificWaves in browser..."
open "$GAME_URL"

# Keep script running and monitor the browser
echo "PacificWaves is running. Close this window or press Ctrl+C to stop."
echo "Server PID: $SERVER_PID"

# Wait indefinitely (until user closes terminal or presses Ctrl+C)
wait $SERVER_PID
