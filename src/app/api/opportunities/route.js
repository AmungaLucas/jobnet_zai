import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { generateId } from '@/lib/crypto';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';
import auditLogger from '@/lib/audit';
import { sanitizeString, containsDangerousContent } from '@/lib/sanitize';
import { addSecurityHeaders } from '@/lib/security';

// GET - List opportunities (public, read-only)
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
    const type = sanitizeString(searchParams.get('type') || '', { maxLength: 50 });
    const country = sanitizeString(searchParams.get('country') || '', { maxLength: 100 });
    const organizationId = sanitizeString(searchParams.get('organizationId') || '', { maxLength: 32 });
    
    // Validate sort column (whitelist)
    const validSortColumns = ['created_at', 'title', 'updated_at', 'date_posted', 'valid_through'];
    const validSortOrder = ['ASC', 'DESC'];
    const sortBy = validSortColumns.includes(searchParams.get('sortBy')) ? searchParams.get('sortBy') : 'created_at';
    const sortOrderParam = (searchParams.get('sortOrder') || 'DESC').toUpperCase();
    const sortOrder = validSortOrder.includes(sortOrderParam) ? sortOrderParam : 'DESC';

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

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM opportunities o ${whereClause}`, queryParams);
    const total = countResult[0].total;

    // Get opportunities with organization info
    const [opportunities] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url
       FROM opportunities o LEFT JOIN organizations org ON o.organization_id = org.id
       ${whereClause} ORDER BY o.${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    const response = NextResponse.json({
      success: true,
      data: opportunities,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

// POST - Create new opportunity (REQUIRES AUTHENTICATION)
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

    const pool = await getConnection();
    const body = await request.json();

    // Sanitize text fields
    const title = sanitizeString(body.title, { maxLength: 255 });
    const description = sanitizeString(body.description, { maxLength: 10000 });
    const opportunity_type = sanitizeString(body.opportunity_type, { maxLength: 50 });
    const status = sanitizeString(body.status, { maxLength: 20 });
    const organization_id = sanitizeString(body.organization_id, { maxLength: 32 });
    const country = sanitizeString(body.country, { maxLength: 100 });
    const region = sanitizeString(body.region, { maxLength: 100 });
    const city = sanitizeString(body.city, { maxLength: 100 });

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Opportunity title is required' }, { status: 400 });
    }

    // Check for dangerous content
    if (containsDangerousContent(title) || containsDangerousContent(description)) {
      return NextResponse.json({ success: false, error: 'Invalid content detected' }, { status: 400 });
    }

    // Generate ID and slug
    const id = generateId();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();

    // Insert opportunity
    await pool.query(
      `INSERT INTO opportunities (
        id, title, slug, description, opportunity_type, status, organization_id,
        country, region, city, remote, featured_image, canonical_url,
        meta_title, meta_description, date_posted, valid_through,
        created_by, updated_at, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        id, title, slug, description || null, opportunity_type || null,
        status || 'ACTIVE', organization_id || null,
        country || null, region || null, city || null, body.remote ? 1 : 0,
        body.featured_image || null, body.canonical_url || null,
        body.meta_title || null, body.meta_description || null,
        body.date_posted || null, body.valid_through || null,
        currentUserId, currentUserId
      ]
    );

    // Fetch the created opportunity
    const [newOpportunity] = await pool.query(
      `SELECT o.*, org.organization_name, org.organization_logo_url
       FROM opportunities o LEFT JOIN organizations org ON o.organization_id = org.id WHERE o.id = ?`,
      [id]
    );

    // Log audit
    await auditLogger.logCreate('OPPORTUNITY', id, newOpportunity[0], currentUserId, sessionId, request);

    const response = NextResponse.json({
      success: true,
      data: newOpportunity[0],
      message: 'Opportunity created successfully'
    }, { status: 201 });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json({ success: false, error: 'Failed to create opportunity' }, { status: 500 });
  }
}
