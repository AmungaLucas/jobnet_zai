'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Briefcase,
  FileText,
  Eye,
  MousePointerClick,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

// Stat Card Component
function StatCard({ title, value, icon: Icon, change, trend, subtitle }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>
        {change !== null && change !== undefined && (
          <span
            className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
              trend === 'up' 
                ? 'text-emerald-700 bg-emerald-50' 
                : 'text-red-700 bg-red-50'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

// Custom Tooltip for Pie Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-500">{payload[0].value} items</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch('/api/analytics');
        const result = await res.json();
        
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const {
    overview,
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
  } = data;

  // Format data for charts
  const statusChartData = jobsByStatus.map(item => ({
    name: item.status,
    value: item.count
  }));

  const categoryChartData = jobsByCategory.map(item => ({
    name: item.category,
    count: item.count
  }));

  const employmentTypeData = jobsByEmploymentType.map(item => ({
    name: item.type?.replace(/_/g, ' ') || 'Unknown',
    value: item.count
  }));

  const oppTypeData = oppsByType.map(item => ({
    name: item.type,
    value: item.count
  }));

  const countryData = jobsByCountry.map(item => ({
    name: item.country,
    count: item.count
  }));

  const industryData = orgsByIndustry.map(item => ({
    name: item.industry,
    count: item.count
  }));

  const activityData = recentActivity.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  const jobsMonthData = jobsPerMonth.map(item => ({
    month: item.month,
    jobs: item.count
  }));

  const oppsMonthData = oppsPerMonth.map(item => ({
    month: item.month,
    opportunities: item.count
  }));

  // Combine jobs and opportunities by month
  const combinedMonthData = [];
  const monthMap = new Map();
  
  jobsMonthData.forEach(item => {
    monthMap.set(item.month, { ...monthMap.get(item.month), jobs: item.jobs });
  });
  
  oppsMonthData.forEach(item => {
    const existing = monthMap.get(item.month) || {};
    monthMap.set(item.month, { ...existing, opportunities: item.opportunities });
  });
  
  monthMap.forEach((value, key) => {
    combinedMonthData.push({
      month: key,
      jobs: value.jobs || 0,
      opportunities: value.opportunities || 0
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Platform statistics and insights</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Users"
          value={overview.users}
          icon={Users}
          subtitle="Total registered"
        />
        <StatCard
          title="Organizations"
          value={overview.organizations}
          icon={Building2}
          subtitle="Active companies"
        />
        <StatCard
          title="Jobs"
          value={overview.jobs}
          icon={Briefcase}
          subtitle="Total postings"
        />
        <StatCard
          title="Opportunities"
          value={overview.opportunities}
          icon={FileText}
          subtitle="Internships, etc."
        />
        <StatCard
          title="Views"
          value={overview.totalViews.toLocaleString()}
          icon={Eye}
          subtitle="Job views"
        />
        <StatCard
          title="Applications"
          value={overview.totalApplications.toLocaleString()}
          icon={MousePointerClick}
          subtitle="Total applies"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Status */}
        <ChartCard title="Jobs by Status">
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No job data available
            </div>
          )}
        </ChartCard>

        {/* Opportunities by Type */}
        <ChartCard title="Opportunities by Type">
          {oppTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={oppTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {oppTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              No opportunity data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Category */}
        <ChartCard title="Jobs by Category">
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </ChartCard>

        {/* Jobs by Employment Type */}
        <ChartCard title="Jobs by Employment Type">
          {employmentTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employmentTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No employment type data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs by Country */}
        <ChartCard title="Jobs by Country">
          {countryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No country data available
            </div>
          )}
        </ChartCard>

        {/* Organizations by Industry */}
        <ChartCard title="Organizations by Industry">
          {industryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={industryData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No industry data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Activity Trends */}
      <ChartCard title="Activity Trend (Last 30 Days)">
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No activity data available
          </div>
        )}
      </ChartCard>

      {/* Creation Trends */}
      <ChartCard title="Jobs & Opportunities Created (Last 12 Months)">
        {combinedMonthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedMonthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="jobs" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="opportunities" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No creation trend data available
          </div>
        )}
      </ChartCard>

      {/* Top Organizations */}
      <ChartCard title="Top Organizations by Job Count">
        {topOrgsByJobs.length > 0 ? (
          <div className="space-y-3">
            {topOrgsByJobs.map((org, index) => (
              <div key={org.organization_name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${index < 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{org.organization_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{org.job_count} jobs</span>
                  <div 
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ 
                      width: `${Math.max(20, (org.job_count / topOrgsByJobs[0].job_count) * 100)}px` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            No organization data available
          </div>
        )}
      </ChartCard>
    </div>
  );
}
