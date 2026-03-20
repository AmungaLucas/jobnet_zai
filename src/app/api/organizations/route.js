import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';
import { sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { addSecurityHeaders } from '@/lib/security';

// Maximum payload size
const MAX_PAYLOAD_SIZE = 10000;

// GET - List organizations (public, read-only)
export async function GET(request) {
  try {
    const pool = await getConnection();
    const { searchParams } = new URL(request.url);

    // Pagination with limits
    const page = Math.min(Math.max(parseInt(searchParams.get('page') || '1'), 1), 1000);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 100);
    const offset = (page - 1) * limit;

    // Sanitize search inputs
    const search = sanitizeString(searchParams.get('search') || '', { escape: false, maxLength: 100 });
    const status = sanitizeString(searchParams.get('status') || '', { escape: false, maxLength: 50 });
    const type = sanitizeString(searchParams.get('type') || '', { escape: false, maxLength: 50 });
    const industry = sanitizeString(searchParams.get('industry') || '', { escape: false, maxLength: 50 });
    const country = sanitizeString(searchParams.get('country') || '', { escape: false, maxLength: 50 });
    
    // Validate sort column (whitelist)
    const validSortColumns = ['created_at', 'organization_name', 'rating', 'views', 'likes', 'updated_at'];
    const validSortOrder = ['ASC', 'DESC'];
    const sortBy = validSortColumns.includes(searchParams.get('sortBy')) ? searchParams.get('sortBy') : 'created_at';
    const sortOrderParam = (searchParams.get('sortOrder') || 'DESC').toUpperCase();
    const sortOrder = validSortOrder.includes(sortOrderParam) ? sortOrderParam : 'DESC';

    // Build query with parameterized inputs
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

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM organizations ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;

    // Get organizations
    const [organizations] = await pool.query(
      `SELECT * FROM organizations ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const response = NextResponse.json({
      success: true,
      data: organizations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch organizations' }, { status: 500 });
  }
}

// POST - Create new organization (REQUIRES AUTHENTICATION)
export async function POST(request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const session = token ? await validateSession(token) : null;

    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const currentUserId = session.userId;
    const sessionId = session.id;

    // Check content length
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ success: false, error: 'Request payload too large' }, { status: 413 });
    }

    const pool = await getConnection();
    const body = await request.json();
    
    // Sanitize fields
    const organization_name = sanitizeString(body.organization_name, { maxLength: 255 });
    const organization_slug = sanitizeString(body.organization_slug, { maxLength: 255 });
    const organization_description = sanitizeString(body.organization_description, { maxLength: 5000 });
    const organization_type = sanitizeString(body.organization_type, { maxLength: 50 });
    const organization_industry = sanitizeString(body.organization_industry, { maxLength: 100 });
    const organization_website = sanitizeString(body.organization_website, { maxLength: 500 });
    const organization_logo_url = sanitizeString(body.organization_logo_url, { maxLength: 500 });
    const organization_status = sanitizeString(body.organization_status, { maxLength: 20 });
    const country = sanitizeString(body.country, { maxLength: 100 });
    const country_code = sanitizeString(body.country_code, { maxLength: 10 });
    const region = sanitizeString(body.region, { maxLength: 100 });
    const city = sanitizeString(body.city, { maxLength: 100 });

    // Validate required fields
    if (!organization_name || organization_name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Organization name is required' }, { status: 400 });
    }

    // Check for dangerous content
    if (containsDangerousContent(organization_name) || containsDangerousContent(organization_description)) {
      return NextResponse.json({ success: false, error: 'Invalid content detected' }, { status: 400 });
    }

    // Generate ID and slug
    const id = generateId();
    const slug = organization_slug || organization_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now();

    // Check if slug already exists
    const [existing] = await pool.query('SELECT id FROM organizations WHERE organization_slug = ?', [slug]);

    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Organization with this slug already exists' }, { status: 400 });
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
        region || null, city || null, body.featured_image || null, body.canonical_url || null,
        body.meta_title || null, body.meta_description || null, currentUserId, currentUserId
      ]
    );

    // Fetch the created organization
    const [newOrg] = await pool.query('SELECT * FROM organizations WHERE id = ?', [id]);

    // Log audit
    await auditLogger.logCreate('ORGANIZATION', id, newOrg[0], currentUserId, sessionId, request);

    const response = NextResponse.json({
      success: true,
      data: newOrg[0],
      message: 'Organization created successfully'
    }, { status: 201 });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ success: false, error: 'Failed to create organization' }, { status: 500 });
  }
}
