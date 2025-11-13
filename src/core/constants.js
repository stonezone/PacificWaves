/**
 * Physics Constants and Map Data
 * @module core/constants
 * @version 1.0.0
 *
 * Defines all simulation constants including:
 * - Grid dimensions and map projection bounds
 * - Land polygon coordinates
 * - Physics parameters (gravity, unit conversions, wave growth)
 * - Storm wind field parameters
 */

export const CONSTS = {
    // Sim Grid
    GRID_WIDTH: 200,
    GRID_HEIGHT: 160,
    CELL_SIZE_KM: 20,

    // Map Projection
    MAP_LAT_MIN: 10.0, MAP_LAT_MAX: 65.0,
    MAP_LON_EAST_EDGE: 130.0, MAP_LON_WEST_EDGE: 250.0,
    HAWAII_MAIN_ISLAND_CENTER: { lat: 21.5, lon: 202.2 },

    // Land polygons - High-resolution coastlines for accurate land detection
    LAND_POLYGONS: {
        hawaii: [[22.3, 201.5], [22.3, 202.4], [21.8, 202.4], [21.2, 201.7], [21.2, 201.5], [22.3, 201.5]],

        // Japan - detailed outline (~40 points for smoother coastline)
        japan: [
            [30.5, 130.2], [31, 130.5], [32, 131], [33, 132], [34, 133], [34.5, 134],
            [35, 135], [35.5, 136], [36, 137], [36.5, 138], [37, 139], [37.5, 140],
            [38, 140.5], [39, 141], [40, 141.5], [41, 142], [42, 143], [43, 144],
            [44, 144.5], [45, 144.8], [45.5, 144.5], [46, 143.5], [46, 142.5],
            [45.5, 141.5], [45, 140.5], [44, 140], [43, 139.5], [42, 139],
            [41, 138.5], [40, 138], [39, 137], [38, 136], [37, 135], [36, 134],
            [35, 133], [34, 132], [33, 131.5], [32, 131], [31, 130.5], [30.5, 130.2]
        ],

        // Kamchatka Peninsula (~20 points)
        kamchatka: [
            [50, 155], [51, 156.5], [52, 158], [53.5, 160], [55, 162],
            [57, 164], [59, 165], [61, 166], [62, 167], [62.5, 168],
            [62, 169], [61, 169.5], [60, 170], [58, 169.5], [56, 168],
            [54, 166], [52, 163], [51, 160], [50.5, 157], [50, 155]
        ],

        // Alaska - Gulf of Alaska and Aleutians (~40 points)
        alaska: [
            [52, 185], [53, 188], [54, 192], [55, 196], [56, 199],
            [57, 201], [58, 202.5], [59, 203], [60, 203.5], [61, 204],
            [62, 205], [63, 207], [64, 209], [65, 211], [65.5, 213],
            [66, 215], [66.5, 217], [67, 219], [67.5, 221], [68, 222],
            [67.5, 222], [67, 221.5], [66, 220], [65, 218], [64, 216],
            [63, 215], [62, 214], [61, 213.5], [60, 213], [59, 212],
            [58, 211], [57, 210], [56, 209], [55, 207], [54, 205],
            [53, 202], [52.5, 198], [52, 194], [52, 190], [52, 185]
        ],

        // North America West Coast (~40 points)
        namerica: [
            [60, 215], [59, 220], [58, 224], [57, 227], [56, 229],
            [55, 231], [54, 233], [53, 234.5], [52, 236], [51, 237],
            [50, 238], [49, 239], [48, 239.5], [46, 240], [44, 240.5],
            [42, 241], [40, 241.5], [38, 242], [36, 242.5], [34, 243],
            [32, 243.5], [30, 244], [30, 240], [31, 236], [32, 232],
            [33, 228], [34, 225], [36, 223], [38, 222], [40, 221.5],
            [42, 221], [44, 220.5], [46, 220], [48, 219.5], [50, 219],
            [52, 218.5], [54, 218], [56, 217], [58, 216], [60, 215]
        ]
    },

    NEARSHORE_CELLS: 15,

    // Physics
    G: 9.81, PI: Math.PI,
    DEFAULT_DT_HOURS: 1.0, HOUR_TO_S: 3600,
    KT_TO_MPS: 0.514444, KM_TO_M: 1000, NM_TO_M: 1852,

    DEFAULT_PHYSICS: {
        ALPHA: 5.0e-7, BETA: 0.03, L_F: 100.0, K_T: 8.0e-5, L_T: 150.0,
        K_THETA: 0.1, T_MIN: 3.0, T_MAX: 22.0, DEEP_H: 4000, SHALLOW_H_START: 100, GAMMA: 0.78,
    },

    MAX_FETCH_CELLS: 50, MIN_FETCH_KM: 5.0,
    WIND_FIELD_GALE_KT: 34.0,
};
