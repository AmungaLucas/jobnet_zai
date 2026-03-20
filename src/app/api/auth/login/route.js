import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { createSession, setSessionCookie } from '@/lib/session';
import { generateId, hashPassword } from '@/lib/crypto';
import auditLogger from '@/lib/audit';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      await auditLogger.logLogin(null, null, request, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const user = users[0];
    
    // Verify password (using sha256 for demo - use bcrypt in production)
    const passwordHash = hashPassword(password);
    if (passwordHash !== user.password_hash) {
      await auditLogger.logLogin(user.id, null, request, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
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
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    await auditLogger.logError(error, { request });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
