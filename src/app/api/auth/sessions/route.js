import { NextResponse } from 'next/server';
import { getUserSessions, validateSession, deleteAllUserSessions } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const session = await validateSession(token);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    const sessions = await getUserSessions(session.userId);
    
    // Mark current session
    const sessionsWithCurrent = sessions.map(s => ({
      ...s,
      isCurrent: s.id === session.id
    }));
    
    return NextResponse.json({ sessions: sessionsWithCurrent });
    
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const session = await validateSession(token);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    // Delete all other sessions
    await deleteAllUserSessions(session.userId, session.id);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete all sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
