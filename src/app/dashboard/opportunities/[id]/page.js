'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { opportunityType, opportunityStatus, opportunityEligibility } from '@/constants/data'

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  EXPIRED: 'bg-red-100 text-red-800',
  PAUSED: 'bg-orange-100 text-orange-800'
}

export default function OpportunityDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchOpportunity()
  }, [id])

  const fetchOpportunity = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/opportunities/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch opportunity')
      }

      setOpportunity(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const response = await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete opportunity')
      }

      router.push('/dashboard/opportunities')
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

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeLabel = (value) => {
    const type = opportunityType.find(t => t.value === value)
    return type?.label || value
  }

  const getEligibilityLabel = (value) => {
    const el = opportunityEligibility.find(e => e.value === value)
    return el?.label || value
  }

  const getDurationLabel = () => {
    if (!opportunity) return 'N/A'
    if (!opportunity.duration) return 'Not specified'
    const unit = opportunity.duration_unit?.toLowerCase() || 'months'
    return `${opportunity.duration} ${unit}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !opportunity) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/opportunities"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Opportunity Not Found</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!opportunity) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/opportunities"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{opportunity.opportunity_title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {opportunity.organization_name && <span>{opportunity.organization_name} • </span>}
              {getTypeLabel(opportunity.opportunity_type)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/opportunities/${id}/edit`}
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
        {/* Left Column - Opportunity Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Opportunity Details</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Featured Image */}
                {opportunity.featured_image ? (
                  <img
                    src={opportunity.featured_image}
                    alt={opportunity.opportunity_title}
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
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[opportunity.opportunity_status] || 'bg-gray-100 text-gray-800'}`}>
                      {opportunity.opportunity_status}
                    </span>
                    {opportunity.eligibility && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {getEligibilityLabel(opportunity.eligibility)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{getTypeLabel(opportunity.opportunity_type)}</p>
                </div>
              </div>

              {/* Description */}
              {opportunity.opportunity_description && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <div className="prose prose-sm text-gray-600 max-w-none">
                    {opportunity.opportunity_description.split('\n').map((paragraph, index) => (
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
              <h2 className="text-lg font-medium text-gray-900">Opportunity Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Opportunity ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{opportunity.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">URL Slug</dt>
                  <dd className="mt-1 text-sm text-gray-900">{opportunity.opportunity_slug}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {[opportunity.city, opportunity.region, opportunity.country].filter(Boolean).join(', ') || 'Remote/Online'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900">{getDurationLabel()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateShort(opportunity.application_deadline)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateShort(opportunity.start_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDateShort(opportunity.end_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Application URL</dt>
                  <dd className="mt-1 text-sm text-blue-600">
                    {opportunity.application_url ? (
                      <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {opportunity.application_url}
                      </a>
                    ) : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Benefits & Requirements */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Benefits & Requirements</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits</h4>
                {opportunity.benefits ? (
                  <div className="text-sm text-gray-600 prose prose-sm">
                    {opportunity.benefits.split('\n').map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No benefits specified</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                {opportunity.requirements ? (
                  <div className="text-sm text-gray-600 prose prose-sm">
                    {opportunity.requirements.split('\n').map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No requirements specified</p>
                )}
              </div>
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
                <span className="text-lg font-semibold text-gray-900">{opportunity.view_count || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Applications</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{opportunity.apply_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Organization Card */}
          {opportunity.organization_id && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Organization</h2>
              </div>
              <div className="p-6">
                <Link href={`/dashboard/organizations/${opportunity.organization_id}`} className="hover:text-blue-600">
                  <div className="flex items-center space-x-3">
                    {opportunity.organization_logo_url ? (
                      <img src={opportunity.organization_logo_url} alt={opportunity.organization_name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">{opportunity.organization_name?.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{opportunity.organization_name}</span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* SEO Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">SEO Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Meta Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{opportunity.meta_title || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Meta Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{opportunity.meta_description || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Canonical URL</dt>
                <dd className="mt-1 text-sm text-gray-900">{opportunity.canonical_url || 'Not specified'}</dd>
              </div>
            </div>
          </div>

          {/* Audit Information Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">Audit Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(opportunity.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{opportunity.created_by || 'System'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(opportunity.updated_at)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Updated By</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{opportunity.updated_by || 'System'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{opportunity.opportunity_source?.replace(/_/g, ' ') || 'N/A'}</dd>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Opportunity</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete <span className="font-medium text-gray-900">{opportunity.opportunity_title}</span>? This action cannot be undone.
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
