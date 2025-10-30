'use client'

import React from 'react'
import MarkdownWithCode from './MarkdownWithCode'

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
		<div id="seo-report-container" className="rounded-md bg-white p-6 shadow-lg shadow-md">
			<h2 className="text-gray-900 mb-2 text-2xl font-bold">SEO Report for <a href={url} target='_blank' className="text-blue-600">{url}</a></h2>
			{createdAt && (
				<p className="text-gray-500 mb-4 text-sm">
					Generated on {new Date(createdAt).toLocaleString()}
				</p>
			)}

			<section className="mb-6">
				<h3 className="text-gray-800 mb-2 text-lg font-semibold">Page Metadata</h3>
				<ul className="text-gray-700 space-y-1 text-sm">
					<li>
						<strong>Title:</strong> {metadata.pageTitle || 'Missing'}
					</li>
					<li>
						<strong>Description:</strong> {metadata.metaDescription || 'Missing'}
					</li>
					<li>
						<strong>Keywords:</strong> {metadata.metaKeywords || 'Not specified'}
					</li>
					<li>
						<strong>Images:</strong> {metadata.imageCount}
					</li>
					<li>
						<strong>Favicon:</strong> {metadata.hasFavicon ? 'Present' : 'Missing'}
					</li>
					<li>
						<strong>H1 Tags:</strong>{' '}
						{metadata.h1Tags.length > 0 ? metadata.h1Tags.join(', ') : 'None'}
					</li>
				</ul>
			</section>

			<section>
				<div>
        <h3 className="text-gray-900 mb-4 text-xl font-semibold">AI-Powered SEO Analysis</h3>
        <div className="prose max-w-none">
          <MarkdownWithCode markdown={aiFeedback} />
        </div>
      </div>
			</section>
		</div>
	)
}
