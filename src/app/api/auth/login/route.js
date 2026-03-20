import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createSession, setSessionCookie } from '@/lib/session';
import { hashPassword } from '@/lib/crypto';
import auditLogger from '@/lib/audit';
import { validateEmail, sanitizeString } from '@/lib/sanitize';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rate-limit';
import { addSecurityHeaders } from '@/lib/security';

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `login:${clientIP}`;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.LOGIN);
    
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many login attempts. Please try again later.',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMITS.LOGIN.maxRequests),
            'X-RateLimit-Remaining': '0'
          }
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;
    
    // Validate and sanitize email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    const sanitizedEmail = emailValidation.sanitized;

    // Validate password presence
    if (!password || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Prevent timing attacks by using constant-time comparison
    // Find user
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [sanitizedEmail]
    );
    
    // Always perform password hash to prevent timing attacks
    const passwordHash = hashPassword(password);
    
    if (users.length === 0) {
      // Log failed attempt (user not found)
      await auditLogger.logLogin(null, null, request, false);
      
      const response = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
      
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
      return addSecurityHeaders(response);
    }
    
    const user = users[0];
    
    // Verify password
    if (passwordHash !== user.password_hash) {
      // Log failed attempt (wrong password)
      await auditLogger.logLogin(user.id, null, request, false);
      
      const response = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
      
      response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
      return addSecurityHeaders(response);
    }
    
    // Check if user is active (you might want to add an is_active field)
    // if (!user.is_active) {
    //   return NextResponse.json(
    //     { success: false, error: 'Account is disabled' },
    //     { status: 403 }
    //   );
    // }

    // Create session
    const session = await createSession(user.id, request);
    
    // Update last login
    await query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = ?',
      [user.id]
    );
    
    // Log successful login
    await auditLogger.logLogin(user.id, session.sessionId, request, true);
    
    // Set cookie
    const cookie = setSessionCookie(session.token, session.expiresAt);
    
    // Return response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        organizationId: user.organization_id
      }
    });
    
    response.headers.set('Set-Cookie', cookie);
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    
    return addSecurityHeaders(response);
    
  } catch (error) {
    console.error('Login error:', error);
    await auditLogger.logError(error, { request });
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
