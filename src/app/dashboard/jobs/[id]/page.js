'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  jobCategory,
  jobStatus,
  employmentType,
  experienceLevel,
  currencies
} from '@/constants/data'

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800',
  PAUSED: 'bg-orange-100 text-orange-800'
}

export default function JobDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/jobs/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch job')
      }

      setJob(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete job')
      }

      router.push('/dashboard/jobs')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatSalary = () => {
    if (!job) return 'N/A'
    if (!job.salary_min && !job.salary_max) return 'Not specified'
    const curr = job.salary_currency || 'KES'
    const formatNum = (n) => n?.toLocaleString() || ''
    if (job.salary_min && job.salary_max) return `${curr} ${formatNum(job.salary_min)} - ${formatNum(job.salary_max)}`
    return `${curr} ${formatNum(job.salary_min || job.salary_max)}`
  }

  const getCategoryLabel = (value) => {
    const cat = jobCategory.find(c => c.value === value)
    return cat?.label || value
  }

  const getEmploymentLabel = (value) => {
    const type = employmentType.find(t => t.value === value)
    return type?.label || value
  }

  const getExperienceLabel = (value) => {
    const level = experienceLevel.find(l => l.value === value)
    return level?.label || value
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/jobs"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Job Not Found</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/jobs"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.job_title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {job.organization_name && <span>{job.organization_name} • </span>}
              {getEmploymentLabel(job.employment_type)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/jobs/${id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Featured Image */}
                {job.featured_image ? (
                  <img
                    src={job.featured_image}
                    alt={job.job_title}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.job_status] || 'bg-gray-100 text-gray-800'}`}>
                      {job.job_status}
                    </span>
                    {job.remote === 1 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Remote
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{getCategoryLabel(job.job_category)}</p>
                  {job.job_subcategory && (
                    <p className="text-sm text-gray-400">{job.job_subcategory.replace(/_/g, ' ')}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              {job.job_description && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <div className="prose prose-sm text-gray-600 max-w-none">
                    {job.job_description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Job Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Job ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{job.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">URL Slug</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.job_slug}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{getEmploymentLabel(job.employment_type)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                  <dd className="mt-1 text-sm text-gray-900">{getExperienceLabel(job.experience_level)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Salary</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatSalary()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {[job.city, job.region, job.country].filter(Boolean).join(', ') || 'Remote'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date Posted</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.date_posted ? formatDate(job.date_posted) : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Valid Through</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.valid_through ? formatDate(job.valid_through) : 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Metadata */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Statistics</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{job.view_count || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Applications</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{job.apply_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Organization Card */}
          {job.organization_id && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Organization</h2>
              </div>
              <div className="p-6">
                <Link href={`/dashboard/organizations/${job.organization_id}`} className="hover:text-blue-600">
                  <div className="flex items-center space-x-3">
                    {job.organization_logo_url ? (
                      <img src={job.organization_logo_url} alt={job.organization_name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">{job.organization_name?.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{job.organization_name}</span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Audit Information Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Audit Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(job.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{job.created_by || 'System'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(job.updated_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated By</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{job.updated_by || 'System'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{job.job_source?.replace(/_/g, ' ') || 'N/A'}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Job</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete <span className="font-medium text-gray-900">{job.job_title}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
