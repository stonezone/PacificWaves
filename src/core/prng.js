/**
 * Pseudo-Random Number Generator
 * @module core/prng
 * @version 1.0.0
 *
 * SplitMix64-inspired PRNG with FNV-1a hash for seeding.
 * Provides deterministic random number generation for reproducible simulations.
 *
 * @example
 * const rng = new PRNG('seed-123');
 * const value = rng.random(); // [0, 1)
 * const noiseValue = rng.noise(42); // Deterministic noise function
 */

export class PRNG {
    /**
     * Create a new PRNG instance
     * @param {string} [seedStr] - Seed string for deterministic randomness
     */
    constructor(seedStr) {
        this.seed = this.hashCode(seedStr || `${Date.now()}-${Math.random()}`);
        this.noise_seed = this.hashCode(`noise_${this.seed}`);
    }

    /**
     * FNV-1a inspired hash function
     * @param {string} str - String to hash
     * @returns {number} 32-bit hash value
     * @private
     */
    hashCode(str) {
        let hash = 2166136261 >>> 0;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = (hash * 16777619) >>> 0;
        }
        return hash;
    }

    /**
     * Generate next pseudo-random integer
     * @returns {number} Unsigned 32-bit integer
     */
    next() {
        // Simple LCG (Linear Congruential Generator)
        this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
        return this.seed;
    }

    /**
     * Generate random float in [0, 1)
     * @returns {number} Random number between 0 (inclusive) and 1 (exclusive)
     */
    random() {
        return (this.next() >>> 0) / 4294967296;
    }

    /**
     * Deterministic noise function
     * @param {number} x - Input value
     * @returns {number} Noise value in [0, 1)
     */
    noise(x) {
        return ((this.hashCode(this.noise_seed + x) >>> 0) % 1000) / 1000;
    }
}
