'use client'

import { useEffect, useRef, useState } from 'react'
import ErrorAlert from '@/components/ErrorAlert'
import ExportButtons from '@/components/ExportButtons'
import ReportHistory from '@/components/ReportHistory'
import SeoReport from '@/components/SeoReport'
import UrlInputForm, { UrlInputFormRef } from '@/components/UrlInputForm'
import { exportToPDF, generateMarkdown } from '@/lib/export'
import type { Report, ReportSummary } from '@/types/report'

export default function Home() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentReport, setCurrentReport] = useState<Report | null>(null)
	const [reportHistory, setReportHistory] = useState<ReportSummary[]>([])
	const [historyLoading, setHistoryLoading] = useState(true)
	const urlInputRef = useRef<UrlInputFormRef>(null)

	useEffect(() => {
		const loadReports = async () => {
			try {
				setHistoryLoading(true)
				const response = await fetch('/api/reports')
				if (!response.ok) {
					console.error('Failed to load reports: HTTP', response.status)
					return
				}
				const data = await response.json()
				if (data.success && Array.isArray(data.reports)) {
					setReportHistory(data.reports)
				} else {
					console.error('Unexpected response format:', data)
				}
			} catch (err) {
				console.error('Error fetching report history:', err)
			} finally {
				setHistoryLoading(false)
			}
		}

		loadReports()
	}, [])

	const handleAnalyze = async (url: string) => {
		setLoading(true)
		setError(null)
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
				// Refresh history after new report is created
				const res = await fetch('/api/reports')
				const refreshed = await res.json()
				if (refreshed.success) setReportHistory(refreshed.reports)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleSelectReport = async (id: string | number) => {
		try {
			const response = await fetch(`/api/reports/${id}`)
			const data = await response.json()
			if (data.success && data.report) {
				setCurrentReport(data.report)
				setError(null)
			}
		} catch {
			setError('Failed to load report')
		}
	}

	const handleDeleteReport = async (id: string | number) => {
		try {
			const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' })
			if (response.ok) {
				if (currentReport?._id === id || currentReport?.id === id) {
					setCurrentReport(null)
				}
				const updated = await fetch('/api/reports')
				const data = await updated.json()
				if (data.success) setReportHistory(data.reports)
			}
		} catch {
			setError('Failed to delete report')
		}
	}

	const handleExportMarkdown = () => {
		if (!currentReport) return

		const domain = (() => {
			try {
				const parsed = new URL(currentReport.url)
				return parsed.hostname.replace(/^www\./, '').replace(/[^\w.-]/g, '_')
			} catch {
				return 'unknown-site'
			}
		})()

		const now = new Date()
		const formattedDate = now
			.toISOString()
			.replace('T', '_')
			.replace(/:/g, '-')
			.replace(/\..+/, '_Z')

		const markdown = generateMarkdown(currentReport)
		const blob = new Blob([markdown], { type: 'text/markdown' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `seo-report-${domain}-${formattedDate}.md`
		a.click()
		URL.revokeObjectURL(url)
	}

	const handleExportPDF = async () => {
		await exportToPDF('seo-report-container', currentReport?.url)
	}

	const handleNewSearch = () => {
		setCurrentReport(null)
		setError(null)
		urlInputRef.current?.clearInput()
		window.scrollTo({ top: 0, behavior: 'smooth' })
		setTimeout(() => {
			urlInputRef.current?.focusInput()
		}, 300)
	}

	return (
		<main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-12 text-center">
					<h1 className="text-gray-900 mb-3 text-4xl font-bold">SEO Report Generator</h1>
					<p className="text-gray-600 text-lg">
						AI-powered website analysis to improve your search engine optimization
					</p>
				</div>

				{/* Always visible input form */}
				<div className="mb-8">
					<UrlInputForm ref={urlInputRef} onAnalyze={handleAnalyze} loading={loading} />
				</div>

				{/* Error alert if any */}
				{error && (
					<div className="mb-8">
						<ErrorAlert message={error} onDismiss={() => setError(null)} />
					</div>
				)}

				{/* Current report display */}
				{currentReport && (
					<>
						<ExportButtons
							onExportMarkdown={handleExportMarkdown}
							onExportPDF={handleExportPDF}
							onNewSearch={handleNewSearch}
							className="mb-4"
						/>
						<SeoReport report={currentReport} />
						<ExportButtons
							onExportMarkdown={handleExportMarkdown}
							onExportPDF={handleExportPDF}
							onNewSearch={handleNewSearch}
							className="mt-6"
						/>
					</>
				)}

				{/* Report History */}
				<div className="mx-auto max-w-3xl">
					<ReportHistory
						reports={reportHistory}
						onSelectReport={handleSelectReport}
						onDeleteReport={handleDeleteReport}
						loading={historyLoading}
						activeReportId={currentReport?._id || currentReport?.id || null}
					/>
				</div>

				<footer className="text-gray-500 mt-16 text-center text-sm">
					<p>Built with Next.js, TypeScript, and OpenAI</p>
				</footer>
			</div>
		</main>
	)
}
