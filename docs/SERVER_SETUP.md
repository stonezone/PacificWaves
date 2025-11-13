# 🌐 Running PacificWaves with a Local Server

## Why You Need a Server

When opening `waves.html` directly (using `file://` protocol), you'll encounter CORS errors because:
- Modern browsers block ES6 modules from local files
- JavaScript fetch() API doesn't work with `file://`
- Security restrictions prevent cross-origin requests

**Solution:** Run a local development server!

---

## 🚀 Quick Start (Choose One Method)

### Option 1: Python (Recommended - Works Everywhere)

```bash
# Navigate to project directory
cd /Users/zackjordan/code/PacificWaves

# Run the server
python3 server.py
```

**Or use Python's built-in server:**
```bash
python3 -m http.server 8000
```

### Option 2: Node.js (If You Have Node Installed)

```bash
# Navigate to project directory
cd /Users/zackjordan/code/PacificWaves

# Run the server
node server.js
```

**Or use npx (no install needed):**
```bash
npx http-server -p 8000 -c-1
```

### Option 3: PHP (If You Have PHP Installed)

```bash
php -S localhost:8000
```

---

## 📱 Accessing the Application

Once the server is running, open your browser to:

**Primary URL:**
```
http://localhost:8000/waves.html
```

**Alternative URLs:**
- http://127.0.0.1:8000/waves.html
- http://localhost:8000/ (auto-redirects to waves.html with custom server)

---

## 🔧 Server Features

### Custom Servers (server.py / server.js)

✅ **CORS headers** - Fixes cross-origin issues
✅ **Correct MIME types** - Ensures JS modules load properly
✅ **No caching** - See changes immediately during development
✅ **Color-coded logs** - Easy to see what's being requested
✅ **Auto-redirect** - `/` goes to `waves.html`

### Built-in Servers (Python/PHP/npx)

✅ **Simple and fast** - One command to start
✅ **No configuration** - Works out of the box
⚠️ **Basic features** - May need manual cache clearing

---

## 🐛 Troubleshooting

### Port Already in Use

If you see "Address already in use" error:

```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python3 -m http.server 8001
```

### Still Getting CORS Errors?

1. **Hard refresh** your browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. **Clear cache** in browser dev tools (Network tab → Disable cache)
3. **Check console** for specific error messages
4. **Verify server is running** at `http://localhost:8000`

### Files Not Loading?

Make sure you're in the correct directory:
```bash
pwd
# Should show: /Users/zackjordan/code/PacificWaves

ls
# Should show: waves.html, server.py, server.js, etc.
```

---

## 🎯 Best Practices for Development

### During Active Development

1. **Use the custom server** (`server.py` or `server.js`)
   - Better logging
   - No caching issues
   - Easier debugging

2. **Keep DevTools open**
   - Press `F12` or `Cmd+Option+I`
   - Watch Console for errors
   - Use Network tab to see file loads

3. **Use hard refresh** after code changes
   - `Cmd+Shift+R` (Mac)
   - `Ctrl+Shift+R` (Windows/Linux)

### For Testing

1. **Test in multiple browsers**
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari

2. **Test mobile responsive**
   - DevTools → Toggle device toolbar
   - Or open on actual mobile device using your local IP

3. **Check console for errors**
   - No red errors should appear
   - Warnings are usually okay

---

## 📊 What the Server Fixes

| Feature | file:// | http:// | Status |
|---------|---------|---------|--------|
| ES6 Modules | ❌ Blocked | ✅ Works | Fixed |
| Fetch API | ❌ Blocked | ✅ Works | Fixed |
| CORS Requests | ❌ Blocked | ✅ Works | Fixed |
| Sprite Loading | ❌ Failed | ✅ Works | Fixed |
| WebSockets | ❌ N/A | ✅ Works | Available |
| Service Workers | ❌ N/A | ✅ Works | Available |

---

## 🚀 Advanced: Auto-Reload on Changes

Want the page to refresh automatically when you edit files?

### Using Browser Sync (Node.js)

```bash
# Install globally (one-time)
npm install -g browser-sync

# Run with auto-reload
browser-sync start --server --files "*.html, js/*.js, css/*.css, assets/**/*"
```

### Using Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click `waves.html`
3. Select "Open with Live Server"

---

## 🌍 Access from Other Devices (Same Network)

To test on your phone or another computer:

1. **Find your local IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "

   # Look for something like: 192.168.1.XXX
   ```

2. **Start server** (using custom server for CORS headers)

3. **Open on other device:**
   ```
   http://192.168.1.XXX:8000/waves.html
   ```

---

## 📝 Server Script Comparison

| Feature | server.py | server.js | Built-in |
|---------|-----------|-----------|----------|
| Language | Python | Node.js | Various |
| Dependencies | None | None | None |
| CORS Headers | ✅ Yes | ✅ Yes | ❌ No |
| Color Logs | ✅ Yes | ✅ Yes | ⚠️ Basic |
| MIME Types | ✅ Fixed | ✅ Fixed | ✅ Auto |
| Setup Time | Instant | Instant | Instant |

**Recommendation:** Use `server.py` if you have Python 3, or `server.js` if you prefer Node.

---

## 🎓 Understanding CORS (For Learning)

**CORS = Cross-Origin Resource Sharing**

### What's happening:

1. Browser opens `file:///path/to/waves.html`
2. HTML tries to load `js/sprite-loader.js`
3. Browser sees different "origins":
   - Origin 1: `null` (the file:// protocol)
   - Origin 2: `file:///path/to/js/sprite-loader.js`
4. Browser blocks the request (security feature)

### Why HTTP server fixes it:

1. Browser opens `http://localhost:8000/waves.html`
2. HTML tries to load `js/sprite-loader.js`
3. Browser sees same origin:
   - Origin: `http://localhost:8000` (both files)
4. Browser allows the request ✅

### Security reasoning:

- `file://` could access your entire filesystem
- HTTP server only serves from one directory
- CORS policy protects users from malicious websites

---

## 🔒 Production Deployment (Future)

When ready to deploy publicly:

### Static Hosting (Recommended)
- **Netlify** - Drag & drop deployment
- **Vercel** - Git integration
- **GitHub Pages** - Free hosting
- **Cloudflare Pages** - Fast CDN

### Traditional Hosting
- Any web server (Apache, Nginx)
- Just upload files to `/public_html/`
- No server-side code needed!

---

## ✅ Success Checklist

When everything is working, you should see:

- [ ] No CORS errors in browser console
- [ ] All sprites loading correctly
- [ ] UI enhancements visible (status bar, legend, etc.)
- [ ] Forecast chart rendering
- [ ] Storm tooltips appearing on hover
- [ ] FPS counter updating smoothly
- [ ] No 404 errors in network tab

---

## 💡 Pro Tips

1. **Bookmark the dev server**
   - http://localhost:8000/waves.html
   - Quick access during development

2. **Use incognito mode** for testing
   - Fresh cache every time
   - No extension interference

3. **Check mobile view** in DevTools
   - Responsive design should work
   - Status bar and legend should adapt

4. **Keep server terminal visible**
   - See requests in real-time
   - Catch 404s immediately

---

## 🆘 Still Having Issues?

If nothing works, try this minimal test:

```bash
cd /Users/zackjordan/code/PacificWaves
python3 -m http.server 8000
```

Then open: http://localhost:8000/waves.html

If this works but custom server doesn't:
- Check file permissions
- Make sure server.py/js are in project root
- Try running with explicit python path: `/usr/bin/python3 server.py`

---

**Happy coding! 🌊**

For questions or issues, check the browser console first - it usually tells you exactly what's wrong!
