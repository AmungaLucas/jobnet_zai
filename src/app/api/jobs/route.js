import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

// GET - List jobs with search, filters, and pagination
export async function GET(request) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Search & Filters
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const employmentType = searchParams.get('employmentType') || '';
    const experienceLevel = searchParams.get('experienceLevel') || '';
    const country = searchParams.get('country') || '';
    const organizationId = searchParams.get('organizationId') || '';
    const remote = searchParams.get('remote') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

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

    // Validate sort column
    const validSortColumns = ['created_at', 'job_title', 'view_count', 'apply_count', 'salary_min', 'updated_at', 'date_posted'];
    const validSortOrder = ['ASC', 'DESC'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

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
       ORDER BY j.${safeSortBy} ${safeSortOrder}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request) {
  try {
    const pool = await getConnection();

    // Get current user from session
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const session = token ? await validateSession(token) : null;
    const currentUserId = session?.userId || null;

    const body = await request.json();
    const {
      job_title,
      job_slug,
      job_description,
      job_category,
      job_subcategory,
      job_status,
      job_source,
      employment_type,
      experience_level,
      organization_id,
      country,
      region,
      city,
      remote,
      salary_min,
      salary_max,
      salary_currency,
      date_posted,
      valid_through,
      featured_image,
      canonical_url,
      meta_title,
      meta_description
    } = body;

    // Validate required fields
    if (!job_title) {
      return NextResponse.json(
        { success: false, error: 'Job title is required' },
        { status: 400 }
      );
    }

    // Generate ID and slug if not provided
    const id = generateId();
    const slug = job_slug || job_title
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
        job_status || 'ACTIVE', job_source || 'DIRECT_CREATION', employment_type || null,
        experience_level || null, organization_id || null,
        country || null, region || null, city || null, remote ? 1 : 0,
        salary_min || null, salary_max || null, salary_currency || null,
        date_posted || null, valid_through || null, featured_image || null,
        canonical_url || null, meta_title || null, meta_description || null,
        currentUserId, currentUserId
      ]
    );

    // Fetch the created job with organization info
    const [newJob] = await pool.query(
      `SELECT j.*, o.organization_name, o.organization_logo_url
       FROM jobs j
       LEFT JOIN organizations o ON j.organization_id = o.id
       WHERE j.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: newJob[0],
      message: 'Job created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
