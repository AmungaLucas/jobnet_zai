import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

// GET - Get single organization by ID
export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

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

    return NextResponse.json({
      success: true,
      data: organizations[0]
    });

  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}

// PUT - Update organization
export async function PUT(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;
    
    // Get current user from session
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const session = token ? await validateSession(token) : null;
    const currentUserId = session?.userId || null;
    
    const body = await request.json();

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

    const currentOrg = existing[0];

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'organization_name', 'organization_slug', 'organization_description',
      'organization_type', 'organization_industry', 'organization_website',
      'organization_logo_url', 'organization_status', 'country', 'country_code',
      'region', 'city', 'is_verified', 'likes', 'rating', 'views',
      'featured_image', 'canonical_url', 'meta_title', 'meta_description'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(body[field]);
      }
    }

    // Check slug uniqueness if being updated
    if (body.organization_slug && body.organization_slug !== currentOrg.organization_slug) {
      const [slugCheck] = await pool.query(
        'SELECT id FROM organizations WHERE organization_slug = ? AND id != ?',
        [body.organization_slug, id]
      );

      if (slugCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Organization with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Always add updated_by from session
    updateFields.push('updated_by = ?');
    updateValues.push(currentUserId);

    // Always update updated_at
    updateFields.push('updated_at = NOW()');

    if (updateFields.length === 1) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Execute update
    await pool.query(
      `UPDATE organizations SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );

    // Fetch updated organization
    const [updatedOrg] = await pool.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedOrg[0],
      message: 'Organization updated successfully'
    });

  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

// DELETE - Delete organization
export async function DELETE(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

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

    // Delete organization
    await pool.query('DELETE FROM organizations WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully'
    });

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
