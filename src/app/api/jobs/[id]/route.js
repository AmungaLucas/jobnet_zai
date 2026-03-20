import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

// GET - Get single job by ID
export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

    const [jobs] = await pool.query(
      `SELECT j.*, o.organization_name, o.organization_logo_url, o.organization_type
       FROM jobs j
       LEFT JOIN organizations o ON j.organization_id = o.id
       WHERE j.id = ?`,
      [id]
    );

    if (jobs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await pool.query(
      'UPDATE jobs SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: jobs[0]
    });

  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT - Update job
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

    // Check if job exists
    const [existing] = await pool.query(
      'SELECT * FROM jobs WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    const currentJob = existing[0];

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    const allowedFields = [
      'job_title', 'job_slug', 'job_description', 'job_category', 'job_subcategory',
      'job_status', 'job_source', 'employment_type', 'experience_level', 'organization_id',
      'country', 'region', 'city', 'remote', 'salary_min', 'salary_max', 'salary_currency',
      'date_posted', 'valid_through', 'featured_image', 'canonical_url', 'meta_title', 'meta_description',
      'view_count', 'apply_count'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(body[field]);
      }
    }

    // Check slug uniqueness if being updated
    if (body.job_slug && body.job_slug !== currentJob.job_slug) {
      const [slugCheck] = await pool.query(
        'SELECT id FROM jobs WHERE job_slug = ? AND id != ?',
        [body.job_slug, id]
      );

      if (slugCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Job with this slug already exists' },
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
      `UPDATE jobs SET ${updateFields.join(', ')} WHERE id = ?`,
      [...updateValues, id]
    );

    // Fetch updated job with organization info
    const [updatedJob] = await pool.query(
      `SELECT j.*, o.organization_name, o.organization_logo_url
       FROM jobs j
       LEFT JOIN organizations o ON j.organization_id = o.id
       WHERE j.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedJob[0],
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

    // Check if job exists
    const [existing] = await pool.query(
      'SELECT * FROM jobs WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Delete job
    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job:', error);

    // Check for foreign key constraint errors
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete job. It is referenced by other records.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
