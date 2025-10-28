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
		id?: number
		url: string
		metadata: Metadata
		aiFeedback: string
		createdAt?: string
	}
	onExport?: () => void
}

export default function SeoReport({ report, onExport }: SeoReportProps) {
	const { metadata, aiFeedback, url, createdAt } = report

	const getStatusColor = (hasValue: boolean) => {
		return hasValue ? 'text-green-600' : 'text-red-600'
	}

	const getStatusIcon = (hasValue: boolean) => {
		return hasValue ? '✓' : '✗'
	}

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6">
			<div className="rounded-lg bg-white p-6 shadow-md">
				<div className="mb-4 flex items-start justify-between">
					<div className="flex-1">
						<h2 className="text-gray-900 mb-2 text-2xl font-bold">SEO Analysis Report</h2>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="break-all text-blue-600 hover:underline"
						>
							{url}
						</a>
						{createdAt && (
							<p className="text-gray-500 mt-2 text-sm">
								Generated: {new Date(createdAt).toLocaleString()}
							</p>
						)}
					</div>
					{onExport && (
						<button
							onClick={onExport}
							className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium transition"
						>
							Export Report
						</button>
					)}
				</div>
			</div>

			<div className="rounded-lg bg-white p-6 shadow-md">
				<h3 className="text-gray-900 mb-4 text-xl font-semibold">Page Metadata</h3>
				<div className="space-y-4">
					<div>
						<div className="mb-1 flex items-center gap-2">
							<span className={`font-medium ${getStatusColor(!!metadata.pageTitle)}`}>
								{getStatusIcon(!!metadata.pageTitle)}
							</span>
							<span className="text-gray-700 font-medium">Page Title</span>
							{metadata.titleLength && (
								<span className="text-gray-500 text-sm">({metadata.titleLength} characters)</span>
							)}
						</div>
						<p className="text-gray-600 ml-6">{metadata.pageTitle || 'No title found'}</p>
					</div>

					<div>
						<div className="mb-1 flex items-center gap-2">
							<span className={`font-medium ${getStatusColor(!!metadata.metaDescription)}`}>
								{getStatusIcon(!!metadata.metaDescription)}
							</span>
							<span className="text-gray-700 font-medium">Meta Description</span>
							{metadata.descriptionLength && (
								<span className="text-gray-500 text-sm">
									({metadata.descriptionLength} characters)
								</span>
							)}
						</div>
						<p className="text-gray-600 ml-6">
							{metadata.metaDescription || 'No description found'}
						</p>
					</div>

					<div>
						<div className="mb-1 flex items-center gap-2">
							<span className={`font-medium ${getStatusColor(metadata.h1Tags.length > 0)}`}>
								{getStatusIcon(metadata.h1Tags.length > 0)}
							</span>
							<span className="text-gray-700 font-medium">H1 Tags</span>
							<span className="text-gray-500 text-sm">({metadata.h1Tags.length} found)</span>
						</div>
						{metadata.h1Tags.length > 0 ? (
							<ul className="ml-6 space-y-1">
								{metadata.h1Tags.map((tag, index) => (
									<li key={index} className="text-gray-600">
										• {tag}
									</li>
								))}
							</ul>
						) : (
							<p className="text-gray-600 ml-6">No H1 tags found</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4 pt-2">
						<div>
							<span className="text-gray-700 font-medium">Images: </span>
							<span className="text-gray-600">{metadata.imageCount}</span>
						</div>
						<div>
							<span className="text-gray-700 font-medium">Favicon: </span>
							<span className={getStatusColor(metadata.hasFavicon)}>
								{metadata.hasFavicon ? 'Present' : 'Missing'}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="rounded-lg bg-white p-6 shadow-md">
				<h3 className="text-gray-900 mb-4 text-xl font-semibold">AI-Powered SEO Analysis</h3>
				<div className="prose max-w-none">
					<div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{aiFeedback}</div>
				</div>
			</div>
		</div>
	)
}
