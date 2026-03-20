import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

// GET - Get single opportunity by ID
export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

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

    return NextResponse.json({
      success: true,
      data: opportunities[0]
    });

  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PUT - Update opportunity
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

    const currentOpportunity = existing[0];

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'title', 'slug', 'description', 'opportunity_type',
      'status', 'organization_id', 'country', 'region', 'city', 'remote',
      'featured_image', 'canonical_url', 'meta_title', 'meta_description',
      'date_posted', 'valid_through'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(body[field]);
      }
    }

    // Check slug uniqueness if being updated
    if (body.slug && body.slug !== currentOpportunity.slug) {
      const [slugCheck] = await pool.query(
        'SELECT id FROM opportunities WHERE slug = ? AND id != ?',
        [body.slug, id]
      );

      if (slugCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Opportunity with this slug already exists' },
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
      `UPDATE opportunities SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );

    // Fetch updated opportunity with organization info
    const [updatedOpportunity] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url
       FROM opportunities o
       LEFT JOIN organizations org ON o.organization_id = org.id
       WHERE o.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedOpportunity[0],
      message: 'Opportunity updated successfully'
    });

  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE - Delete opportunity
export async function DELETE(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

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

    // Delete opportunity
    await pool.query('DELETE FROM opportunities WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting opportunity:', error);

    // Check for foreign key constraint errors
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
