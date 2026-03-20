import { NextResponse } from 'next/server';
import { validateSession } from './session';
import { cookies } from 'next/headers';

/**
 * Authentication middleware for API routes
 * Validates session and attaches user info to request
 */
export async function withAuth(handler, options = {}) {
  const { requireAuth = true, roles = [] } = options;

  return async (request, context) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('session_token')?.value;

      let session = null;
      let user = null;

      if (token) {
        session = await validateSession(token);
        if (session) {
          user = {
            id: session.userId,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
            role: session.role,
            organizationId: session.organizationId,
            sessionId: session.id
          };
        }
      }

      // Check if authentication is required
      if (requireAuth && !user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check role-based access
      if (roles.length > 0 && user && !roles.includes(user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Attach user to request for use in handlers
      request.user = user;
      request.session = session;

      return handler(request, context);

    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Optional authentication - doesn't require auth but extracts user if present
 */
export async function withOptionalAuth(handler) {
  return withAuth(handler, { requireAuth: false });
}

/**
 * Admin-only authentication
 */
export async function withAdminAuth(handler) {
  return withAuth(handler, { requireAuth: true, roles: ['ADMIN'] });
}

/**
 * Get current user from request (use in API handlers after withAuth)
 */
export function getCurrentUser(request) {
  return request.user || null;
}

/**
 * Get current session from request
 */
export function getCurrentSession(request) {
  return request.session || null;
}
