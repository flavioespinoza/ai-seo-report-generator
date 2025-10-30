'use client'

import { Report } from '@/types/report'
import { getTagColor } from '@/utils/getTagColor'
import { ArrowLeft, FileDown, FileText } from 'lucide-react'

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
	if (!report) return null

	return (
		<div className="w-full rounded-lg bg-white p-6 shadow-md sm:p-8">
			{/* 🧭 Header Section */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<button
						onClick={onBackToList}
						className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
					>
						<ArrowLeft size={16} />
						Back to List
					</button>

					<h2 className="text-gray-900 mt-3 break-words text-2xl font-bold">
						{report.pageTitle || '(Untitled Page)'}
					</h2>
					<p className="text-gray-600 mt-1 break-all text-sm">{report.url}</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<button
						onClick={onExportPDF}
						className="border-gray-300 hover:bg-gray-100 flex items-center gap-1 rounded border px-3 py-2 text-sm font-medium transition"
					>
						<FileDown size={16} />
						PDF
					</button>
					<button
						onClick={onExportMarkdown}
						className="border-gray-300 hover:bg-gray-100 flex items-center gap-1 rounded border px-3 py-2 text-sm font-medium transition"
					>
						<FileText size={16} />
						Markdown
					</button>
				</div>
			</div>

			{/* 🏷️ Tags */}
			{report.tags && report.tags.length > 0 && (
				<div className="mb-6 flex flex-wrap gap-2">
					{report.tags.map((tag) => (
						<span
							key={tag}
							className={`inline-block rounded border px-3 py-1 text-xs font-semibold ${getTagColor(
								tag
							)}`}
						>
							{tag}
						</span>
					))}
					{report.businessCategory && (
						<span
							className={`inline-block rounded border px-3 py-1 text-xs font-semibold ${getTagColor(
								report.businessCategory
							)}`}
						>
							{report.businessCategory}
						</span>
					)}
				</div>
			)}

			{/* 📊 Metadata Section */}
			<section className="mb-8">
				<h3 className="text-gray-900 mb-3 text-lg font-semibold">Metadata Overview</h3>
				<div className="text-gray-700 space-y-2 text-sm">
					<p>
						<strong>Title:</strong> {report.metadata?.pageTitle || 'N/A'}
					</p>
					<p>
						<strong>Description:</strong> {report.metadata?.metaDescription || 'N/A'}
					</p>
					<p>
						<strong>Keywords:</strong> {report.metadata?.metaKeywords?.join(', ') || 'N/A'}
					</p>
					<p>
						<strong>H1 Tags:</strong> {report.metadata?.h1Tags?.join(', ') || 'N/A'}
					</p>
					<p>
						<strong>Images Found:</strong> {report.metadata?.imageCount ?? 'N/A'}
					</p>
					<p>
						<strong>Favicon:</strong> {report.metadata?.hasFavicon ? 'Yes' : 'No'}
					</p>
				</div>
			</section>

			{/* 🤖 AI Feedback */}
			<section>
				<h3 className="text-gray-900 mb-3 text-lg font-semibold">AI Feedback</h3>
				<div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
					{typeof report.aiFeedback === 'string'
						? report.aiFeedback
						: JSON.stringify(report.aiFeedback, null, 2)}
				</div>
			</section>
		</div>
	)
}
