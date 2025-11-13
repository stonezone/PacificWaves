/**
 * Input Validation System
 * @module core/validation
 * @version 1.0.0
 *
 * Provides schema-based validation for user inputs and data structures.
 * Prevents invalid data from entering the system.
 *
 * Features:
 * - Type checking
 * - Range validation
 * - String sanitization (XSS prevention)
 * - Custom validators
 * - Detailed error messages
 */

export class ValidationError extends Error {
    constructor(errors) {
        super(Array.isArray(errors) ? errors.join('; ') : errors);
        this.name = 'ValidationError';
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}

export class Validator {
    /**
     * Storm configuration schema
     */
    static STORM_CONFIG = {
        lat: { type: 'number', min: -90, max: 90, required: true },
        lon: { type: 'number', min: 0, max: 360, required: true },
        speed: { type: 'number', min: 0, max: 150, required: true },
        heading: { type: 'number', min: 0, max: 360, required: true },
        wind: { type: 'number', min: 0, max: 200, required: true },
        radius: { type: 'number', min: 50, max: 500, required: true },
        lifetime: { type: 'number', min: 1, max: 240, required: true },
        name: { type: 'string', maxLength: 50, sanitize: true, required: false }
    };

    /**
     * Grid coordinate schema
     */
    static GRID_COORD = {
        i: { type: 'number', min: 0, required: true },
        j: { type: 'number', min: 0, required: true }
    };

    /**
     * Canvas coordinate schema
     */
    static CANVAS_COORD = {
        x: { type: 'number', min: 0, required: true },
        y: { type: 'number', min: 0, required: true }
    };

    /**
     * Validate data against schema
     * @param {Object} data - Data to validate
     * @param {Object} schema - Validation schema
     * @param {boolean} [mutate=false] - Whether to mutate data (for sanitization)
     * @returns {Object} Validated (and possibly sanitized) data
     * @throws {ValidationError} If validation fails
     */
    static validate(data, schema, mutate = false) {
        const errors = [];
        const result = mutate ? data : { ...data };

        for (const [key, rules] of Object.entries(schema)) {
            const value = data[key];

            // Required check
            if (rules.required && (value === null || value === undefined || value === '')) {
                errors.push(`${key} is required`);
                continue;
            }

            // Skip validation if not required and not provided
            if (!rules.required && (value === null || value === undefined || value === '')) {
                continue;
            }

            // Type validation
            if (rules.type) {
                const typeError = this.#validateType(key, value, rules.type);
                if (typeError) {
                    errors.push(typeError);
                    continue;
                }
            }

            // Number validations
            if (rules.type === 'number') {
                if (isNaN(value)) {
                    errors.push(`${key} must be a valid number`);
                    continue;
                }

                if (rules.min !== undefined && value < rules.min) {
                    errors.push(`${key} must be >= ${rules.min} (got ${value})`);
                }

                if (rules.max !== undefined && value > rules.max) {
                    errors.push(`${key} must be <= ${rules.max} (got ${value})`);
                }

                if (rules.integer && !Number.isInteger(value)) {
                    errors.push(`${key} must be an integer (got ${value})`);
                }
            }

            // String validations
            if (rules.type === 'string') {
                if (rules.minLength !== undefined && value.length < rules.minLength) {
                    errors.push(`${key} must be at least ${rules.minLength} characters`);
                }

                if (rules.maxLength !== undefined && value.length > rules.maxLength) {
                    errors.push(`${key} must be at most ${rules.maxLength} characters`);
                }

                if (rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`${key} does not match required pattern`);
                }

                // Sanitize if requested
                if (rules.sanitize) {
                    result[key] = this.sanitizeHTML(value);
                }
            }

            // Custom validator
            if (rules.validator) {
                const customError = rules.validator(value, data);
                if (customError) {
                    errors.push(customError);
                }
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors);
        }

        return result;
    }

    /**
     * Validate type
     * @param {string} key - Field name
     * @param {*} value - Value to check
     * @param {string} expectedType - Expected type
     * @returns {string|null} Error message or null
     * @private
     */
    static #validateType(key, value, expectedType) {
        const actualType = typeof value;

        if (expectedType === 'number') {
            if (actualType !== 'number' && actualType !== 'string') {
                return `${key} must be a number (got ${actualType})`;
            }
            // Allow string numbers
            if (actualType === 'string' && isNaN(Number(value))) {
                return `${key} must be a valid number`;
            }
        } else if (actualType !== expectedType) {
            return `${key} must be ${expectedType} (got ${actualType})`;
        }

        return null;
    }

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    static sanitizeHTML(str) {
        if (typeof str !== 'string') return str;

        // Create temporary div for HTML entity encoding
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Validate storm configuration
     * @param {Object} config - Storm configuration
     * @returns {Object} Validated configuration
     * @throws {ValidationError}
     */
    static validateStormConfig(config) {
        return this.validate(config, this.STORM_CONFIG, true);
    }

    /**
     * Validate grid coordinates
     * @param {Object} coord - Grid coordinates
     * @param {number} gridWidth - Maximum grid width
     * @param {number} gridHeight - Maximum grid height
     * @returns {Object} Validated coordinates
     * @throws {ValidationError}
     */
    static validateGridCoord(coord, gridWidth, gridHeight) {
        const schema = {
            ...this.GRID_COORD,
            i: { ...this.GRID_COORD.i, max: gridWidth - 1 },
            j: { ...this.GRID_COORD.j, max: gridHeight - 1 }
        };
        return this.validate(coord, schema);
    }

    /**
     * Validate canvas coordinates
     * @param {Object} coord - Canvas coordinates
     * @param {number} canvasWidth - Maximum canvas width
     * @param {number} canvasHeight - Maximum canvas height
     * @returns {Object} Validated coordinates
     * @throws {ValidationError}
     */
    static validateCanvasCoord(coord, canvasWidth, canvasHeight) {
        const schema = {
            ...this.CANVAS_COORD,
            x: { ...this.CANVAS_COORD.x, max: canvasWidth },
            y: { ...this.CANVAS_COORD.y, max: canvasHeight }
        };
        return this.validate(coord, schema);
    }

    /**
     * Safe number coercion with validation
     * @param {*} value - Value to coerce
     * @param {number} [defaultValue=0] - Default if invalid
     * @param {number} [min] - Minimum value
     * @param {number} [max] - Maximum value
     * @returns {number} Validated number
     */
    static toNumber(value, defaultValue = 0, min = -Infinity, max = Infinity) {
        const num = Number(value);

        if (isNaN(num)) return defaultValue;
        if (num < min) return min;
        if (num > max) return max;

        return num;
    }

    /**
     * Safe integer coercion with validation
     * @param {*} value - Value to coerce
     * @param {number} [defaultValue=0] - Default if invalid
     * @param {number} [min] - Minimum value
     * @param {number} [max] - Maximum value
     * @returns {number} Validated integer
     */
    static toInteger(value, defaultValue = 0, min = -Infinity, max = Infinity) {
        return Math.floor(this.toNumber(value, defaultValue, min, max));
    }

    /**
     * Clamp number to range
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
}
