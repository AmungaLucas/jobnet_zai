import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';
import { sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { addSecurityHeaders } from '@/lib/security';

// GET - Get single opportunity by ID (public, read-only)
export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

    // Validate ID format
    if (!id || !/^[a-f0-9]{24,32}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid opportunity ID' },
        { status: 400 }
      );
    }

    const [opportunities] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url, org.organization_type
       FROM opportunities o
       LEFT JOIN organizations org ON o.organization_id = org.id
       WHERE o.id = ?`,
      [id]
    );

    if (opportunities.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: opportunities[0]
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PUT - Update opportunity (REQUIRES AUTHENTICATION)
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const session = token ? await validateSession(token) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUserId = session.userId;
    const sessionId = session.id;
    const pool = await getConnection();
    const { id } = await params;

    // Validate ID format
    if (!id || !/^[a-f0-9]{24,32}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid opportunity ID' },
        { status: 400 }
      );
    }

    // Check if opportunity exists
    const [existing] = await pool.query(
      'SELECT * FROM opportunities WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Build update query with sanitization
    const updateFields = [];
    const updateValues = [];

    const textFields = [
      'title', 'description', 'opportunity_type', 'status',
      'organization_id', 'country', 'region', 'city'
    ];

    for (const field of textFields) {
      if (body[field] !== undefined) {
        const sanitized = sanitizeString(body[field], { maxLength: 10000 });
        
        // Check for dangerous content in title and description
        if (['title', 'description'].includes(field) && containsDangerousContent(sanitized)) {
          return NextResponse.json(
            { success: false, error: `Invalid content in ${field}` },
            { status: 400 }
          );
        }
        
        updateFields.push(`${field} = ?`);
        updateValues.push(sanitized);
      }
    }

    // Handle boolean
    if (body.remote !== undefined) {
      updateFields.push('remote = ?');
      updateValues.push(body.remote ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add audit fields
    updateFields.push('updated_by = ?', 'updated_at = NOW()');
    updateValues.push(currentUserId, id);

    // Execute update
    await pool.query(
      `UPDATE opportunities SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Fetch updated opportunity
    const [updatedOpportunity] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url
       FROM opportunities o
       LEFT JOIN organizations org ON o.organization_id = org.id
       WHERE o.id = ?`,
      [id]
    );

    // Log audit
    await auditLogger.logUpdate('OPPORTUNITY', id, updatedOpportunity[0], currentUserId, sessionId, request);

    const response = NextResponse.json({
      success: true,
      data: updatedOpportunity[0],
      message: 'Opportunity updated successfully'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE - Delete opportunity (REQUIRES AUTHENTICATION)
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const session = token ? await validateSession(token) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const currentUserId = session.userId;
    const sessionId = session.id;
    const pool = await getConnection();
    const { id } = await params;

    // Validate ID format
    if (!id || !/^[a-f0-9]{24,32}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid opportunity ID' },
        { status: 400 }
      );
    }

    // Check if opportunity exists
    const [existing] = await pool.query(
      'SELECT * FROM opportunities WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Log audit before deletion
    await auditLogger.logDelete('OPPORTUNITY', id, existing[0], currentUserId, sessionId, request);

    // Delete opportunity
    await pool.query('DELETE FROM opportunities WHERE id = ?', [id]);

    const response = NextResponse.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error deleting opportunity:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete opportunity. It is referenced by other records.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
