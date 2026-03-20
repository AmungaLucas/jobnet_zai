import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { validateSession } from '@/lib/session';
import auditLogger from '@/lib/audit';
import { cookies } from 'next/headers';

export async function DELETE(request, { params }) {
  try {
    const { id: sessionId } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const currentSession = await validateSession(token);
    
    if (!currentSession) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
    
    // Check if trying to delete current session
    if (sessionId === currentSession.id) {
      return NextResponse.json(
        { error: 'Cannot delete current session' },
        { status: 400 }
      );
    }
    
    // Verify session belongs to user
    const sessions = await query(
      'SELECT * FROM user_sessions WHERE id = ? AND user_id = ?',
      [sessionId, currentSession.userId]
    );
    
    if (sessions.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Delete session
    await query('DELETE FROM user_sessions WHERE id = ?', [sessionId]);
    
    // Log action
    await auditLogger.log(
      'DELETE_SESSION',
      'USER_SESSION',
      sessionId,
      currentSession.userId,
      currentSession.id,
      sessions[0],
      null,
      request
    );
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Delete session error:', error);
    await auditLogger.logError(error, { request });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
