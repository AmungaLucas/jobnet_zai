import { NextResponse } from 'next/server';

/**
 * Security headers configuration
 */
const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS protection (for older browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (formerly Feature-Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  
  // Content Security Policy - relaxed for development
  'Content-Security-Policy': process.env.NODE_ENV === 'production'
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
    : "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;",
  
  // Strict Transport Security (HTTPS only) - only in production
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  })
};

/**
 * Add security headers to response
 * @param {NextResponse} response - Response object
 * @returns {NextResponse}
 */
export function addSecurityHeaders(response) {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
  return response;
}

/**
 * Security headers middleware
 */
export function withSecurityHeaders(handler) {
  return async (request, context) => {
    const response = await handler(request, context);
    
    if (response instanceof NextResponse) {
      addSecurityHeaders(response);
    }
    
    return response;
  };
}

/**
 * CORS configuration
 */
export function corsHeaders(origin, allowedOrigins = []) {
  const isAllowed = allowedOrigins.includes(origin) || 
                    allowedOrigins.includes('*') ||
                    process.env.NODE_ENV !== 'production';
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}

/**
 * Handle CORS preflight requests
 */
export function handleCors(request, allowedOrigins = []) {
  const origin = request.headers.get('origin');
  
  if (request.method === 'OPTIONS') {
    const headers = corsHeaders(origin, allowedOrigins);
    return new NextResponse(null, { status: 204, headers });
  }
  
  return null;
}

/**
 * CORS middleware factory
 */
export function withCors(allowedOrigins = []) {
  return (handler) => {
    return async (request, context) => {
      // Handle preflight
      const preflightResponse = handleCors(request, allowedOrigins);
      if (preflightResponse) return preflightResponse;
      
      // Call handler
      const response = await handler(request, context);
      
      // Add CORS headers
      if (response instanceof NextResponse) {
        const origin = request.headers.get('origin');
        const headers = corsHeaders(origin, allowedOrigins);
        
        for (const [header, value] of Object.entries(headers)) {
          if (value) response.headers.set(header, value);
        }
      }
      
      return response;
    };
  };
}

/**
 * Validate request origin (CSRF protection)
 */
export function validateOrigin(request, allowedOrigins = []) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  
  // Allow same-origin requests
  if (!origin && !referer) {
    return true; // Likely same-origin or direct API call
  }
  
  // Check origin
  if (origin) {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;
    if (allowedOrigins.includes(origin)) return true;
  }
  
  // Check referer
  if (referer) {
    const refererHost = new URL(referer).host;
    if (refererHost === host) return true;
    if (allowedOrigins.some(allowed => referer.startsWith(allowed))) return true;
  }
  
  return false;
}

/**
 * CSRF protection middleware
 */
export function withCsrfProtection(allowedOrigins = []) {
  return (handler) => {
    return async (request, context) => {
      // Only check state-changing methods
      const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
      
      if (!safeMethods.includes(request.method)) {
        const isValidOrigin = validateOrigin(request, allowedOrigins);
        
        if (!isValidOrigin) {
          return NextResponse.json(
            { success: false, error: 'Invalid request origin' },
            { status: 403 }
          );
        }
      }
      
      return handler(request, context);
    };
  };
}

/**
 * Combined security middleware
 */
export function withSecurity(options = {}) {
  const { 
    requireAuth = false, 
    rateLimit = null,
    allowedOrigins = [],
    sanitizeBody = false
  } = options;

  return (handler) => {
    let wrappedHandler = handler;
    
    // Add security headers
    wrappedHandler = withSecurityHeaders(wrappedHandler);
    
    // Add CSRF protection
    if (allowedOrigins.length > 0 || process.env.NODE_ENV === 'production') {
      wrappedHandler = withCsrfProtection(allowedOrigins)(wrappedHandler);
    }
    
    // Add CORS
    wrappedHandler = withCors(allowedOrigins)(wrappedHandler);
    
    return wrappedHandler;
  };
}
