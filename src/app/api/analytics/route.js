import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { validateSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const pool = await getConnection();
    
    // Validate session
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    const session = token ? await validateSession(token) : null;
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get overview stats
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [orgCount] = await pool.query('SELECT COUNT(*) as count FROM organizations');
    const [jobCount] = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const [oppCount] = await pool.query('SELECT COUNT(*) as count FROM opportunities');

    // Jobs by status
    const [jobsByStatus] = await pool.query(`
      SELECT job_status as status, COUNT(*) as count 
      FROM jobs 
      GROUP BY job_status
    `);

    // Jobs by category
    const [jobsByCategory] = await pool.query(`
      SELECT job_category as category, COUNT(*) as count 
      FROM jobs 
      WHERE job_category IS NOT NULL
      GROUP BY job_category
      ORDER BY count DESC
      LIMIT 10
    `);

    // Jobs by employment type
    const [jobsByEmploymentType] = await pool.query(`
      SELECT employment_type as type, COUNT(*) as count 
      FROM jobs 
      WHERE employment_type IS NOT NULL
      GROUP BY employment_type
    `);

    // Opportunities by type
    const [oppsByType] = await pool.query(`
      SELECT opportunity_type as type, COUNT(*) as count 
      FROM opportunities 
      WHERE opportunity_type IS NOT NULL
      GROUP BY opportunity_type
    `);

    // Opportunities by status
    const [oppsByStatus] = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM opportunities 
      GROUP BY status
    `);

    // Jobs by country
    const [jobsByCountry] = await pool.query(`
      SELECT country, COUNT(*) as count 
      FROM jobs 
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `);

    // Organizations by industry
    const [orgsByIndustry] = await pool.query(`
      SELECT organization_industry as industry, COUNT(*) as count 
      FROM organizations 
      WHERE organization_industry IS NOT NULL
      GROUP BY organization_industry
      ORDER BY count DESC
      LIMIT 10
    `);

    // Recent activity (last 30 days)
    const [recentActivity] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM audit_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Total views and applications
    const [jobStats] = await pool.query(`
      SELECT 
        COALESCE(SUM(view_count), 0) as total_views,
        COALESCE(SUM(apply_count), 0) as total_applications
      FROM jobs
    `);

    // Jobs created per month (last 12 months)
    const [jobsPerMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM jobs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Opportunities created per month (last 12 months)
    const [oppsPerMonth] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM opportunities
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    // Top organizations by job count
    const [topOrgsByJobs] = await pool.query(`
      SELECT 
        o.organization_name,
        COUNT(j.id) as job_count
      FROM organizations o
      LEFT JOIN jobs j ON o.id = j.organization_id
      GROUP BY o.id, o.organization_name
      HAVING job_count > 0
      ORDER BY job_count DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          users: userCount[0].count,
          organizations: orgCount[0].count,
          jobs: jobCount[0].count,
          opportunities: oppCount[0].count,
          totalViews: parseInt(jobStats[0].total_views) || 0,
          totalApplications: parseInt(jobStats[0].total_applications) || 0,
        },
        jobsByStatus,
        jobsByCategory,
        jobsByEmploymentType,
        oppsByType,
        oppsByStatus,
        jobsByCountry,
        orgsByIndustry,
        recentActivity,
        jobsPerMonth,
        oppsPerMonth,
        topOrgsByJobs,
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
