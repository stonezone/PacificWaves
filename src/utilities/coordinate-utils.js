/**
 * Coordinate Conversion and Geographic Utilities
 * @module utilities/coordinate-utils
 * @version 1.0.0
 *
 * Provides utilities for:
 * - Geographic calculations (bearing, distance, movement)
 * - Coordinate system conversions (lat/lon ↔ grid ↔ canvas)
 * - Bilinear interpolation for grids
 * - Point-in-polygon land detection
 *
 * @requires core/constants
 */

import { CONSTS } from '../core/constants.js';

export const Utils = {
    /**
     * Linear interpolation between two values
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor [0, 1]
     * @returns {number} Interpolated value
     */
    lerp: (a, b, t) => a + (b - a) * t,

    /**
     * Clamp value to range
     * @param {number} v - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp: (v, min, max) => Math.max(min, Math.min(max, v)),

    /**
     * Convert degrees to radians
     * @param {number} d - Degrees
     * @returns {number} Radians
     */
    degToRad: (d) => d * CONSTS.PI / 180,

    /**
     * Convert radians to degrees
     * @param {number} r - Radians
     * @returns {number} Degrees
     */
    radToDeg: (r) => r * 180 / CONSTS.PI,

    /**
     * Convert bearing (0-360) to radians
     * @param {number} b - Bearing in degrees
     * @returns {number} Radians
     */
    bearingToRad: (b) => Utils.degToRad(b),

    /**
     * Convert radians to bearing (0-360)
     * @param {number} r - Radians
     * @returns {number} Bearing in degrees
     */
    radToBearing: (r) => (Utils.radToDeg(r) + 360) % 360,

    /**
     * Calculate bearing from point 1 to point 2
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lon1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lon2 - Longitude of point 2
     * @returns {number} Bearing in degrees [0, 360)
     */
    getBearing(lat1, lon1, lat2, lon2) {
        const [lat1_rad, lon1_rad, lat2_rad, lon2_rad] = [lat1, lon1, lat2, lon2].map(Utils.degToRad);
        const dLon = lon2_rad - lon1_rad;
        const y = Math.sin(dLon) * Math.cos(lat2_rad);
        const x = Math.cos(lat1_rad) * Math.sin(lat2_rad) - Math.sin(lat1_rad) * Math.cos(lat2_rad) * Math.cos(dLon);
        return (Utils.radToDeg(Math.atan2(y, x)) + 360) % 360;
    },

    /**
     * Move a lat/lon point by distance and bearing
     * @param {number} lat - Starting latitude
     * @param {number} lon - Starting longitude
     * @param {number} bearing_rad - Bearing in radians
     * @param {number} dist_km - Distance in kilometers
     * @returns {{lat: number, lon: number}} New lat/lon position
     */
    moveLatLon(lat, lon, bearing_rad, dist_km) {
        const d_R = dist_km / CONSTS.EARTH_RADIUS_KM;
        const lat_rad = Utils.degToRad(lat);
        const lon_rad = Utils.degToRad(lon);

        const lat_new_rad = Math.asin(Math.sin(lat_rad) * Math.cos(d_R) + Math.cos(lat_rad) * Math.sin(d_R) * Math.sin(bearing_rad));
        const lon_new_rad = lon_rad + Math.atan2(Math.cos(bearing_rad) * Math.sin(d_R) * Math.cos(lat_rad), Math.cos(d_R) - Math.sin(lat_rad) * Math.sin(lat_new_rad));

        return { lat: Utils.radToDeg(lat_new_rad), lon: Utils.radToDeg(lon_new_rad) };
    },

    /**
     * Calculate approximate distance between two lat/lon points (Haversine formula)
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lon1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lon2 - Longitude of point 2
     * @returns {number} Distance in kilometers
     */
    approxDistKm(lat1, lon1, lat2, lon2) {
        const [lat1_rad, lon1_rad, lat2_rad, lon2_rad] = [lat1, lon1, lat2, lon2].map(Utils.degToRad);
        const dLat = lat2_rad - lat1_rad;
        const dLon = lon2_rad - lon1_rad;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1_rad) * Math.cos(lat2_rad) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return CONSTS.EARTH_RADIUS_KM * c;
    },

    /**
     * Convert lat/lon to grid cell coordinates
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {number} gridWidth - Grid width (default from state)
     * @param {number} gridHeight - Grid height (default from state)
     * @returns {{i: number, j: number}} Grid cell coordinates
     */
    latLonToCell(lat, lon, gridWidth, gridHeight) {
        // If not provided, use CONSTS defaults
        const gw = gridWidth !== undefined ? gridWidth : CONSTS.GRID_WIDTH;
        const gh = gridHeight !== undefined ? gridHeight : CONSTS.GRID_HEIGHT;

        const i_norm = (lon - CONSTS.MAP_LON_EAST_EDGE) / (CONSTS.MAP_LON_WEST_EDGE - CONSTS.MAP_LON_EAST_EDGE);
        const j_norm = (lat - CONSTS.MAP_LAT_MIN) / (CONSTS.MAP_LAT_MAX - CONSTS.MAP_LAT_MIN);
        return { i: i_norm * gw, j: j_norm * gh };
    },

    /**
     * Convert grid cell to lat/lon coordinates
     * @param {number} i - Grid column
     * @param {number} j - Grid row
     * @param {number} gridWidth - Grid width (default from state)
     * @param {number} gridHeight - Grid height (default from state)
     * @returns {{lat: number, lon: number}} Geographic coordinates
     */
    cellToLatLon(i, j, gridWidth, gridHeight) {
        // If not provided, use CONSTS defaults
        const gw = gridWidth !== undefined ? gridWidth : CONSTS.GRID_WIDTH;
        const gh = gridHeight !== undefined ? gridHeight : CONSTS.GRID_HEIGHT;

        const i_norm = i / gw;
        const j_norm = j / gh;
        const lon = Utils.lerp(CONSTS.MAP_LON_EAST_EDGE, CONSTS.MAP_LON_WEST_EDGE, i_norm);
        const lat = Utils.lerp(CONSTS.MAP_LAT_MIN, CONSTS.MAP_LAT_MAX, j_norm);
        return { lat, lon };
    },

    /**
     * Convert canvas pixel coordinates to grid cell
     * @param {number} x - Canvas X coordinate
     * @param {number} y - Canvas Y coordinate
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {number} gridWidth - Grid width
     * @param {number} gridHeight - Grid height
     * @returns {{i: number, j: number}} Grid cell coordinates
     */
    canvasToCell(x, y, canvasWidth, canvasHeight, gridWidth, gridHeight) {
        const i = (x / canvasWidth) * gridWidth;
        const j = (y / canvasHeight) * gridHeight;
        return { i, j };
    },

    /**
     * Convert grid cell to canvas pixel coordinates
     * @param {number} i - Grid column
     * @param {number} j - Grid row
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {number} gridWidth - Grid width
     * @param {number} gridHeight - Grid height
     * @returns {{x: number, y: number}} Canvas coordinates
     */
    cellToCanvas(i, j, canvasWidth, canvasHeight, gridWidth, gridHeight) {
        const x = (i / gridWidth) * canvasWidth;
        const y = (j / gridHeight) * canvasHeight;
        return { x, y };
    },

    /**
     * Convert canvas pixel coordinates to lat/lon
     * @param {number} x - Canvas X coordinate
     * @param {number} y - Canvas Y coordinate
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {number} gridWidth - Grid width
     * @param {number} gridHeight - Grid height
     * @returns {{lat: number, lon: number}} Geographic coordinates
     */
    canvasToLatLon(x, y, canvasWidth, canvasHeight, gridWidth, gridHeight) {
        const { i, j } = this.canvasToCell(x, y, canvasWidth, canvasHeight, gridWidth, gridHeight);
        return this.cellToLatLon(i, j, gridWidth, gridHeight);
    },

    /**
     * Bilinear interpolation on a grid
     * @param {Float32Array|Array} grid - Grid data
     * @param {number} i - Fractional column index
     * @param {number} j - Fractional row index
     * @param {number} w - Grid width
     * @param {number} h - Grid height
     * @param {number} [defaultVal=0] - Default value for out-of-bounds or land cells
     * @param {Uint8Array} [isLandGrid] - Optional land mask
     * @returns {number} Interpolated value
     */
    bilerp(grid, i, j, w, h, defaultVal = 0, isLandGrid = null) {
        const i0 = Math.floor(i), i1 = i0 + 1;
        const j0 = Math.floor(j), j1 = j0 + 1;

        if (i0 < 0 || i1 >= w || j0 < 0 || j1 >= h) return defaultVal;

        const idx00 = j0 * w + i0;
        const idx10 = j0 * w + i1;
        const idx01 = j1 * w + i0;
        const idx11 = j1 * w + i1;

        let v00, v10, v01, v11;

        if (isLandGrid) {
            v00 = (isLandGrid[idx00] === 1) ? defaultVal : grid[idx00];
            v10 = (isLandGrid[idx10] === 1) ? defaultVal : grid[idx10];
            v01 = (isLandGrid[idx01] === 1) ? defaultVal : grid[idx01];
            v11 = (isLandGrid[idx11] === 1) ? defaultVal : grid[idx11];
        } else {
            v00 = grid[idx00];
            v10 = grid[idx10];
            v01 = grid[idx01];
            v11 = grid[idx11];
        }

        const tx = i - i0, ty = j - j0;
        const r0 = Utils.lerp(v00, v10, tx);
        const r1 = Utils.lerp(v01, v11, tx);
        return Utils.lerp(r0, r1, ty);
    },

    /**
     * Bilinear interpolation for angular values (handles wraparound)
     * @param {Float32Array|Array} grid - Grid of angular values (radians)
     * @param {number} i - Fractional column index
     * @param {number} j - Fractional row index
     * @param {number} w - Grid width
     * @param {number} h - Grid height
     * @returns {number} Interpolated angle in radians
     */
    bilerpAngle(grid, i, j, w, h) {
        const i0 = Math.floor(i), i1 = i0 + 1;
        const j0 = Math.floor(j), j1 = j0 + 1;

        if (i0 < 0 || i1 >= w || j0 < 0 || j1 >= h) return 0;

        const v00 = grid[j0 * w + i0];
        const v10 = grid[j0 * w + i1];
        const v01 = grid[j1 * w + i0];
        const v11 = grid[j1 * w + i1];

        const tx = i - i0, ty = j - j0;
        const r0 = Utils.angularLerp(v00, v10, tx);
        const r1 = Utils.angularLerp(v01, v11, tx);
        return Utils.angularLerp(r0, r1, ty);
    },

    /**
     * Linear interpolation for angles (handles 0/2π wraparound)
     * @param {number} a - Start angle (radians)
     * @param {number} b - End angle (radians)
     * @param {number} t - Interpolation factor [0, 1]
     * @returns {number} Interpolated angle (radians)
     */
    angularLerp(a, b, t) {
        let d = b - a;
        if (d > CONSTS.PI) d -= 2 * CONSTS.PI;
        if (d < -CONSTS.PI) d += 2 * CONSTS.PI;
        return a + d * t;
    },

    /**
     * Test if a point is inside any land polygon
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {boolean} True if point is on land
     */
    isPointInLand(lat, lon) {
        for (const landName in CONSTS.LAND_POLYGONS) {
            const poly = CONSTS.LAND_POLYGONS[landName];
            let inside = false;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                const [lat_i, lon_i] = poly[i];
                const [lat_j, lon_j] = poly[j];

                const intersect = ((lat_i > lat) !== (lat_j > lat)) &&
                    (lon < (lon_j - lon_i) * (lat - lat_i) / (lat_j - lat_i) + lon_i);
                if (intersect) inside = !inside;
            }
            if (inside) return true;
        }
        return false;
    }
};
