// Copy-paste this into browser console (F12) while on http://localhost:8000/waves.html

console.log("=== PacificWaves Debug ===");

// Check if the page loaded
console.log("1. Page loaded:", document.readyState);

// Check for script errors
console.log("2. Checking for script tag...");
const scriptTag = document.querySelector('script[type="module"]');
console.log("   Script tag found:", scriptTag ? "YES" : "NO");

if (scriptTag) {
    console.log("   Script length:", scriptTag.textContent.length);
    console.log("   First 200 chars:", scriptTag.textContent.substring(0, 200));
}

// Check canvas
console.log("3. Canvas element:", document.getElementById('simCanvas') ? "EXISTS" : "MISSING");

// Check if SpriteLoader imported
console.log("4. Window.sprites:", window.sprites ? "LOADED" : "NOT LOADED");

// Check state
console.log("5. State object:", typeof window.state !== 'undefined' ? "EXISTS" : "MISSING");

// Check for initialization
console.log("6. App object:", typeof window.App !== 'undefined' ? "EXISTS" : "MISSING");

console.log("\n=== End Debug ===\n");
console.log("If you see JavaScript errors above this, that's the problem!");
