#!/usr/bin/env python3
"""
Simple HTTP server for PacificWaves development
Serves files with proper CORS headers and MIME types
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class PacificWavesHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with proper MIME types and CORS headers"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Cache control for development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')

        super().end_headers()

    def guess_type(self, path):
        """Ensure correct MIME types for JavaScript modules"""
        mime_type = super().guess_type(path)

        # Force correct MIME type for JS modules
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.mjs'):
            return 'application/javascript'

        return mime_type

    def log_message(self, format, *args):
        """Custom logging with colors"""
        message = format % args

        # Color code by status
        if '200' in message:
            color = '\033[92m'  # Green
        elif '304' in message:
            color = '\033[94m'  # Blue
        elif '404' in message:
            color = '\033[93m'  # Yellow
        else:
            color = '\033[91m'  # Red

        reset = '\033[0m'
        print(f"{color}[{self.log_date_time_string()}] {message}{reset}")

def main():
    """Start the development server"""

    # Change to script directory
    os.chdir(DIRECTORY)

    # Create server
    with socketserver.TCPServer(("", PORT), PacificWavesHTTPRequestHandler) as httpd:
        print("\n" + "="*60)
        print("🌊 PacificWaves Development Server")
        print("="*60)
        print(f"\n📡 Server running at:")
        print(f"   • http://localhost:{PORT}/")
        print(f"   • http://127.0.0.1:{PORT}/")
        print(f"\n📂 Serving files from: {DIRECTORY}")
        print(f"\n🎮 Open this URL in your browser:")
        print(f"   \033[1;36mhttp://localhost:{PORT}/waves.html\033[0m")
        print(f"\n💡 Press Ctrl+C to stop the server")
        print("="*60 + "\n")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Shutting down server...")
            print("   Goodbye! 👋\n")
            sys.exit(0)

if __name__ == "__main__":
    main()
