import { NextResponse } from 'next/server';
import { query } from './db';

/**
 * Rate limiting using database (for distributed systems)
 * Tracks requests by IP address and/or user ID
 */

// Rate limit configurations
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  
  // API endpoints - moderate limits
  API: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  API_WRITE: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 write requests per minute
  
  // Password reset - very strict
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 } // 3 per hour
};

// In-memory fallback for development (not suitable for production multi-instance)
const memoryStore = new Map();

/**
 * Clean up expired entries from memory store
 */
function cleanupMemoryStore() {
  const now = Date.now();
  for (const [key, data] of memoryStore.entries()) {
    if (now > data.resetAt) {
      memoryStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupMemoryStore, 5 * 60 * 1000);
}

/**
 * Check rate limit using database
 */
async function checkRateLimitDB(identifier, limit, windowMs) {
  const windowStart = new Date(Date.now() - windowMs);
  
  try {
    // Create rate_limits table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id VARCHAR(255) PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        request_count INT DEFAULT 1,
        window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        INDEX idx_identifier (identifier),
        INDEX idx_expires (expires_at)
      )
    `);

    // Clean up expired entries
    await query('DELETE FROM rate_limits WHERE expires_at < NOW()');

    // Get current count
    const [existing] = await query(
      `SELECT id, request_count, window_start FROM rate_limits 
       WHERE identifier = ? AND expires_at > NOW()`,
      [identifier]
    );

    if (existing) {
      const count = existing.request_count + 1;
      
      if (count > limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: existing.window_start.getTime() + windowMs
        };
      }

      // Update count
      await query(
        'UPDATE rate_limits SET request_count = ? WHERE id = ?',
        [count, existing.id]
      );

      return {
        allowed: true,
        remaining: limit - count,
        resetAt: existing.window_start.getTime() + windowMs
      };
    }

    // Create new entry
    const expiresAt = new Date(Date.now() + windowMs);
    await query(
      `INSERT INTO rate_limits (id, identifier, expires_at) 
       VALUES (UUID(), ?, ?)`,
      [identifier, expiresAt]
    );

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: Date.now() + windowMs
    };

  } catch (error) {
    console.error('Rate limit DB error:', error);
    // Fallback to allow on DB error
    return { allowed: true, remaining: limit - 1, resetAt: Date.now() + windowMs };
  }
}

/**
 * Check rate limit using in-memory store
 */
function checkRateLimitMemory(identifier, limit, windowMs) {
  const now = Date.now();
  const resetAt = now + windowMs;

  if (memoryStore.has(identifier)) {
    const data = memoryStore.get(identifier);

    if (now > data.resetAt) {
      // Window expired, reset
      memoryStore.set(identifier, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (data.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: data.resetAt };
    }

    data.count++;
    return { allowed: true, remaining: limit - data.count, resetAt: data.resetAt };
  }

  memoryStore.set(identifier, { count: 1, resetAt });
  return { allowed: true, remaining: limit - 1, resetAt };
}

/**
 * Main rate limit check function
 */
export async function checkRateLimit(identifier, config) {
  const { maxRequests, windowMs } = config;
  
  // Use database for production, memory for development
  if (process.env.NODE_ENV === 'production') {
    return checkRateLimitDB(identifier, maxRequests, windowMs);
  }
  
  return checkRateLimitMemory(identifier, maxRequests, windowMs);
}

/**
 * Rate limiting middleware factory
 */
export function withRateLimit(config, options = {}) {
  const { keyGenerator } = options;

  return (handler) => {
    return async (request, context) => {
      // Generate rate limit key
      let identifier;
      
      if (keyGenerator) {
        identifier = await keyGenerator(request);
      } else {
        // Default: IP + path
        const ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') ||
                   'unknown';
        const path = new URL(request.url).pathname;
        identifier = `${ip}:${path}`;
      }

      const result = await checkRateLimit(identifier, config);

      if (!result.allowed) {
        const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
        
        return NextResponse.json(
          { 
            success: false, 
            error: 'Too many requests. Please try again later.',
            retryAfter
          },
          { 
            status: 429,
            headers: {
              'Retry-After': String(retryAfter),
              'X-RateLimit-Limit': String(config.maxRequests),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000))
            }
          }
        );
      }

      // Add rate limit headers to response
      const response = await handler(request, context);
      
      if (response instanceof NextResponse) {
        response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
        response.headers.set('X-RateLimit-Remaining', String(result.remaining));
        response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
      }

      return response;
    };
  };
}

/**
 * Get client IP address
 */
export function getClientIP(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         request.headers.get('x-real-ip') ||
         request.headers.get('cf-connecting-ip') ||
         'unknown';
}
