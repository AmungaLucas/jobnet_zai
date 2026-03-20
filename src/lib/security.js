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
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  
  // Content Security Policy
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
 */
export function addSecurityHeaders(response) {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
  return response;
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
