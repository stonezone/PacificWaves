/**
 * Sprite Loader Module
 *
 * Handles loading of pixel art sprite assets for PacificWaves.
 * All sprites are 1024x1024 PNG files with transparent backgrounds.
 */

export const SpriteLoader = {
    sprites: {},
    loaded: false,
    loadingProgress: 0,

    /**
     * Load all sprite assets
     * @returns {Promise} Resolves when all sprites are loaded
     */
    async loadAll() {
        // Define sprite manifest with metadata
        const spriteManifest = [
            { name: 'ocean_tile', tileable: true, description: 'Base ocean water texture' },
            { name: 'deep_ocean_tile', tileable: true, description: 'Deep ocean variant texture' },
            { name: 'land_tiles', tileable: true, description: 'Coastal land tiles' },
            { name: 'storm_weak', size: 32, description: 'Small cyclone icon' },
            { name: 'storm_moderate', size: 48, description: 'Medium cyclone icon' },
            { name: 'storm_strong', size: 64, description: 'Large cyclone icon' },
            { name: 'wave_ripple', size: 64, description: 'Wave propagation ripple effect' },
            { name: 'oahu_island', size: 128, description: 'Oahu island sprite (oversized)' },
            { name: 'kauai_island', size: 32, description: 'Kauai island sprite' },
            { name: 'surf_spot_marker', size: 16, description: 'Surf spot flag marker' },
            { name: 'swell_shadow', size: 32, description: 'Semi-transparent swell shadow overlay' }
        ];

        console.log('🌊 Loading PacificWaves sprites...');
        const totalSprites = spriteManifest.length;
        let loadedCount = 0;

        const loadPromises = spriteManifest.map(sprite => {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    this.sprites[sprite.name] = {
                        image: img,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        metadata: sprite
                    };
                    loadedCount++;
                    this.loadingProgress = (loadedCount / totalSprites) * 100;
                    console.log(`  ✓ ${sprite.name} (${img.naturalWidth}x${img.naturalHeight}) - ${sprite.description}`);
                    resolve();
                };

                img.onerror = (error) => {
                    console.error(`  ✗ Failed to load: ${sprite.name}`);
                    console.error(`    Path: assets/generated/${sprite.name}.png`);
                    console.error(`    Error:`, error);
                    reject(new Error(`Failed to load sprite: ${sprite.name}`));
                };

                // Set source to trigger loading
                img.src = `assets/generated/${sprite.name}.png`;
            });
        });

        try {
            await Promise.all(loadPromises);
            this.loaded = true;
            this.loadingProgress = 100;
            console.log('🎨 All sprites loaded successfully!');
            this.printSummary();
            return true;
        } catch (error) {
            console.error('❌ Error loading sprites:', error);
            this.loaded = false;
            throw error;
        }
    },

    /**
     * Get a loaded sprite by name
     * @param {string} name - Sprite name (without .png extension)
     * @returns {Object|null} Sprite data or null if not found
     */
    get(name) {
        if (!this.loaded) {
            console.warn(`Sprite "${name}" requested before loading complete`);
        }
        return this.sprites[name] || null;
    },

    /**
     * Get the raw Image element for canvas drawing
     * @param {string} name - Sprite name
     * @returns {HTMLImageElement|null}
     */
    getImage(name) {
        const sprite = this.get(name);
        return sprite ? sprite.image : null;
    },

    /**
     * Check if a specific sprite is loaded
     * @param {string} name - Sprite name
     * @returns {boolean}
     */
    isLoaded(name) {
        return this.sprites[name] !== undefined;
    },

    /**
     * Print summary of loaded sprites
     */
    printSummary() {
        const spriteNames = Object.keys(this.sprites);
        const totalSize = spriteNames.reduce((sum, name) => {
            const sprite = this.sprites[name];
            return sum + (sprite.width * sprite.height * 4); // Rough RGBA size
        }, 0);
        const totalMB = (totalSize / (1024 * 1024)).toFixed(2);

        console.log(`\n📊 Sprite Summary:`);
        console.log(`   Total Sprites: ${spriteNames.length}`);
        console.log(`   Estimated Memory: ~${totalMB} MB`);
        console.log(`   Status: Ready for rendering\n`);
    },

    /**
     * Draw a sprite to canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} spriteName - Name of sprite to draw
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} [width] - Optional width (defaults to sprite width)
     * @param {number} [height] - Optional height (defaults to sprite height)
     * @param {number} [alpha] - Optional alpha (0-1)
     */
    draw(ctx, spriteName, x, y, width = null, height = null, alpha = 1.0) {
        const sprite = this.get(spriteName);
        if (!sprite) {
            console.warn(`Cannot draw sprite "${spriteName}" - not loaded`);
            return false;
        }

        const img = sprite.image;
        const w = width || img.naturalWidth;
        const h = height || img.naturalHeight;

        // Handle alpha blending
        if (alpha < 1.0) {
            const oldAlpha = ctx.globalAlpha;
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, x, y, w, h);
            ctx.globalAlpha = oldAlpha;
        } else {
            ctx.drawImage(img, x, y, w, h);
        }

        return true;
    },

    /**
     * Draw a tiled sprite to fill an area
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} spriteName - Name of tileable sprite
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} width - Area width
     * @param {number} height - Area height
     * @param {number} [tileSize] - Size of each tile (defaults to sprite width)
     */
    drawTiled(ctx, spriteName, x, y, width, height, tileSize = null) {
        const sprite = this.get(spriteName);
        if (!sprite) {
            console.warn(`Cannot draw tiled sprite "${spriteName}" - not loaded`);
            return false;
        }

        const img = sprite.image;
        const size = tileSize || img.naturalWidth;
        const tilesX = Math.ceil(width / size);
        const tilesY = Math.ceil(height / size);

        for (let ty = 0; ty < tilesY; ty++) {
            for (let tx = 0; tx < tilesX; tx++) {
                ctx.drawImage(img, x + (tx * size), y + (ty * size), size, size);
            }
        }

        return true;
    }
};

export default SpriteLoader;
