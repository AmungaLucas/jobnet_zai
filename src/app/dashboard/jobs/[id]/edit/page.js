'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  jobCategory,
  jobStatus,
  jobSource,
  employmentType,
  experienceLevel,
  organizationLocation,
  currencies,
  getRegionsForCountry,
  getCountryInfo,
  getSubcategoriesForCategory
} from '@/constants/data'

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    job_title: '',
    job_slug: '',
    job_description: '',
    job_category: '',
    job_subcategory: '',
    job_status: 'ACTIVE',
    job_source: 'DIRECT_CREATION',
    employment_type: 'FULL_TIME',
    experience_level: 'ENTRY_LEVEL',
    organization_id: '',
    country: '',
    region: '',
    city: '',
    remote: false,
    salary_min: '',
    salary_max: '',
    salary_currency: 'KES',
    date_posted: '',
    valid_through: '',
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

  // Get available regions and subcategories
  const availableRegions = formData.country ? getRegionsForCountry(formData.country) : []
  const availableSubcategories = formData.job_category ? getSubcategoriesForCategory(formData.job_category) : []

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

      const job = data.data
      setFormData({
        job_title: job.job_title || '',
        job_slug: job.job_slug || '',
        job_description: job.job_description || '',
        job_category: job.job_category || '',
        job_subcategory: job.job_subcategory || '',
        job_status: job.job_status || 'ACTIVE',
        job_source: job.job_source || 'DIRECT_CREATION',
        employment_type: job.employment_type || 'FULL_TIME',
        experience_level: job.experience_level || 'ENTRY_LEVEL',
        organization_id: job.organization_id || '',
        country: job.country || '',
        region: job.region || '',
        city: job.city || '',
        remote: Boolean(job.remote),
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        salary_currency: job.salary_currency || 'KES',
        date_posted: job.date_posted ? job.date_posted.split('T')[0] : '',
        valid_through: job.valid_through ? job.valid_through.split('T')[0] : '',
        featured_image: job.featured_image || '',
        canonical_url: job.canonical_url || '',
        meta_title: job.meta_title || '',
        meta_description: job.meta_description || '',
        view_count: job.view_count || 0,
        apply_count: job.apply_count || 0,
        created_at: job.created_at,
        created_by: job.created_by,
        updated_at: job.updated_at,
        updated_by: job.updated_by
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

      // Auto-populate currency when country changes
      if (name === 'country') {
        const countryInfo = getCountryInfo(value)
        if (countryInfo) {
          newData.salary_currency = countryInfo.code === 'KE' ? 'KES' : 
                                    countryInfo.code === 'UG' ? 'UGX' :
                                    countryInfo.code === 'TZ' ? 'TZS' : 'USD'
        }
        newData.region = ''
      }

      // Reset subcategory when category changes
      if (name === 'job_category') {
        newData.job_subcategory = ''
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
    if (!formData.job_title.trim()) {
      setError('Job title is required')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
          view_count: parseInt(formData.view_count) || 0,
          apply_count: parseInt(formData.apply_count) || 0
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update job')
      }

      setSuccess('Job updated successfully!')

      // Update local state with saved data
      setFormData(prev => ({
        ...prev,
        ...data.data,
        date_posted: data.data.date_posted ? data.data.date_posted.split('T')[0] : '',
        valid_through: data.data.valid_through ? data.data.valid_through.split('T')[0] : ''
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
          href={`/dashboard/jobs/${id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update job listing information
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
              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
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
                  <span className="text-gray-500 text-sm mr-2">/jobs/</span>
                  <input
                    type="text"
                    name="job_slug"
                    value={formData.job_slug}
                    onChange={handleChange}
                    placeholder="job-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleChange}
                  placeholder="Full job description..."
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
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Category
                </label>
                <select
                  name="job_category"
                  value={formData.job_category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {jobCategory.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                {availableSubcategories.length > 0 ? (
                  <select
                    name="job_subcategory"
                    value={formData.job_subcategory}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map(sub => (
                      <option key={sub.value} value={sub.value}>{sub.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="job_subcategory"
                    value={formData.job_subcategory}
                    onChange={handleChange}
                    placeholder="Enter subcategory"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
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

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {employmentType.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {experienceLevel.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="job_status"
                  value={formData.job_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {jobStatus.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                <div className="flex items-center h-10">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="remote"
                      checked={formData.remote}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="e.g., 80000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  name="salary_currency"
                  value={formData.salary_currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map(curr => (
                    <option key={curr.value} value={curr.value}>{curr.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Posted</label>
                <input
                  type="date"
                  name="date_posted"
                  value={formData.date_posted}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Through</label>
                <input
                  type="date"
                  name="valid_through"
                  value={formData.valid_through}
                  onChange={handleChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canonical URL
                </label>
                <input
                  type="url"
                  name="canonical_url"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  placeholder="https://example.com/job/slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">The preferred URL for SEO (leave blank for default)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="SEO title for the job page (50-60 characters)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters. Leave blank to use job title.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Brief description for search engines (150-160 characters)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters. Leave blank to use job description.</p>
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
                <p className="text-xs text-gray-500 mt-1">Number of times this job has been viewed</p>
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
              href={`/dashboard/jobs/${id}`}
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
