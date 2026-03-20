import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { generateId, hashPassword } from '@/lib/crypto';
import { createSession, setSessionCookie } from '@/lib/session';
import auditLogger from '@/lib/audit';

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existing = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Create user
    const userId = generateId();
    const passwordHash = hashPassword(password);
    
    await query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, email, passwordHash, firstName || null, lastName || null, 'USER']
    );
    
    // Get created user
    const [user] = await query(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = ?',
      [userId]
    );
    
    // Auto-login: Create session for the new user
    const session = await createSession(userId, request);
    
    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [userId]
    );
    
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
    return response;
    
  } catch (error) {
    console.error('Registration error:', error);
    await auditLogger.logError(error, { request });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
