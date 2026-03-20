'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  organizationType,
  organizationIndustry,
  organizationLocation,
  organizationStatus,
  getRegionsForCountry,
  getCountryInfo
} from '@/constants/data'

export default function EditOrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    organization_name: '',
    organization_slug: '',
    organization_description: '',
    organization_type: '',
    organization_industry: '',
    organization_website: '',
    organization_logo_url: '',
    organization_status: '',
    country: '',
    country_code: '',
    region: '',
    city: '',
    is_verified: false,
    views: 0,
    likes: 0,
    rating: 0,
    featured_image: '',
    canonical_url: '',
    meta_title: '',
    meta_description: '',
    created_at: null,
    created_by: null,
    updated_at: null,
    updated_by: null
  })

  // Get available regions based on selected country
  const availableRegions = formData.country ? getRegionsForCountry(formData.country) : []

  useEffect(() => {
    fetchOrganization()
  }, [id])

  const fetchOrganization = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/organizations/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch organization')
      }

      setFormData({
        organization_name: data.data.organization_name || '',
        organization_slug: data.data.organization_slug || '',
        organization_description: data.data.organization_description || '',
        organization_type: data.data.organization_type || 'PRIVATE',
        organization_industry: data.data.organization_industry || '',
        organization_website: data.data.organization_website || '',
        organization_logo_url: data.data.organization_logo_url || '',
        organization_status: data.data.organization_status || 'ACTIVE',
        country: data.data.country || '',
        country_code: data.data.country_code || '',
        region: data.data.region || '',
        city: data.data.city || '',
        is_verified: Boolean(data.data.is_verified),
        views: data.data.views || 0,
        likes: data.data.likes || 0,
        rating: data.data.rating || 0,
        featured_image: data.data.featured_image || '',
        canonical_url: data.data.canonical_url || '',
        meta_title: data.data.meta_title || '',
        meta_description: data.data.meta_description || '',
        created_at: data.data.created_at,
        created_by: data.data.created_by,
        updated_at: data.data.updated_at,
        updated_by: data.data.updated_by
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

      // Auto-populate country code when country changes
      if (name === 'country') {
        const countryInfo = getCountryInfo(value)
        if (countryInfo) {
          newData.country_code = countryInfo.code
        }
        // Reset region when country changes
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
    if (!formData.organization_name.trim()) {
      setError('Organization name is required')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          updated_by: user?.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update organization')
      }

      setSuccess('Organization updated successfully!')

      // Update local state with saved data
      setFormData(prev => ({
        ...prev,
        ...data.data
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
          href={`/dashboard/organizations/${id}`}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Organization</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update organization information
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
              {/* Organization Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  placeholder="Enter organization name"
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
                  <span className="text-gray-500 text-sm mr-2">/organizations/</span>
                  <input
                    type="text"
                    name="organization_slug"
                    value={formData.organization_slug}
                    onChange={handleChange}
                    placeholder="organization-slug"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="organization_description"
                  value={formData.organization_description}
                  onChange={handleChange}
                  placeholder="Brief description of the organization"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="organization_website"
                  value={formData.organization_website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="organization_logo_url"
                  value={formData.organization_logo_url}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
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
                  Organization Type
                </label>
                <select
                  name="organization_type"
                  value={formData.organization_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {organizationType.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  name="organization_industry"
                  value={formData.organization_industry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Industry</option>
                  {organizationIndustry.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="organization_status"
                  value={formData.organization_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {organizationStatus.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {organizationLocation.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Code (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code
                </label>
                <input
                  type="text"
                  name="country_code"
                  value={formData.country_code}
                  readOnly
                  placeholder="Auto-filled"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              {/* Region/State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region/State
                </label>
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

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
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

          {/* Statistics (Admin Only) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Views */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Views
                </label>
                <input
                  type="number"
                  name="views"
                  value={formData.views}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Likes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Likes
                </label>
                <input
                  type="number"
                  name="likes"
                  value={formData.likes}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Verified */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification
                </label>
                <div className="flex items-center h-10">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="is_verified"
                      checked={formData.is_verified}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified Organization</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  placeholder="https://example.com/featured-image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Image displayed when sharing on social media</p>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Canonical URL
                </label>
                <input
                  type="url"
                  name="canonical_url"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  placeholder="https://example.com/organizations/organization-slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">The preferred URL for SEO (leave blank for default)</p>
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="SEO title for the organization page (50-60 characters)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters. Leave blank to use organization name.</p>
              </div>

              {/* Meta Description */}
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
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters. Leave blank to use organization description.</p>
              </div>
            </div>
          </div>

          {/* Audit Information (Read-only) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created At
                </label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
                  {formatDate(formData.created_at)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created By
                </label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 font-mono truncate" title={formData.created_by}>
                  {formData.created_by || 'System'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Updated At
                </label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
                  {formatDate(formData.updated_at)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Updated By
                </label>
                <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 font-mono truncate" title={formData.updated_by}>
                  {formData.updated_by || 'System'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6 flex items-center justify-end space-x-3">
            <Link
              href={`/dashboard/organizations/${id}`}
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
