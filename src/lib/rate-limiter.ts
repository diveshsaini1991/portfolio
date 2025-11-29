/**
 * Rate Limiting Implementation for Portfolio API Demo
 * Demonstrates real-world rate limiting with sliding window
 */

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // timestamp
  retryAfter?: number; // seconds
}

interface RateLimitRecord {
  requests: number[];
  windowStart: number;
}

const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 5, // 5 requests per minute
};

// Store rate limit data (in real app, this would be Redis)
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Check if request is rate limited
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  info: RateLimitInfo;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;

  // Get or create rate limit record
  let record = rateLimitStore.get(identifier);
  
  if (!record) {
    record = {
      requests: [],
      windowStart: now,
    };
    rateLimitStore.set(identifier, record);
  }

  // Clean up old requests outside the window
  record.requests = record.requests.filter(timestamp => timestamp > windowStart);

  // Calculate remaining requests
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - record.requests.length);
  const resetTime = record.requests[0] 
    ? record.requests[0] + RATE_LIMIT_CONFIG.windowMs 
    : now + RATE_LIMIT_CONFIG.windowMs;

  // Check if limit exceeded
  const allowed = record.requests.length < RATE_LIMIT_CONFIG.maxRequests;

  if (allowed) {
    // Add current request timestamp
    record.requests.push(now);
  }

  const info: RateLimitInfo = {
    limit: RATE_LIMIT_CONFIG.maxRequests,
    remaining: allowed ? remaining - 1 : 0,
    reset: resetTime,
    retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
  };

  return { allowed, info };
}

/**
 * Get current rate limit status without consuming a request
 */
export function getRateLimitStatus(identifier: string): RateLimitInfo {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs;

  const record = rateLimitStore.get(identifier);
  
  if (!record) {
    return {
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: RATE_LIMIT_CONFIG.maxRequests,
      reset: now + RATE_LIMIT_CONFIG.windowMs,
    };
  }

  // Clean up old requests
  record.requests = record.requests.filter(timestamp => timestamp > windowStart);

  const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - record.requests.length);
  const resetTime = record.requests[0] 
    ? record.requests[0] + RATE_LIMIT_CONFIG.windowMs 
    : now + RATE_LIMIT_CONFIG.windowMs;

  return {
    limit: RATE_LIMIT_CONFIG.maxRequests,
    remaining,
    reset: resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier (for demo purposes)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Format rate limit info as HTTP headers
 */
export function formatRateLimitHeaders(info: RateLimitInfo): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': info.limit.toString(),
    'X-RateLimit-Remaining': info.remaining.toString(),
    'X-RateLimit-Reset': info.reset.toString(),
  };

  if (info.retryAfter !== undefined) {
    headers['Retry-After'] = info.retryAfter.toString();
  }

  return headers;
}

/**
 * Get time until reset in human-readable format
 */
export function getTimeUntilReset(resetTimestamp: number): string {
  const now = Date.now();
  const diff = Math.max(0, resetTimestamp - now);
  
  const seconds = Math.ceil(diff / 1000);
  
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s`;
}

