import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    const session = await validateSession(token);
    
    if (!session) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        role: session.role,
        organizationId: session.organizationId
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
