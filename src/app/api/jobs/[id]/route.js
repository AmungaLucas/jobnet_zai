import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';
import { sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { addSecurityHeaders } from '@/lib/security';

// GET - Get single job by ID (public, read-only)
export async function GET(request, { params }) {
  try {
    const pool = await getConnection();
    const { id } = await params;

    // Validate ID format
    if (!id || !/^[a-f0-9]{24,32}$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

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

    const response = NextResponse.json({
      success: true,
      data: jobs[0]
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// PUT - Update job (REQUIRES AUTHENTICATION)
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
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

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

    const body = await request.json();
    
    // Build update query dynamically with sanitization
    const updateFields = [];
    const updateValues = [];

    const textFields = [
      'job_title', 'job_description', 'job_category', 'job_subcategory',
      'job_status', 'employment_type', 'experience_level', 'organization_id',
      'country', 'region', 'city', 'salary_currency'
    ];

    for (const field of textFields) {
      if (body[field] !== undefined) {
        const sanitized = sanitizeString(body[field], { maxLength: 10000 });
        
        // Check for dangerous content in title and description
        if (['job_title', 'job_description'].includes(field) && containsDangerousContent(sanitized)) {
          return NextResponse.json(
            { success: false, error: `Invalid content in ${field}` },
            { status: 400 }
          );
        }
        
        updateFields.push(`${field} = ?`);
        updateValues.push(sanitized);
      }
    }

    // Handle numeric fields
    if (body.salary_min !== undefined) {
      updateFields.push('salary_min = ?');
      updateValues.push(body.salary_min ? parseFloat(body.salary_min) : null);
    }
    if (body.salary_max !== undefined) {
      updateFields.push('salary_max = ?');
      updateValues.push(body.salary_max ? parseFloat(body.salary_max) : null);
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
      `UPDATE jobs SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Fetch updated job
    const [updatedJob] = await pool.query(
      `SELECT j.*, o.organization_name, o.organization_logo_url
       FROM jobs j
       LEFT JOIN organizations o ON j.organization_id = o.id
       WHERE j.id = ?`,
      [id]
    );

    // Log audit
    await auditLogger.logUpdate('JOB', id, updatedJob[0], currentUserId, sessionId, request);

    const response = NextResponse.json({
      success: true,
      data: updatedJob[0],
      message: 'Job updated successfully'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// DELETE - Delete job (REQUIRES AUTHENTICATION)
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
        { success: false, error: 'Invalid job ID' },
        { status: 400 }
      );
    }

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

    // Log audit before deletion
    await auditLogger.logDelete('JOB', id, existing[0], currentUserId, sessionId, request);

    // Delete job
    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);

    const response = NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error deleting job:', error);

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
