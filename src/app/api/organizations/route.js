import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession, getSessionId } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';

// GET - List organizations with search, filters, and pagination
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
    const industry = searchParams.get('industry') || '';
    const country = searchParams.get('country') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';

    // Build query
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(organization_name LIKE ? OR organization_description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereConditions.push('organization_status = ?');
      queryParams.push(status);
    }

    if (type) {
      whereConditions.push('organization_type = ?');
      queryParams.push(type);
    }

    if (industry) {
      whereConditions.push('organization_industry = ?');
      queryParams.push(industry);
    }

    if (country) {
      whereConditions.push('country = ?');
      queryParams.push(country);
    }

    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Validate sort column
    const validSortColumns = ['created_at', 'organization_name', 'rating', 'views', 'likes', 'updated_at'];
    const validSortOrder = ['ASC', 'DESC'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM organizations ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get organizations
    const [organizations] = await pool.query(
      `SELECT * FROM organizations ${whereClause} ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: organizations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

// POST - Create new organization
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
      organization_name,
      organization_slug,
      organization_description,
      organization_type,
      organization_industry,
      organization_website,
      organization_logo_url,
      organization_status,
      country,
      country_code,
      region,
      city,
      featured_image,
      canonical_url,
      meta_title,
      meta_description,
      created_by
    } = body;

    // Validate required fields
    if (!organization_name) {
      return NextResponse.json(
        { success: false, error: 'Organization name is required' },
        { status: 400 }
      );
    }

    // Generate ID and slug if not provided
    const id = generateId();
    const slug = organization_slug || organization_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Check if slug already exists
    const [existing] = await pool.query(
      'SELECT id FROM organizations WHERE organization_slug = ?',
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Organization with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert organization
    await pool.query(
      `INSERT INTO organizations (
        id, organization_name, organization_slug, organization_description,
        organization_type, organization_industry, organization_website,
        organization_logo_url, organization_status, country, country_code,
        region, city, featured_image, canonical_url, meta_title, meta_description,
        created_by, updated_at, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        id, organization_name, slug, organization_description || null,
        organization_type || 'PRIVATE', organization_industry || null,
        organization_website || null, organization_logo_url || null,
        organization_status || 'ACTIVE', country || null, country_code || null,
        region || null, city || null, featured_image || null, canonical_url || null,
        meta_title || null, meta_description || null, currentUserId, currentUserId
      ]
    );

    // Fetch the created organization
    const [newOrg] = await pool.query(
      'SELECT * FROM organizations WHERE id = ?',
      [id]
    );

    // Log audit
    const sessionId = session?.id || null;
    await auditLogger.logCreate('ORGANIZATION', id, newOrg[0], currentUserId, sessionId, request);

    return NextResponse.json({
      success: true,
      data: newOrg[0],
      message: 'Organization created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
