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

    // Land polygons
    LAND_POLYGONS: {
        hawaii: [[22.3, 201.5], [22.3, 202.4], [21.8, 202.4], [21.2, 201.7], [21.2, 201.5], [22.3, 201.5]],
        japan: [[30, 130], [30, 138], [35, 138], [34, 142], [40, 145], [45, 140], [42, 138], [30, 130]],
        kamchatka: [[50, 155], [62, 165], [60, 170], [50, 160], [50, 155]],
        alaska: [[52, 185], [55, 200], [60, 195], [65, 190], [68, 210], [68, 220], [60, 215], [55, 210], [52, 185]],
        namerica: [[60, 215], [60, 230], [55, 235], [50, 240], [45, 240], [35, 245], [30, 240], [30, 220], [45, 220], [55, 215], [60, 215]]
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
