import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';
import { sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { addSecurityHeaders } from '@/lib/security';

// Maximum payload size
const MAX_PAYLOAD_SIZE = 20000;

// GET - List jobs (public, read-only)
export async function GET(request) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);

    // Pagination with limits
    const page = Math.min(Math.max(parseInt(searchParams.get('page') || '1'), 1), 1000);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 100);
    const offset = (page - 1) * limit;

    // Sanitize search inputs
    const search = sanitizeString(searchParams.get('search') || '', { maxLength: 100 });
    const status = sanitizeString(searchParams.get('status') || '', { maxLength: 50 });
    const category = sanitizeString(searchParams.get('category') || '', { maxLength: 50 });
    const employmentType = sanitizeString(searchParams.get('employmentType') || '', { maxLength: 50 });
    const experienceLevel = sanitizeString(searchParams.get('experienceLevel') || '', { maxLength: 50 });
    const country = sanitizeString(searchParams.get('country') || '', { maxLength: 100 });
    const organizationId = sanitizeString(searchParams.get('organizationId') || '', { maxLength: 32 });
    const remote = searchParams.get('remote');
    
    // Validate sort column (whitelist)
    const validSortColumns = ['created_at', 'job_title', 'view_count', 'apply_count', 'salary_min', 'updated_at', 'date_posted'];
    const validSortOrder = ['ASC', 'DESC'];
    const sortBy = validSortColumns.includes(searchParams.get('sortBy')) ? searchParams.get('sortBy') : 'created_at';
    const sortOrderParam = (searchParams.get('sortOrder') || 'DESC').toUpperCase();
    const sortOrder = validSortOrder.includes(sortOrderParam) ? sortOrderParam : 'DESC';

    // Build query
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(j.job_title LIKE ? OR j.job_description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereConditions.push('j.job_status = ?');
      queryParams.push(status);
    }

    if (category) {
      whereConditions.push('j.job_category = ?');
      queryParams.push(category);
    }

    if (employmentType) {
      whereConditions.push('j.employment_type = ?');
      queryParams.push(employmentType);
    }

    if (experienceLevel) {
      whereConditions.push('j.experience_level = ?');
      queryParams.push(experienceLevel);
    }

    if (country) {
      whereConditions.push('j.country = ?');
      queryParams.push(country);
    }

    if (organizationId) {
      whereConditions.push('j.organization_id = ?');
      queryParams.push(organizationId);
    }

    if (remote === 'true') {
      whereConditions.push('j.remote = 1');
    } else if (remote === 'false') {
      whereConditions.push('j.remote = 0');
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM jobs j ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get jobs with organization info
    const [jobs] = await pool.query(
      `SELECT j.*, o.organization_name, o.organization_logo_url
       FROM jobs j
       LEFT JOIN organizations o ON j.organization_id = o.id
       ${whereClause}
       ORDER BY j.${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const response = NextResponse.json({
      success: true,
      data: jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create new job (REQUIRES AUTHENTICATION)
export async function POST(request) {
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

    // Check content length
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Request payload too large' },
        { status: 413 }
      );
    }

    const pool = await getConnection();
    const body = await request.json();

    // Sanitize text fields
    const job_title = sanitizeString(body.job_title, { maxLength: 255 });
    const job_description = sanitizeString(body.job_description, { maxLength: 10000 });
    const job_category = sanitizeString(body.job_category, { maxLength: 100 });
    const job_subcategory = sanitizeString(body.job_subcategory, { maxLength: 100 });
    const job_status = sanitizeString(body.job_status, { maxLength: 20 });
    const employment_type = sanitizeString(body.employment_type, { maxLength: 50 });
    const experience_level = sanitizeString(body.experience_level, { maxLength: 50 });
    const organization_id = sanitizeString(body.organization_id, { maxLength: 32 });
    const country = sanitizeString(body.country, { maxLength: 100 });
    const region = sanitizeString(body.region, { maxLength: 100 });
    const city = sanitizeString(body.city, { maxLength: 100 });

    // Validate required fields
    if (!job_title || job_title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Job title is required' },
        { status: 400 }
      );
    }

    // Check for dangerous content
    if (containsDangerousContent(job_title) || containsDangerousContent(job_description)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content detected' },
        { status: 400 }
      );
    }

    // Generate ID and slug
    const id = generateId();
    const slug = job_title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Check if slug already exists
    const [existing] = await pool.query(
      'SELECT id FROM jobs WHERE job_slug = ?',
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Job with this slug already exists' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const salary_min = body.salary_min ? parseFloat(body.salary_min) : null;
    const salary_max = body.salary_max ? parseFloat(body.salary_max) : null;

    // Insert job
    await pool.query(
      `INSERT INTO jobs (
        id, job_title, job_slug, job_description, job_category, job_subcategory,
        job_status, job_source, employment_type, experience_level, organization_id,
        country, region, city, remote, salary_min, salary_max, salary_currency,
        date_posted, valid_through, featured_image, canonical_url, meta_title, meta_description,
        created_by, updated_at, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        id, job_title, slug, job_description || null, job_category || null, job_subcategory || null,
        job_status || 'ACTIVE', 'DIRECT_CREATION', employment_type || null,
        experience_level || null, organization_id || null,
        country || null, region || null, city || null, body.remote ? 1 : 0,
        salary_min, salary_max, body.salary_currency || null,
        body.date_posted || null, body.valid_through || null, body.featured_image || null,
        body.canonical_url || null, body.meta_title || null, body.meta_description || null,
        currentUserId, currentUserId
      ]
    );

    // Fetch the created job
    const [newJob] = await pool.query(
      `SELECT j.*, o.organization_name, o.organization_logo_url
       FROM jobs j
       LEFT JOIN organizations o ON j.organization_id = o.id
       WHERE j.id = ?`,
      [id]
    );

    // Log audit
    await auditLogger.logCreate('JOB', id, newJob[0], currentUserId, sessionId, request);

    const response = NextResponse.json({
      success: true,
      data: newJob[0],
      message: 'Job created successfully'
    }, { status: 201 });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
