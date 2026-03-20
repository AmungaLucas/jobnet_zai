import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';
import { sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { addSecurityHeaders } from '@/lib/security';

// GET - Get single organization by ID (public)
export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

    // Validate ID format
    if (!id || !/^[a-f0-9]{24,32}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    const [organizations] = await pool.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );

    if (organizations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: organizations[0]
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}

// PUT - Update organization (REQUIRES AUTHENTICATION)
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
        { success: false, error: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    // Check if organization exists
    const [existing] = await pool.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Sanitize all fields
    const updates = {};
    const fields = [
      'organization_name', 'organization_description', 'organization_type',
      'organization_industry', 'organization_website', 'organization_logo_url',
      'organization_status', 'country', 'country_code', 'region', 'city',
      'featured_image', 'canonical_url', 'meta_title', 'meta_description'
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        const sanitized = sanitizeString(body[field], { maxLength: 5000 });
        
        // Check for dangerous content in text fields
        if (['organization_name', 'organization_description', 'meta_title', 'meta_description'].includes(field)) {
          if (containsDangerousContent(sanitized)) {
            return NextResponse.json(
              { success: false, error: `Invalid content in ${field}` },
              { status: 400 }
            );
          }
        }
        
        updates[field] = sanitized;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Build update query
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), currentUserId, id];

    await pool.query(
      `UPDATE organizations SET ${setClause}, updated_at = NOW(), updated_by = ? WHERE id = ?`,
      values
    );

    // Fetch updated organization
    const [updated] = await pool.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );

    // Log audit
    await auditLogger.logUpdate('ORGANIZATION', id, updated[0], currentUserId, sessionId, request);

    const response = NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Organization updated successfully'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE - Delete organization (REQUIRES AUTHENTICATION)
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
        { success: false, error: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    // Check if organization exists
    const [existing] = await pool.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Log audit before deletion
    await auditLogger.logDelete('ORGANIZATION', id, existing[0], currentUserId, sessionId, request);

    // Delete organization
    await pool.query('DELETE FROM organizations WHERE id = ?', [id]);

    const response = NextResponse.json({
      success: true,
      message: 'Organization deleted successfully'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error deleting organization:', error);

    // Check for foreign key constraint errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete organization. It is referenced by other records.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
}
