'use client'

import React from 'react'

interface Metadata {
  pageTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  h1Tags: string[]
  imageCount: number
  hasFavicon: boolean
  titleLength?: number
  descriptionLength?: number
}

interface SeoReportProps {
  report: {
    _id?: string
    id?: string | number
    url: string
    metadata: Metadata
    aiFeedback: string
    createdAt?: string
  }
}

export default function SeoReport({ report }: SeoReportProps) {
  const { url, metadata, aiFeedback, createdAt } = report

  return (
    <div
      id="seo-report-container"
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        SEO Report for {url}
      </h2>
      {createdAt && (
        <p className="text-sm text-gray-500 mb-4">
          Generated on {new Date(createdAt).toLocaleString()}
        </p>
      )}

      <section className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Page Metadata</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Title:</strong> {metadata.pageTitle || 'Missing'}</li>
          <li><strong>Description:</strong> {metadata.metaDescription || 'Missing'}</li>
          <li><strong>Keywords:</strong> {metadata.metaKeywords || 'Not specified'}</li>
          <li><strong>Images:</strong> {metadata.imageCount}</li>
          <li><strong>Favicon:</strong> {metadata.hasFavicon ? 'Present' : 'Missing'}</li>
          <li>
            <strong>H1 Tags:</strong>{' '}
            {metadata.h1Tags.length > 0 ? metadata.h1Tags.join(', ') : 'None'}
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Feedback</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">{aiFeedback}</p>
      </section>
    </div>
  )
}
