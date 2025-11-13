#!/usr/bin/env node
/**
 * Simple HTTP server for PacificWaves development
 * Node.js version - no dependencies required
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const DIRECTORY = __dirname;

// MIME type mapping
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown'
};

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m'
};

// Create server
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Default to index.html
    if (pathname === '/') {
        pathname = '/waves.html';
    }

    // Build file path
    const filePath = path.join(DIRECTORY, pathname);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            console.log(`${colors.yellow}[404]${colors.reset} ${pathname}`);
            return;
        }

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                console.log(`${colors.red}[500]${colors.reset} ${pathname}`);
                return;
            }

            // Get MIME type
            const ext = path.extname(filePath);
            const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

            // Send response with CORS headers
            res.writeHead(200, {
                'Content-Type': mimeType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
            });
            res.end(data);

            // Log success
            console.log(`${colors.green}[200]${colors.reset} ${pathname}`);
        });
    });
});

// Start server
server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🌊 PacificWaves Development Server');
    console.log('='.repeat(60));
    console.log(`\n📡 Server running at:`);
    console.log(`   • http://localhost:${PORT}/`);
    console.log(`   • http://127.0.0.1:${PORT}/`);
    console.log(`\n📂 Serving files from: ${DIRECTORY}`);
    console.log(`\n🎮 Open this URL in your browser:`);
    console.log(`   ${colors.bright}${colors.cyan}http://localhost:${PORT}/waves.html${colors.reset}`);
    console.log(`\n💡 Press Ctrl+C to stop the server`);
    console.log('='.repeat(60) + '\n');
});

// Handle shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...');
    console.log('   Goodbye! 👋\n');
    process.exit(0);
});
