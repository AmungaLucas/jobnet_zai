import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    let userId = null;
    let sessionId = null;
    
    if (token) {
      const session = await validateSession(token);
      if (session) {
        userId = session.userId;
        sessionId = session.id;
      }
    }
    
    const data = await request.json();
    
    const auditId = generateId();
    
    await query(
      `INSERT INTO audit_logs 
       (id, user_id, session_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        auditId,
        userId || data.userId,
        sessionId || data.sessionId,
        data.action,
        data.entityType,
        data.entityId,
        data.oldValues ? JSON.stringify(data.oldValues) : null,
        data.newValues ? JSON.stringify(data.newValues) : null,
        request.headers.get('x-forwarded-for') || null,
        data.userAgent || request.headers.get('user-agent') || null
      ]
    );
    
    return NextResponse.json({ success: true, id: auditId });
    
  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
