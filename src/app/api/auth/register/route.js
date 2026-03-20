import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateId, hashPassword } from '@/lib/crypto';
import { createSession, setSessionCookie } from '@/lib/session';
import auditLogger from '@/lib/audit';
import { validateEmail, validatePassword, sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { checkRateLimit, RATE_LIMITS, getClientIP } from '@/lib/rate-limit';
import { addSecurityHeaders } from '@/lib/security';

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `register:${clientIP}`;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.REGISTER);
    
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.', retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const body = await request.json();
    const { email, password, firstName, lastName } = body;
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ success: false, error: emailValidation.error }, { status: 400 });
    }
    const sanitizedEmail = emailValidation.sanitized;

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ success: false, error: passwordValidation.errors.join('. ') }, { status: 400 });
    }

    // Sanitize name fields
    const sanitizedFirstName = sanitizeString(firstName, { maxLength: 100 });
    const sanitizedLastName = sanitizeString(lastName, { maxLength: 100 });

    // Check for dangerous content
    if (containsDangerousContent(sanitizedFirstName) || containsDangerousContent(sanitizedLastName)) {
      return NextResponse.json({ success: false, error: 'Invalid characters in name' }, { status: 400 });
    }
    
    // Check if user exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [sanitizedEmail]);
    
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }
    
    // Create user
    const userId = generateId();
    const passwordHash = hashPassword(password);
    
    await query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, sanitizedEmail, passwordHash, sanitizedFirstName || null, sanitizedLastName || null, 'USER']
    );
    
    // Get created user
    const [user] = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = ?',
      [userId]
    );
    
    // Auto-login: Create session for the new user
    const session = await createSession(userId, request);
    
    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
    
    // Log registration with session ID
    await auditLogger.logCreate('USER', userId, user, userId, session.sessionId, request);
    
    // Set session cookie
    const cookie = setSessionCookie(session.token, session.expiresAt);
    
    // Return response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    }, { status: 201 });
    
    response.headers.set('Set-Cookie', cookie);
    
    return addSecurityHeaders(response);
    
  } catch (error) {
    console.error('Registration error:', error);
    await auditLogger.logError(error, { request });
    
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
