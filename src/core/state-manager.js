/**
 * State Management System
 * @module core/state-manager
 * @version 1.0.0
 *
 * Provides controlled state management with:
 * - Structured state access (no direct mutations)
 * - Change notification system
 * - State history for undo/redo
 * - Typed arrays managed for performance
 *
 * Note: Typed arrays (Float32Array, Uint8Array) are kept mutable for performance
 * but access is controlled through this manager.
 */

export class StateManager {
    #state = null;
    #listeners = new Map();
    #history = [];
    #historyIndex = -1;
    #maxHistorySize = 50;

    constructor(initialState = {}) {
        this.#state = initialState;
    }

    /**
     * Get current state (read-only)
     * @returns {Object} Current state object
     */
    getState() {
        return this.#state;
    }

    /**
     * Get specific state property
     * @param {string} path - Dot-notation path (e.g., 'ui.activeTab')
     * @returns {*} Value at path
     */
    get(path) {
        const keys = path.split('.');
        let value = this.#state;
        for (const key of keys) {
            if (value === null || value === undefined) return undefined;
            value = value[key];
        }
        return value;
    }

    /**
     * Update state with new values
     * @param {Object|Function} updates - Object with updates or function (draft => {...})
     * @param {boolean} [notify=true] - Whether to notify listeners
     * @returns {Object} Updated state
     */
    update(updates, notify = true) {
        if (typeof updates === 'function') {
            // Functional update: pass mutable draft
            updates(this.#state);
        } else {
            // Object merge update
            this.#state = { ...this.#state, ...updates };
        }

        if (notify) {
            this.#notifyListeners('update', this.#state);
        }

        return this.#state;
    }

    /**
     * Update nested property
     * @param {string} path - Dot-notation path
     * @param {*} value - New value
     * @param {boolean} [notify=true] - Whether to notify listeners
     */
    set(path, value, notify = true) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.#state;

        for (const key of keys) {
            if (!(key in target)) {
                target[key] = {};
            }
            target = target[key];
        }

        target[lastKey] = value;

        if (notify) {
            this.#notifyListeners('update', this.#state);
        }
    }

    /**
     * Reset state to initial values
     * @param {Object} initialState - New initial state
     */
    reset(initialState) {
        this.#state = initialState;
        this.#history = [];
        this.#historyIndex = -1;
        this.#notifyListeners('reset', this.#state);
    }

    /**
     * Subscribe to state changes
     * @param {string} event - Event name ('update', 'reset', etc.)
     * @param {Function} callback - Callback function (state) => {}
     * @returns {Function} Unsubscribe function
     */
    subscribe(event, callback) {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, new Set());
        }
        this.#listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => {
            const listeners = this.#listeners.get(event);
            if (listeners) {
                listeners.delete(callback);
            }
        };
    }

    /**
     * Notify all listeners of an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @private
     */
    #notifyListeners(event, data) {
        const listeners = this.#listeners.get(event);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error(`StateManager listener error (${event}):`, err);
                }
            });
        }
    }

    /**
     * Save current state to history (for undo/redo)
     * Note: Only saves serializable state, not typed arrays
     */
    saveToHistory() {
        // Create serializable snapshot (exclude typed arrays and functions)
        const snapshot = this.#createSnapshot();

        // Remove any history after current index (if we went back then made changes)
        this.#history = this.#history.slice(0, this.#historyIndex + 1);

        // Add new snapshot
        this.#history.push(snapshot);

        // Limit history size
        if (this.#history.length > this.#maxHistorySize) {
            this.#history.shift();
        } else {
            this.#historyIndex++;
        }
    }

    /**
     * Create serializable snapshot of current state
     * @returns {Object} Snapshot
     * @private
     */
    #createSnapshot() {
        const snapshot = {
            storms: JSON.parse(JSON.stringify(this.#state.storms || [])),
            isRunning: this.#state.isRunning,
            simTimeHours: this.#state.simTimeHours,
            currentScenario: this.#state.currentScenario,
            ui: JSON.parse(JSON.stringify(this.#state.ui || {})),
        };
        return snapshot;
    }

    /**
     * Restore state from snapshot
     * @param {Object} snapshot - Snapshot to restore
     * @private
     */
    #restoreSnapshot(snapshot) {
        // Restore only the serializable parts
        this.update({
            storms: JSON.parse(JSON.stringify(snapshot.storms)),
            isRunning: snapshot.isRunning,
            simTimeHours: snapshot.simTimeHours,
            currentScenario: snapshot.currentScenario,
            ui: JSON.parse(JSON.stringify(snapshot.ui)),
        });
    }

    /**
     * Undo last change
     * @returns {boolean} True if undo was successful
     */
    undo() {
        if (this.#historyIndex > 0) {
            this.#historyIndex--;
            this.#restoreSnapshot(this.#history[this.#historyIndex]);
            this.#notifyListeners('undo', this.#state);
            return true;
        }
        return false;
    }

    /**
     * Redo last undone change
     * @returns {boolean} True if redo was successful
     */
    redo() {
        if (this.#historyIndex < this.#history.length - 1) {
            this.#historyIndex++;
            this.#restoreSnapshot(this.#history[this.#historyIndex]);
            this.#notifyListeners('redo', this.#state);
            return true;
        }
        return false;
    }

    /**
     * Check if undo is available
     * @returns {boolean}
     */
    canUndo() {
        return this.#historyIndex > 0;
    }

    /**
     * Check if redo is available
     * @returns {boolean}
     */
    canRedo() {
        return this.#historyIndex < this.#history.length - 1;
    }

    /**
     * Clear all history
     */
    clearHistory() {
        this.#history = [];
        this.#historyIndex = -1;
    }

    /**
     * Get debug information
     * @returns {Object} Debug info
     */
    getDebugInfo() {
        return {
            historySize: this.#history.length,
            historyIndex: this.#historyIndex,
            listenerCount: Array.from(this.#listeners.values())
                .reduce((sum, set) => sum + set.size, 0),
            stateKeys: Object.keys(this.#state),
        };
    }
}
