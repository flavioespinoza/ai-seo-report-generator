'use client'

import { useEffect, useState } from 'react'
import ErrorAlert from '@/components/ErrorAlert'
import ReportHistory from '@/components/ReportHistory'
import SeoReport from '@/components/SeoReport'
import UrlInputForm from '@/components/UrlInputForm'
import MarkdownWithCode from '@/components/markdown-with-code'

interface Report {
	id?: number
	url: string
	metadata: {
		pageTitle: string | null
		metaDescription: string | null
		metaKeywords: string | null
		h1Tags: string[]
		imageCount: number
		hasFavicon: boolean
		titleLength?: number
		descriptionLength?: number
	}
	aiFeedback: string
	createdAt?: string
}

interface ReportSummary {
	id: number
	url: string
	pageTitle: string | null
	metaDescription: string | null
	createdAt: string
	hasIssues: boolean
}

export default function Home() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentReport, setCurrentReport] = useState<Report | null>(null)
	const [reportHistory, setReportHistory] = useState<ReportSummary[]>([])
	const [historyLoading, setHistoryLoading] = useState(true)

	useEffect(() => {
		fetchReportHistory()
	}, [])

	const fetchReportHistory = async () => {
		try {
			setHistoryLoading(true)
			const response = await fetch('/api/reports')
			const data = await response.json()

			if (data.success) {
				setReportHistory(data.reports)
			}
		} catch (err) {
			console.error('Failed to fetch report history:', err)
		} finally {
			setHistoryLoading(false)
		}
	}

	const handleAnalyze = async (url: string) => {
		setLoading(true)
		setError(null)
		setCurrentReport(null)

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url })
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to analyze website')
			}

			if (data.success && data.report) {
				setCurrentReport(data.report)
				await fetchReportHistory()
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleSelectReport = async (id: number) => {
		try {
			const response = await fetch(`/api/reports/${id}`)
			const data = await response.json()

			if (data.success && data.report) {
				setCurrentReport(data.report)
				setError(null)
			}
		} catch (err) {
			setError('Failed to load report')
		}
	}

	const handleDeleteReport = async (id: number) => {
		try {
			const response = await fetch(`/api/reports/${id}`, {
				method: 'DELETE'
			})

			if (response.ok) {
				if (currentReport?.id === id) {
					setCurrentReport(null)
				}
				await fetchReportHistory()
			}
		} catch (err) {
			setError('Failed to delete report')
		}
	}

	const handleExportReport = () => {
		if (!currentReport) return

		return generateHTMLReport(currentReport)
		// const blob = new Blob([markdown], { type: 'text/markdown' })
		// const url = URL.createObjectURL(blob)
		// const a = document.createElement('a')
		// a.href = url
		// a.download = `seo-report-${Date.now()}.md`
		// document.body.appendChild(a)
		// a.click()
		// document.body.removeChild(a)
		// URL.revokeObjectURL(url)
	}

	// Define the structure of the report
	const generateHTMLReport = (report: Report) => {
		const { metadata, aiFeedback, url, createdAt } = report

		if (typeof report === 'string') {
			return <div style={{ background: 'hotpink'}}>
				<MarkdownWithCode markdown={report} />
			</div>
		} else {
			return 'Something went wrong with the report.'
		}
	}

	return (
		<main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<h1 className="text-gray-900 mb-3 text-4xl font-bold">SEO Report Generator</h1>
					<p className="text-gray-600 text-lg">
						AI-powered website analysis to improve your search engine optimization
					</p>
				</div>

				<div className="mb-8">
					<UrlInputForm onAnalyze={handleAnalyze} loading={loading} />
				</div>

				{error && (
					<div className="mb-8">
						<ErrorAlert message={error} onDismiss={() => setError(null)} />
					</div>
				)}

				{currentReport && (
					<div className="mb-8">
						<SeoReport report={currentReport} onExport={handleExportReport} />
					</div>
				)}

				<div className="mx-auto max-w-3xl">
					<ReportHistory
						reports={reportHistory}
						onSelectReport={handleSelectReport}
						onDeleteReport={handleDeleteReport}
						loading={historyLoading}
					/>
				</div>

				<footer className="text-gray-500 mt-16 text-center text-sm">
					<p>Built with Next.js, TypeScript, and OpenAI</p>
				</footer>
			</div>
		</main>
	)
}
