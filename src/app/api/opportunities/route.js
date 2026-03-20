import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';

// GET - List opportunities with search, filters, and pagination
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
    const type = searchParams.get('type') || '';
    const country = searchParams.get('country') || '';
    const organizationId = searchParams.get('organizationId') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    // Build query
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(o.title LIKE ? OR o.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereConditions.push('o.status = ?');
      queryParams.push(status);
    }

    if (type) {
      whereConditions.push('o.opportunity_type = ?');
      queryParams.push(type);
    }

    if (country) {
      whereConditions.push('o.country = ?');
      queryParams.push(country);
    }

    if (organizationId) {
      whereConditions.push('o.organization_id = ?');
      queryParams.push(organizationId);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Validate sort column
    const validSortColumns = ['created_at', 'title', 'updated_at', 'date_posted', 'valid_through'];
    const validSortOrder = ['ASC', 'DESC'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM opportunities o ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get opportunities with organization info
    const [opportunities] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url
       FROM opportunities o
       LEFT JOIN organizations org ON o.organization_id = org.id
       ${whereClause}
       ORDER BY o.${safeSortBy} ${safeSortOrder}
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: opportunities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

// POST - Create new opportunity
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
      title,
      slug,
      description,
      opportunity_type,
      status,
      organization_id,
      country,
      region,
      city,
      remote,
      featured_image,
      canonical_url,
      meta_title,
      meta_description,
      date_posted,
      valid_through
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Opportunity title is required' },
        { status: 400 }
      );
    }

    // Generate ID and slug if not provided
    const id = generateId();
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Check if slug already exists
    const [existing] = await pool.query(
      'SELECT id FROM opportunities WHERE slug = ?',
      [finalSlug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert opportunity (only using columns that exist in the table)
    await pool.query(
      `INSERT INTO opportunities (
        id, title, slug, description, opportunity_type,
        status, organization_id, country, region, city, remote,
        featured_image, canonical_url, meta_title, meta_description,
        date_posted, valid_through, created_by, updated_at, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        id, title, finalSlug, description || null, opportunity_type || null,
        status || 'ACTIVE', organization_id || null,
        country || null, region || null, city || null, remote ? 1 : 0,
        featured_image || null, canonical_url || null, meta_title || null, meta_description || null,
        date_posted || null, valid_through || null,
        currentUserId, currentUserId
      ]
    );

    // Fetch the created opportunity with organization info
    const [newOpportunity] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url
       FROM opportunities o
       LEFT JOIN organizations org ON o.organization_id = org.id
       WHERE o.id = ?`,
      [id]
    );

    // Log audit
    const sessionId = session?.id || null;
    await auditLogger.logCreate('OPPORTUNITY', id, newOpportunity[0], currentUserId, sessionId, request);

    return NextResponse.json({
      success: true,
      data: newOpportunity[0],
      message: 'Opportunity created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
