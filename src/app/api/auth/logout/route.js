import { NextResponse } from 'next/server';
import { deleteSession, clearSessionCookie, validateSession } from '@/lib/session';
import auditLogger from '@/lib/audit';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (token) {
      const session = await validateSession(token);
      
      if (session) {
        await auditLogger.logLogout(session.userId, session.id, request);
      }
      
      await deleteSession(token);
    }
    
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', clearSessionCookie());
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    await auditLogger.logError(error, { request });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
