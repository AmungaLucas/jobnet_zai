'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  opportunityType,
  opportunityStatus,
  opportunitySource,
  opportunityEligibility,
  organizationLocation,
  getRegionsForCountry
} from '@/constants/data'

const durationUnits = [
  { value: 'DAYS', label: 'Days' },
  { value: 'WEEKS', label: 'Weeks' },
  { value: 'MONTHS', label: 'Months' },
  { value: 'YEARS', label: 'Years' }
]

export default function EditOpportunityPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    opportunity_title: '',
    opportunity_slug: '',
    opportunity_description: '',
    opportunity_type: '',
    opportunity_status: 'ACTIVE',
    opportunity_source: 'DIRECT_CREATION',
    organization_id: '',
    country: '',
    region: '',
    city: '',
    eligibility: '',
    application_url: '',
    application_deadline: '',
    start_date: '',
    end_date: '',
    duration: '',
    duration_unit: 'MONTHS',
    benefits: '',
    requirements: '',
    featured_image: '',
    canonical_url: '',
    meta_title: '',
    meta_description: '',
    view_count: 0,
    apply_count: 0,
    created_at: null,
    created_by: null,
    updated_at: null,
    updated_by: null
  })

  // Get available regions
  const availableRegions = formData.country ? getRegionsForCountry(formData.country) : []

  // Fetch organizations for dropdown
  const [organizations, setOrganizations] = useState([])
  useEffect(() => {
    fetch('/api/organizations?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrganizations(data.data)
        }
      })
      .catch(console.error)
  }, [])

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

      const opp = data.data
      setFormData({
        opportunity_title: opp.opportunity_title || '',
        opportunity_slug: opp.opportunity_slug || '',
        opportunity_description: opp.opportunity_description || '',
        opportunity_type: opp.opportunity_type || '',
        opportunity_status: opp.opportunity_status || 'ACTIVE',
        opportunity_source: opp.opportunity_source || 'DIRECT_CREATION',
        organization_id: opp.organization_id || '',
        country: opp.country || '',
        region: opp.region || '',
        city: opp.city || '',
        eligibility: opp.eligibility || '',
        application_url: opp.application_url || '',
        application_deadline: opp.application_deadline ? opp.application_deadline.split('T')[0] : '',
        start_date: opp.start_date ? opp.start_date.split('T')[0] : '',
        end_date: opp.end_date ? opp.end_date.split('T')[0] : '',
        duration: opp.duration || '',
        duration_unit: opp.duration_unit || 'MONTHS',
        benefits: opp.benefits || '',
        requirements: opp.requirements || '',
        featured_image: opp.featured_image || '',
        canonical_url: opp.canonical_url || '',
        meta_title: opp.meta_title || '',
        meta_description: opp.meta_description || '',
        view_count: opp.view_count || 0,
        apply_count: opp.apply_count || 0,
        created_at: opp.created_at,
        created_by: opp.created_by,
        updated_at: opp.updated_at,
        updated_by: opp.updated_by
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }

      // Reset region when country changes
      if (name === 'country') {
        newData.region = ''
      }

      return newData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    // Validate required fields
    if (!formData.opportunity_title.trim()) {
      setError('Opportunity title is required')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/opportunities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null,
          view_count: parseInt(formData.view_count) || 0,
          apply_count: parseInt(formData.apply_count) || 0
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update opportunity')
      }

      setSuccess('Opportunity updated successfully!')

      // Update local state with saved data
      setFormData(prev => ({
        ...prev,
        ...data.data,
        application_deadline: data.data.application_deadline ? data.data.application_deadline.split('T')[0] : '',
        start_date: data.data.start_date ? data.data.start_date.split('T')[0] : '',
        end_date: data.data.end_date ? data.data.end_date.split('T')[0] : ''
      }))

    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href={`/dashboard/opportunities/${id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Opportunity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update opportunity listing information
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error & Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Opportunity Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="opportunity_title"
                  value={formData.opportunity_title}
                  onChange={handleChange}
                  placeholder="e.g., Google Internship Program 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Slug */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm mr-2">/opportunities/</span>
                  <input
                    type="text"
                    name="opportunity_slug"
                    value={formData.opportunity_slug}
                    onChange={handleChange}
                    placeholder="opportunity-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Description
                </label>
                <textarea
                  name="opportunity_description"
                  value={formData.opportunity_description}
                  onChange={handleChange}
                  placeholder="Full opportunity description..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opportunity Type
                </label>
                <select
                  name="opportunity_type"
                  value={formData.opportunity_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  {opportunityType.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <select
                  name="organization_id"
                  value={formData.organization_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Organization</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.organization_name}</option>
                  ))}
                </select>
              </div>

              {/* Eligibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility
                </label>
                <select
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Eligibility</option>
                  {opportunityEligibility.map(el => (
                    <option key={el.value} value={el.value}>{el.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="opportunity_status"
                  value={formData.opportunity_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {opportunityStatus.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  name="opportunity_source"
                  value={formData.opportunity_source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {opportunitySource.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {organizationLocation.map(country => (
                    <option key={country.code} value={country.name}>{country.flag} {country.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
                {availableRegions.length > 0 ? (
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Region</option>
                    {availableRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Enter region"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Application URL</label>
                <input
                  type="url"
                  name="application_url"
                  value={formData.application_url}
                  onChange={handleChange}
                  placeholder="https://example.com/apply"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 6"
                    min="1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    name="duration_unit"
                    value={formData.duration_unit}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {durationUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits & Requirements */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits & Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="List the benefits participants will receive..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="List the requirements for participation..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Image displayed when sharing on social media</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                <input
                  type="url"
                  name="canonical_url"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  placeholder="https://example.com/opportunity/slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">The preferred URL for SEO (leave blank for default)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="SEO title for the opportunity page (50-60 characters)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters. Leave blank to use opportunity title.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Brief description for search engines (150-160 characters)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters. Leave blank to use opportunity description.</p>
              </div>
            </div>
          </div>

          {/* Statistics (Admin Only) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <p className="text-sm text-gray-500 mb-4">These fields are typically auto-generated. Edit with caution.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Count</label>
                <input
                  type="number"
                  name="view_count"
                  value={formData.view_count}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Number of times this opportunity has been viewed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Count</label>
                <input
                  type="number"
                  name="apply_count"
                  value={formData.apply_count}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Number of applications received</p>
              </div>
            </div>
          </div>

          {/* Audit Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
                  {formatDate(formData.created_at)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 font-mono truncate" title={formData.created_by}>
                  {formData.created_by || 'System'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
                  {formatDate(formData.updated_at)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated By</label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 font-mono truncate" title={formData.updated_by}>
                  {formData.updated_by || 'System'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6 flex items-center justify-end space-x-3">
            <Link
              href={`/dashboard/opportunities/${id}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
