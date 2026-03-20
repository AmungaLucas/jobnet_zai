import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

// GET - Fetch audit logs
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action') || '';
    const entityType = searchParams.get('entityType') || '';

    let whereConditions = [];
    let queryParams = [];

    if (action) {
      whereConditions.push('action = ?');
      queryParams.push(action);
    }

    if (entityType) {
      whereConditions.push('entity_type = ?');
      queryParams.push(entityType);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    const logs = await query(
      `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT ?`,
      [...queryParams, limit]
    );

    return NextResponse.json({
      success: true,
      logs
    });

  } catch (error) {
    console.error('Audit log fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create audit log
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
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
