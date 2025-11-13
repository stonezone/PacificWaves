/**
 * Error Boundary System
 * @module core/error-boundary
 * @version 1.0.0
 *
 * Provides error handling and recovery mechanisms to prevent
 * application crashes from propagating to users.
 *
 * Features:
 * - Function wrapping with automatic error catching
 * - Fallback value/function support
 * - Error logging and telemetry
 * - Graceful degradation
 */

export class ErrorBoundary {
    static #errorLog = [];
    static #maxLogSize = 100;

    /**
     * Wrap a function with error handling
     * @param {Function} fn - Function to wrap
     * @param {*|Function} fallback - Fallback value or function to call on error
     * @param {string} [context='operation'] - Context description for logging
     * @returns {Function} Wrapped function
     *
     * @example
     * const safeLoadSprites = ErrorBoundary.wrap(
     *   () => SpriteLoader.loadAll(),
     *   () => new FallbackSpriteProvider(),
     *   'sprite-loading'
     * );
     */
    static wrap(fn, fallback, context = 'operation') {
        return (...args) => {
            try {
                const result = fn(...args);

                // Handle async functions
                if (result instanceof Promise) {
                    return result.catch(err =>
                        this.#handleError(err, fallback, context)
                    );
                }

                return result;
            } catch (err) {
                return this.#handleError(err, fallback, context);
            }
        };
    }

    /**
     * Wrap an async function with error handling
     * @param {Function} asyncFn - Async function to wrap
     * @param {*|Function} fallback - Fallback value or function
     * @param {string} [context='async-operation'] - Context description
     * @returns {Function} Wrapped async function
     */
    static wrapAsync(asyncFn, fallback, context = 'async-operation') {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (err) {
                return this.#handleError(err, fallback, context);
            }
        };
    }

    /**
     * Execute function with error boundary
     * @param {Function} fn - Function to execute
     * @param {*|Function} fallback - Fallback value or function
     * @param {string} [context='execution'] - Context description
     * @returns {*} Function result or fallback
     */
    static execute(fn, fallback, context = 'execution') {
        try {
            return fn();
        } catch (err) {
            return this.#handleError(err, fallback, context);
        }
    }

    /**
     * Handle error with fallback
     * @param {Error} error - Error object
     * @param {*|Function} fallback - Fallback value or function
     * @param {string} context - Context description
     * @returns {*} Fallback value
     * @private
     */
    static #handleError(error, fallback, context) {
        // Log error
        this.#logError(error, context);

        // Console error for debugging
        console.error(`[ErrorBoundary:${context}]`, error);

        // Return fallback
        if (typeof fallback === 'function') {
            try {
                return fallback(error);
            } catch (fallbackError) {
                console.error(`[ErrorBoundary:${context}] Fallback failed:`, fallbackError);
                return null;
            }
        }

        return fallback;
    }

    /**
     * Log error to internal log
     * @param {Error} error - Error object
     * @param {string} context - Context description
     * @private
     */
    static #logError(error, context) {
        const entry = {
            timestamp: Date.now(),
            context,
            message: error.message,
            stack: error.stack,
            name: error.name
        };

        this.#errorLog.push(entry);

        // Limit log size
        if (this.#errorLog.length > this.#maxLogSize) {
            this.#errorLog.shift();
        }
    }

    /**
     * Get error log
     * @returns {Array<Object>} Error log entries
     */
    static getErrorLog() {
        return [...this.#errorLog];
    }

    /**
     * Clear error log
     */
    static clearErrorLog() {
        this.#errorLog = [];
    }

    /**
     * Get error statistics
     * @returns {Object} Error statistics
     */
    static getStats() {
        const contextCounts = {};

        this.#errorLog.forEach(entry => {
            contextCounts[entry.context] = (contextCounts[entry.context] || 0) + 1;
        });

        return {
            totalErrors: this.#errorLog.length,
            byContext: contextCounts,
            recentErrors: this.#errorLog.slice(-10)
        };
    }

    /**
     * Create a safe version of an object's methods
     * @param {Object} obj - Object to wrap
     * @param {Object} fallbacks - Map of method names to fallback values
     * @param {string} [contextPrefix='object'] - Context prefix for logging
     * @returns {Object} Object with wrapped methods
     *
     * @example
     * const safeRenderer = ErrorBoundary.wrapObject(Render, {
     *   render: () => console.warn('Render failed, skipping frame'),
     *   init: () => false
     * }, 'Renderer');
     */
    static wrapObject(obj, fallbacks = {}, contextPrefix = 'object') {
        const wrapped = {};

        for (const key in obj) {
            if (typeof obj[key] === 'function') {
                const fallback = fallbacks[key] !== undefined
                    ? fallbacks[key]
                    : null;

                wrapped[key] = this.wrap(
                    obj[key].bind(obj),
                    fallback,
                    `${contextPrefix}.${key}`
                );
            } else {
                wrapped[key] = obj[key];
            }
        }

        return wrapped;
    }

    /**
     * Global error handler setup
     * @param {Function} [onError] - Optional custom error handler
     */
    static setupGlobalHandler(onError) {
        window.addEventListener('error', (event) => {
            this.#logError(event.error || new Error(event.message), 'global');

            if (onError) {
                onError(event.error, 'global', event);
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.#logError(
                event.reason instanceof Error
                    ? event.reason
                    : new Error(String(event.reason)),
                'unhandled-promise'
            );

            if (onError) {
                onError(event.reason, 'unhandled-promise', event);
            }
        });
    }
}
