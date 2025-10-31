'use client'

import { Report } from '@/types/report'
import { getTagColor } from '@/utils/getTagColor'
import { ArrowLeft, FileDown, FileText } from 'lucide-react'
import MarkdownWithCode from './MarkdownWithCode'

interface SeoReportProps {
	report: Report
	onExportPDF: () => void
	onExportMarkdown: () => void
	onBackToList: () => void
}

/**
 * A component that displays a detailed SEO report.
 * It includes a header with the page title and URL, action buttons to export the report,
 * a list of SEO tags, a metadata overview, and AI-generated feedback rendered as Markdown.
 *
 * @param {SeoReportProps} props - The props for the component.
 * @param {Report} props.report - The SEO report data to display.
 * @param {() => void} props.onExportPDF - Function to handle exporting the report as a PDF.
 * @param {() => void} props.onExportMarkdown - Function to handle exporting the report as Markdown.
 * @param {() => void} props.onBackToList - Function to navigate back to the report list view.
 * @returns {JSX.Element | null} The rendered SEO report, or null if no report is provided.
 */
export default function SeoReport({
	report,
	onExportPDF,
	onExportMarkdown,
	onBackToList
}: SeoReportProps) {
	if (!report) return null

	return (
		<div id="seo-report-content" className="w-full rounded-lg bg-white p-6 shadow-md sm:p-8">
			{/* 🧭 Header Section */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<button onClick={onBackToList} className="btn-danger py-2 text-[11px]">
						<ArrowLeft size={16} />
						Back to List
					</button>

					<h2 className="mt-[30px] break-words text-2xl font-bold text-gray-900">
						{report.pageTitle || '(Untitled Page)'}
					</h2>
					<p className="mt-1 break-all text-sm text-gray-600">{report.url}</p>
				</div>

				<div className="mt-[30px] flex flex-wrap gap-2">
					<button onClick={onExportPDF} className="btn-danger">
						<FileDown size={16} />
						PDF
					</button>
					<button onClick={onExportMarkdown} className="btn-primary">
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
				<h3 className="mb-3 text-lg font-semibold text-gray-900">Metadata Overview</h3>
				<div className="space-y-2 text-sm text-gray-700">
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
				<h3 className="mb-3 text-lg font-semibold text-gray-900">AI Feedback</h3>
				<div>
					{typeof report.aiFeedback === 'string' && (
						<MarkdownWithCode markdown={report.aiFeedback} />
					)}
				</div>
			</section>
		</div>
	)
}
