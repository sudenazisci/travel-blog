// Simple in-memory cache with TTL
// This service provides get, set, and del methods for caching objects.
// Cache entries are stored in a Map with expiration timestamps.

class CacheService {
  constructor() {
    this.store = new Map();
  }

  /**
   * Set a value in cache.
   * @param {string} key - Cache key
   * @param {*} value - Value to store
   * @param {number} ttlSeconds - Time to live in seconds
   */
  set(key, value, ttlSeconds) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
    // Schedule cleanup
    setTimeout(() => {
      const entry = this.store.get(key);
      if (entry && entry.expiresAt <= Date.now()) {
        this.store.delete(key);
      }
    }, ttlSeconds * 1000 + 1000);
  }

  /**
   * Get a cached value.
   * @param {string} key
   * @returns {*} cached value or undefined if missing/expired
   */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Delete a cache entry.
   * @param {string} key
   */
  del(key) {
    this.store.delete(key);
  }
}

// Export a singleton instance
module.exports = new CacheService();
