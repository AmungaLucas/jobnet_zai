'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  FileText,
  ArrowRight,
  Loader2,
  Sparkles,
  Globe,
  Clock,
} from 'lucide-react';

// Stat Card Component
function StatCard({ title, value, change, trend, icon: Icon, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
            <Icon className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-gray-500">{title}</span>
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
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {change}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ log }) {
  const actionColors = {
    'CREATE': 'bg-emerald-100 text-emerald-700',
    'UPDATE': 'bg-blue-100 text-blue-700',
    'DELETE': 'bg-red-100 text-red-700',
    'LOGIN_SUCCESS': 'bg-green-100 text-green-700',
    'LOGIN_FAILED': 'bg-red-100 text-red-700',
    'LOGOUT': 'bg-gray-100 text-gray-700',
  };

  const actionLabels = {
    'CREATE': 'Created',
    'UPDATE': 'Updated',
    'DELETE': 'Deleted',
    'LOGIN_SUCCESS': 'Logged in',
    'LOGIN_FAILED': 'Login failed',
    'LOGOUT': 'Logged out',
  };

  const colorClass = actionColors[log.action] || 'bg-gray-100 text-gray-700';
  const actionLabel = actionLabels[log.action] || log.action;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="px-5 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 px-2 py-1 rounded-lg text-xs font-semibold ${colorClass}`}>
            {actionLabel}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {log.entity_type}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {log.user_agent?.substring(0, 30) || 'System'}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {timeAgo(log.created_at)}
        </span>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { count: 0, change: null },
    organizations: { count: 0, change: null },
    jobs: { count: 0, change: null },
    opportunities: { count: 0, change: null },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentOpportunities, setRecentOpportunities] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersRes, orgsRes, jobsRes, oppsRes, auditRes] = await Promise.all([
          fetch('/api/auth/sessions'),
          fetch('/api/organizations?limit=1'),
          fetch('/api/jobs?limit=5'),
          fetch('/api/opportunities?limit=5'),
          fetch('/api/audit/log?limit=5'),
        ]);

        // Process responses
        const usersData = await usersRes.json();
        const orgsData = await orgsRes.json();
        const jobsData = await jobsRes.json();
        const oppsData = await oppsRes.json();
        const auditData = await auditRes.json();

        // Set stats
        setStats({
          users: { count: 1, change: null }, // Current user count
          organizations: { 
            count: orgsData.pagination?.total || orgsData.data?.length || 0, 
            change: null 
          },
          jobs: { 
            count: jobsData.pagination?.total || jobsData.data?.length || 0, 
            change: null 
          },
          opportunities: { 
            count: oppsData.pagination?.total || oppsData.data?.length || 0, 
            change: null 
          },
        });

        // Set recent activity
        if (auditData.logs || auditData.data) {
          setRecentActivity(auditData.logs || auditData.data || []);
        }

        // Set recent jobs
        if (jobsData.data) {
          setRecentJobs(jobsData.data);
        }

        // Set recent opportunities
        if (oppsData.data) {
          setRecentOpportunities(oppsData.data);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="mt-1 text-emerald-100">
              Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>
          <div className="hidden sm:block">
            <Sparkles className="h-12 w-12 text-emerald-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Users"
          value={stats.users.count}
          change={stats.users.change}
          trend="up"
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Organizations"
          value={stats.organizations.count}
          change={stats.organizations.change}
          trend="up"
          icon={Building2}
          loading={loading}
        />
        <StatCard
          title="Jobs"
          value={stats.jobs.count}
          change={stats.jobs.change}
          trend="up"
          icon={Briefcase}
          loading={loading}
        />
        <StatCard
          title="Opportunities"
          value={stats.opportunities.count}
          change={stats.opportunities.change}
          trend="up"
          icon={FileText}
          loading={loading}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-400" />
              Recent Activity
            </h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {recentActivity.map((log) => (
                <ActivityItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>

        {/* Upcoming Events / Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              Quick Overview
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            {/* Active Jobs */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Active Jobs</span>
              </div>
              <span className="text-lg font-bold text-emerald-700">
                {recentJobs.filter(j => j.job_status === 'ACTIVE').length}
              </span>
            </div>
            
            {/* Active Opportunities */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Active Opportunities</span>
              </div>
              <span className="text-lg font-bold text-blue-700">
                {recentOpportunities.filter(o => o.status === 'ACTIVE').length}
              </span>
            </div>
            
            {/* Remote Jobs */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Remote Positions</span>
              </div>
              <span className="text-lg font-bold text-purple-700">
                {recentJobs.filter(j => j.remote).length}
              </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Last Updated</span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/dashboard/jobs/create"
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all group"
          >
            <Briefcase className="h-6 w-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </Link>
          <Link
            href="/dashboard/opportunities/create"
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all group"
          >
            <FileText className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Add Opportunity</span>
          </Link>
          <Link
            href="/dashboard/organizations/create"
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all group"
          >
            <Building2 className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Add Org</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all group"
          >
            <TrendingUp className="h-6 w-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Analytics</span>
          </Link>
        </div>
      </div>

      {/* Recent Jobs & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Jobs</h2>
            <Link
              href="/dashboard/jobs"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentJobs.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {recentJobs.slice(0, 3).map((job) => (
                <Link 
                  key={job.id} 
                  href={`/dashboard/jobs/${job.id}`}
                  className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">{job.job_title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{job.organization_name || 'No org'}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{job.employment_type}</span>
                    {job.remote && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-emerald-600">Remote</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No jobs yet</p>
              <Link href="/dashboard/jobs/create" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">
                Create your first job
              </Link>
            </div>
          )}
        </div>

        {/* Recent Opportunities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Opportunities</h2>
            <Link
              href="/dashboard/opportunities"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentOpportunities.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {recentOpportunities.slice(0, 3).map((opp) => (
                <Link 
                  key={opp.id} 
                  href={`/dashboard/opportunities/${opp.id}`}
                  className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">{opp.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{opp.organization_name || 'No org'}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{opp.opportunity_type}</span>
                    {opp.remote && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-emerald-600">Remote</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No opportunities yet</p>
              <Link href="/dashboard/opportunities/create" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">
                Create your first opportunity
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
