'use client'

import { useEffect, useRef, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { reportHistoryState, reportTagsState } from '@/state/atoms'
import ErrorAlert from '@/components/ErrorAlert'
import ReportHistory from '@/components/ReportHistory'
import SeoReport from '@/components/SeoReport'
import UrlInputForm, { UrlInputFormRef } from '@/components/UrlInputForm'
import { exportToPDF, generateMarkdown } from '@/lib/export'
import type { Report, ReportSummary } from '@/types/report'

export default function Home() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentReport, setCurrentReport] = useState<Report | null>(null)
	const [historyLoading, setHistoryLoading] = useState(true)
	const urlInputRef = useRef<UrlInputFormRef>(null)

	// ✅ Recoil setters
	const setReportHistory = useSetRecoilState(reportHistoryState)
	const setReportTags = useSetRecoilState(reportTagsState)

	useEffect(() => {
		loadReports()
	}, [])

	const loadReports = async () => {
		try {
			setHistoryLoading(true)
			const response = await fetch('/api/reports')
			if (!response.ok) throw new Error('Failed to load reports')
			const data = await response.json()

			if (data.success && Array.isArray(data.reports)) {
				setReportHistory(data.reports)
				setReportTags(extractTags(data.reports))
			}
		} catch (err) {
			console.error('Error loading reports:', err)
			setError('Failed to load reports')
		} finally {
			setHistoryLoading(false)
		}
	}

	// Utility: collect tags from MongoDB reports
	const extractTags = (reports: ReportSummary[]): string[] => {
		const tags = new Set<string>()
		reports.forEach(r => {
			r.tags?.forEach(t => tags.add(t))
			if (r.businessCategory) tags.add(r.businessCategory)
		})
		return Array.from(tags)
	}

	const handleAnalyze = async (url: string) => {
		setError(null)
		setLoading(true)
		setCurrentReport(null)

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			})

			const data = await response.json()
			if (!response.ok) throw new Error(data.error || 'Failed to analyze website')

			if (data.success && data.report) {
				setCurrentReport(data.report)
				await loadReports()
			} else throw new Error('Invalid response format')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleViewReport = async (id: string) => {
		try {
			const response = await fetch(`/api/reports/${id}`)
			const data = await response.json()
			if (data.success && data.report) {
				setCurrentReport(data.report)
				window.scrollTo({ top: 0, behavior: 'smooth' })
			} else setError('Failed to load report')
		} catch {
			setError('Failed to load report')
		}
	}

	const handleDeleteReport = async (id: string) => {
		try {
			const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' })
			const data = await response.json()

			if (data.success) {
				await loadReports()
				if (currentReport && (currentReport._id === id || currentReport.id?.toString() === id)) {
					setCurrentReport(null)
				}
			} else setError(data.error || 'Failed to delete report')
		} catch {
			setError('Failed to delete report')
		}
	}

	const handleExportPDF = async (id?: string) => {
		try {
			let reportToExport = currentReport
			if (id && (!currentReport || currentReport._id !== id)) {
				const response = await fetch(`/api/reports/${id}`)
				const data = await response.json()
				if (data.success && data.report) reportToExport = data.report
			}
			if (reportToExport) await exportToPDF('seo-report-content', reportToExport.url)
		} catch {
			setError('Failed to export PDF')
		}
	}

	const handleExportMarkdown = async (id?: string) => {
		try {
			let reportToExport = currentReport
			if (id && (!currentReport || currentReport._id !== id)) {
				const response = await fetch(`/api/reports/${id}`)
				const data = await response.json()
				if (data.success && data.report) reportToExport = data.report
			}
			if (reportToExport) {
				const markdown = generateMarkdown({
					url: reportToExport.url,
					metadata: reportToExport.metadata,
					aiFeedback: reportToExport.aiFeedback,
					createdAt: typeof reportToExport.createdAt === 'string'
						? reportToExport.createdAt
						: reportToExport.createdAt?.toISOString()
				})
				const blob = new Blob([markdown], { type: 'text/markdown' })
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = `seo-report-${reportToExport.url.replace(/https?:\/\//, '')}.md`
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			}
		} catch {
			setError('Failed to export Markdown')
		}
	}

	const handleBackToList = () => {
		setCurrentReport(null)
		setError(null)
		window.scrollTo({ top: 0, behavior: 'smooth' })
		urlInputRef.current?.focusInput()
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="text-center py-8 md:py-12 bg-gray-100">
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
					SEO Report Generator
				</h1>
				<p className="text-base md:text-lg text-gray-700">
					AI-powered website analysis to improve your search engine optimization
				</p>
			</header>

			<div className="container mx-auto px-4 pb-8 md:pb-12 max-w-[1400px]">
				<div className="mb-8">
					<UrlInputForm ref={urlInputRef} onAnalyze={handleAnalyze} loading={loading} />
				</div>

				{error && (
					<div className="mb-6">
						<ErrorAlert message={error} onDismiss={() => setError(null)} />
					</div>
				)}

				<div className="space-y-8">
					{currentReport ? (
						<div className="flex flex-col lg:flex-row gap-6">
							<aside className="w-full lg:w-80 flex-shrink-0">
								<ReportHistory
									onViewReport={handleViewReport}
									onDeleteReport={handleDeleteReport}
									onExportPDF={handleExportPDF}
									onExportMarkdown={handleExportMarkdown}
									loading={historyLoading}
									isReportView={true}
									currentReportId={currentReport._id}
								/>
							</aside>
							<div className="flex-1 min-w-0">
								<SeoReport
									report={currentReport}
									onExportPDF={() => handleExportPDF()}
									onExportMarkdown={() => handleExportMarkdown()}
									onBackToList={handleBackToList}
								/>
							</div>
						</div>
					) : (
						<ReportHistory
							onViewReport={handleViewReport}
							onDeleteReport={handleDeleteReport}
							onExportPDF={handleExportPDF}
							onExportMarkdown={handleExportMarkdown}
							loading={historyLoading}
							isReportView={false}
						/>
					)}
				</div>

				<footer className="text-center mt-12 md:mt-16 text-sm text-gray-600">
					Built with Next.js, TypeScript, and OpenAI
				</footer>
			</div>
		</div>
	)
}
