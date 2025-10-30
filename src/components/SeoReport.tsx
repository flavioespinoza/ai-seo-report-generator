'use client'

import { FileDown, FileText, ArrowLeft } from 'lucide-react'
import type { Report } from '@/types/report'
import MarkdownWithCode from './MarkdownWithCode'

interface SeoReportProps {
	report: Report
	onExportPDF: () => void
	onExportMarkdown: () => void
	onBackToList: () => void
}

export default function SeoReport({
	report,
	onExportPDF,
	onExportMarkdown,
	onBackToList
}: SeoReportProps) {
	const { url, metadata, aiFeedback, createdAt, tags, businessCategory } = report

	return (
		<div className="w-full">
			{/* Header with Export Buttons */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<button
					onClick={onBackToList}
					className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
				>
					<ArrowLeft size={18} />
					<span className="font-medium">Back to List</span>
				</button>
				
				<div className="flex gap-3">
					<button
						onClick={onExportMarkdown}
						className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						<FileText size={18} />
						<span className="font-medium">Export as Markdown</span>
					</button>
					<button
						onClick={onExportPDF}
						className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
					>
						<FileDown size={18} />
						<span className="font-medium">Export as PDF</span>
					</button>
				</div>
			</div>

			{/* Report Content */}
			<div id="seo-report-content" className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
				{/* Report Header */}
				<div className="border-b border-gray-200 pb-6">
					<h1 className="text-2xl md:text-3xl font-bold mb-2">
						SEO Report for{' '}
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 break-all"
						>
							{url}
						</a>
					</h1>
					<p className="text-sm text-gray-600">
						Generated on {createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}
					</p>
					
					{/* Tags Display */}
					{(tags || businessCategory) && (
						<div className="flex flex-wrap gap-2 mt-4">
							{businessCategory && (
								<span className="inline-block px-3 py-1 text-sm font-semibold bg-purple-100 text-purple-700 rounded-full">
									{businessCategory}
								</span>
							)}
							{tags?.map(tag => (
								<span
									key={tag}
									className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
										tag.includes('Critical') || tag.includes('Missing') || tag.includes('No ')
											? 'bg-red-100 text-red-700'
											: tag === 'Optimized'
											? 'bg-green-100 text-green-700'
											: tag === 'Needs Improvement'
											? 'bg-yellow-100 text-yellow-700'
											: 'bg-blue-100 text-blue-700'
									}`}
								>
									{tag}
								</span>
							))}
						</div>
					)}
				</div>

				{/* Page Metadata Section */}
				<div>
					<h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
						🏷️ Page Metadata
					</h2>
					<div className="space-y-3 bg-gray-50 rounded-lg p-4 md:p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<span className="font-semibold text-gray-700">Title:</span>
								<p className="text-gray-900 mt-1">
									{metadata.pageTitle || (
										<span className="text-red-600 font-medium">Missing</span>
									)}
								</p>
								{metadata.titleLength !== undefined && (
									<p className="text-xs text-gray-500 mt-1">
										Length: {metadata.titleLength} characters
										{metadata.titleLength < 30 && ' (too short)'}
										{metadata.titleLength > 60 && ' (too long)'}
									</p>
								)}
							</div>

							<div>
								<span className="font-semibold text-gray-700">Description:</span>
								<p className="text-gray-900 mt-1">
									{metadata.metaDescription || (
										<span className="text-red-600 font-medium">Missing</span>
									)}
								</p>
								{metadata.descriptionLength !== undefined && (
									<p className="text-xs text-gray-500 mt-1">
										Length: {metadata.descriptionLength} characters
										{metadata.descriptionLength < 120 && ' (too short)'}
										{metadata.descriptionLength > 160 && ' (too long)'}
									</p>
								)}
							</div>
						</div>

						<div>
							<span className="font-semibold text-gray-700">Keywords:</span>
							<p className="text-gray-900 mt-1">
								{metadata.metaKeywords || (
									<span className="text-gray-500">Not specified</span>
								)}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<span className="font-semibold text-gray-700">Images:</span>
								<p className="text-gray-900 mt-1">{metadata.imageCount}</p>
							</div>

							<div>
								<span className="font-semibold text-gray-700">Favicon:</span>
								<p className="text-gray-900 mt-1">
									{metadata.hasFavicon ? (
										<span className="text-green-600 font-medium">Present</span>
									) : (
										<span className="text-red-600 font-medium">Missing</span>
									)}
								</p>
							</div>

							<div>
								<span className="font-semibold text-gray-700">H1 Tags:</span>
								<p className="text-gray-900 mt-1">
									{metadata.h1Tags.length > 0 ? (
										<span>
											{metadata.h1Tags.length}
											{metadata.h1Tags.length > 1 && (
												<span className="text-yellow-600 text-sm ml-1">(multiple)</span>
											)}
										</span>
									) : (
										<span className="text-red-600 font-medium">None</span>
									)}
								</p>
							</div>
						</div>

						{metadata.h1Tags.length > 0 && (
							<div>
								<span className="font-semibold text-gray-700">H1 Content:</span>
								<ul className="list-disc list-inside mt-2 space-y-1">
									{metadata.h1Tags.map((tag, index) => (
										<li key={index} className="text-gray-900 ml-4">
											{tag}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>

				{/* AI-Powered SEO Analysis Section */}
				<div>
					<h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
						🤖 AI-Powered SEO Analysis
					</h2>
					<div className="prose prose-sm md:prose-base max-w-none">
						<MarkdownWithCode markdown={aiFeedback} />
					</div>
				</div>
			</div>
		</div>
	)
}