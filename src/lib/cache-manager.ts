// Cache Manager for Portfolio Demo
// Simulates server-side caching with in-memory storage

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
  hits: number;
}

interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  timeSaved: number; // milliseconds
  cacheSize: number; // number of entries
  lastHit?: number;
  lastMiss?: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private stats: CacheStats;
  private readonly defaultTTL = 60 * 1000; // 60 seconds in milliseconds

  constructor() {
    this.cache = new Map();
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      timeSaved: 0,
      cacheSize: 0,
    };
  }

  // Generate cache key from endpoint and params
  private generateKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  // Check if cache entry is still valid
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() < entry.expiresAt;
  }

  // Clean up expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        this.cache.delete(key);
      }
    }
    this.stats.cacheSize = this.cache.size;
  }

  // Get data from cache
  get<T>(endpoint: string, params?: Record<string, any>): T | null {
    this.cleanup();
    
    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);

    this.stats.totalRequests++;

    if (entry && this.isValid(entry)) {
      // Cache HIT
      entry.hits++;
      this.stats.cacheHits++;
      this.stats.lastHit = Date.now();
      
      // Simulate time saved (average API call is ~300ms, cache is ~5ms)
      this.stats.timeSaved += 295;
      
      this.updateHitRate();
      return entry.data as T;
    }

    // Cache MISS
    this.stats.cacheMisses++;
    this.stats.lastMiss = Date.now();
    this.updateHitRate();
    return null;
  }

  // Store data in cache
  set<T>(endpoint: string, data: T, params?: Record<string, any>, ttl?: number): void {
    const key = this.generateKey(endpoint, params);
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt,
      key,
      hits: 0,
    };

    this.cache.set(key, entry);
    this.stats.cacheSize = this.cache.size;
  }

  // Get cache entry metadata (for display purposes)
  getMetadata(endpoint: string, params?: Record<string, any>): {
    exists: boolean;
    age?: number;
    ttl?: number;
    hits?: number;
    expiresIn?: number;
  } {
    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return { exists: false };
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const expiresIn = Math.max(0, entry.expiresAt - now);
    const ttl = entry.expiresAt - entry.timestamp;

    return {
      exists: true,
      age: Math.floor(age / 1000), // seconds
      ttl: Math.floor(ttl / 1000), // seconds
      hits: entry.hits,
      expiresIn: Math.floor(expiresIn / 1000), // seconds
    };
  }

  // Clear specific cache entry
  invalidate(endpoint: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(endpoint, params);
    return this.cache.delete(key);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
    this.stats.cacheSize = 0;
  }

  // Reset statistics
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      hitRate: 0,
      timeSaved: 0,
      cacheSize: this.cache.size,
    };
  }

  // Update hit rate calculation
  private updateHitRate(): void {
    if (this.stats.totalRequests === 0) {
      this.stats.hitRate = 0;
    } else {
      this.stats.hitRate = (this.stats.cacheHits / this.stats.totalRequests) * 100;
    }
  }

  // Get current statistics
  getStats(): CacheStats {
    this.cleanup();
    return { ...this.stats };
  }

  // Get all cache entries (for debugging/display)
  getAllEntries(): Array<{ key: string; age: number; expiresIn: number; hits: number }> {
    this.cleanup();
    const now = Date.now();
    const entries: Array<{ key: string; age: number; expiresIn: number; hits: number }> = [];

    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        key: entry.key.split(':')[0], // Just show endpoint, not params
        age: Math.floor((now - entry.timestamp) / 1000),
        expiresIn: Math.floor((entry.expiresAt - now) / 1000),
        hits: entry.hits,
      });
    }

    return entries.sort((a, b) => b.hits - a.hits);
  }
}

// Singleton instance for demo
const cacheManager = new CacheManager();

export default cacheManager;
export type { CacheStats };

