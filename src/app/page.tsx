'use client'

import { useRef, useState } from 'react'
import AnalyzeLoadingModal from '@/components/AnalyzeLoadingModal'
import AuthButton from '@/components/AuthButton'
import ErrorAlert from '@/components/ErrorAlert'
import ReportHistory from '@/components/ReportHistory'
import SeoReport from '@/components/SeoReport'
import UrlInputForm, { UrlInputFormRef } from '@/components/UrlInputForm'
import { exportToPDF, generateMarkdown } from '@/lib/export'
import { reportHistoryState, reportTagsState } from '@/state/atoms'
import type { Report, ReportSummary } from '@/types/report'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useSetRecoilState } from 'recoil'

/**
 * The main page component for the application.
 * It manages the application's state, including loading status, errors, the current report,
 * and the report history. It also handles the logic for analyzing URLs, viewing, deleting,
 * and exporting reports.
 *
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
	const [currentReport, setCurrentReport] = useState<Report | null>(null)
	const urlInputRef = useRef<UrlInputFormRef>(null)
	const { data: session } = useSession()
	const queryClient = useQueryClient()

	// Recoil setters
	const setReportHistory = useSetRecoilState(reportHistoryState)
	const setReportTags = useSetRecoilState(reportTagsState)

	const {
		data: reports,
		isLoading: historyLoading,
		error,
		refetch
	} = useQuery<ReportSummary[]>({
		queryKey: ['reports'],
		queryFn: async () => {
			const response = await fetch('/api/reports')
			if (!response.ok) {
				throw new Error('Failed to load reports')
			}
			const data = await response.json()
			return data.reports
		},
		enabled: !!session,
		onSuccess: (data) => {
			setReportHistory(data)
			setReportTags(extractTags(data))
		}
	})

	const extractTags = (reports: ReportSummary[]): string[] => {
		const tags = new Set<string>()
		reports.forEach((r) => {
			r.tags?.forEach((t) => tags.add(t))
			if (r.businessCategory) tags.add(r.businessCategory)
		})
		return Array.from(tags)
	}

	const { mutate: analyzeWebsite, isLoading: loading } = useMutation<
		Report,
		Error,
		string
	>({
		mutationFn: async (url: string) => {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			})
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || 'Failed to analyze website')
			}
			return data.report
		},
		onSuccess: (data) => {
			setCurrentReport(data)
			queryClient.invalidateQueries(['reports'])
		}
	})

	const handleAnalyze = (url: string) => {
		setCurrentReport(null)
		analyzeWebsite(url)
	}

	const { mutate: viewReport } = useMutation<Report, Error, string>({
		mutationFn: async (id: string) => {
			const response = await fetch(`/api/reports/${id}`)
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || 'Failed to load report')
			}
			return data.report
		},
		onSuccess: (data) => {
			setCurrentReport(data)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	})

	const { mutate: deleteReport } = useMutation<void, Error, string>({
		mutationFn: async (id: string) => {
			const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' })
			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Failed to delete report')
			}
		},
		onSuccess: () => {
			if (currentReport) {
				setCurrentReport(null)
			}
			queryClient.invalidateQueries(['reports'])
		}
	})

	const handleViewReport = (id: string) => viewReport(id)
	const handleDeleteReport = (id: string) => deleteReport(id)

	const handleExportPDF = async (id?: string) => {
		try {
			let reportToExport = currentReport
			if (id && (!currentReport || currentReport._id !== id)) {
				reportToExport = await queryClient.fetchQuery({
					queryKey: ['reports', id],
					queryFn: () => viewReport(id)
				})
			}
			if (reportToExport) {
				await exportToPDF('seo-report-content', reportToExport.url)
			}
		} catch (error) {
			console.error('Failed to export PDF:', error)
		}
	}

	const handleExportMarkdown = async (id?: string) => {
		try {
			let reportToExport = currentReport
			if (id && (!currentReport || currentReport._id !== id)) {
				reportToExport = await queryClient.fetchQuery({
					queryKey: ['reports', id],
					queryFn: () => viewReport(id)
				})
			}

			if (reportToExport) {
				const markdown = generateMarkdown({
					url: reportToExport.url,
					metadata: {
						pageTitle: reportToExport.metadata.pageTitle ?? null,
						metaDescription: reportToExport.metadata.metaDescription ?? null,
						metaKeywords: reportToExport.metadata.metaKeywords
							? reportToExport.metadata.metaKeywords.join(', ')
							: null,
						h1Tags: reportToExport.metadata.h1Tags ?? [],
						imageCount: reportToExport.metadata.imageCount ?? 0,
						hasFavicon: reportToExport.metadata.hasFavicon ?? false
					},
					aiFeedback:
						typeof reportToExport.aiFeedback === 'string'
							? reportToExport.aiFeedback
							: JSON.stringify(reportToExport.aiFeedback, null, 2),
					createdAt:
						typeof reportToExport.createdAt === 'string'
							? reportToExport.createdAt
							: reportToExport.createdAt?.toISOString()
				})

				// --- FIXED FILE NAMING ---
				const now = new Date()
				const formattedDate = now
					.toISOString()
					.replace('T', '_')
					.replace(/:/g, '-')
					.replace(/\..+/, '_Z')

				const cleanDomain = (() => {
					try {
						const parsed = new URL(reportToExport.url)
						return parsed.hostname.replace(/^www\./, '').replace(/[^\w.-]/g, '_')
					} catch {
						return reportToExport.url.replace(/https?:\/\//, '').replace(/[^\w.-]/g, '_')
					}
				})()

				const blob = new Blob([markdown], { type: 'text/markdown' })
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.href = url
				a.download = `seo-report-${cleanDomain}-${formattedDate}.md`
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				URL.revokeObjectURL(url)
			}
		} catch (error) {
			console.error('Failed to export Markdown:', error)
		}
	}

	const handleBackToList = () => {
		setCurrentReport(null)
		queryClient.setQueryData(['reports'], (oldData: any) => oldData)
		window.scrollTo({ top: 0, behavior: 'smooth' })
		urlInputRef.current?.focusInput()
	}

	return (
		<div className="flex min-h-screen flex-col bg-gray-100">
			{/* Header */}
			<header className="py-8 text-center md:py-12">
				<div className="mb-4 flex items-center justify-end px-4 sm:px-6 lg:px-8">
					<AuthButton />
				</div>
				<h1 className="mb-3 text-3xl font-bold md:mb-4 md:text-4xl lg:text-5xl">
					SEO Report Generator
				</h1>
				<p className="text-base text-gray-700 md:text-lg">
					AI-powered website analysis to improve your search engine optimization
				</p>
			</header>

			{/* ✅ Main Content */}
			<main className="mx-auto w-full max-w-[1360px] flex-1 space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
				{/* URL Input */}
				<div className="mt-4">
					<UrlInputForm ref={urlInputRef} onAnalyze={handleAnalyze} loading={loading} />
				</div>

				{/* Modal (stays open while analyzing) */}
				<AnalyzeLoadingModal open={loading} />

				{/* Error */}
				{error && (
					<div>
						<ErrorAlert
							message={error.message}
							onDismiss={() => queryClient.setQueryData(['reports'], {})}
						/>
					</div>
				)}

				{/* Views */}
				{currentReport ? (
					<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px,1fr]">
						<aside className="min-w-0">
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
						<div className="min-w-0">
							<SeoReport
								report={currentReport}
								onExportPDF={() => handleExportPDF()}
								onExportMarkdown={() => handleExportMarkdown()}
								onBackToList={handleBackToList}
							/>
						</div>
					</div>
				) : (
					<div className="min-w-0">
						<ReportHistory
							onViewReport={handleViewReport}
							onDeleteReport={handleDeleteReport}
							onExportPDF={handleExportPDF}
							onExportMarkdown={handleExportMarkdown}
							loading={historyLoading}
							isReportView={false}
						/>
					</div>
				)}
			</main>

			<footer className="mt-auto border-t border-gray-200 py-10 text-center text-sm text-gray-600">
				Built with Next.js, TypeScript, and OpenAI
			</footer>
		</div>
	)
}
