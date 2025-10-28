'use client'

import { useEffect, useState, useRef } from 'react'
import ErrorAlert from '@/components/ErrorAlert'
import ReportHistory from '@/components/ReportHistory'
import SeoReport from '@/components/SeoReport'
import UrlInputForm, { UrlInputFormRef } from '@/components/UrlInputForm'
import ExportButtons from '@/components/ExportButtons'
import { generateMarkdown, exportToPDF } from '@/lib/export'

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
  const urlInputRef = useRef<UrlInputFormRef>(null)

  useEffect(() => {
    fetchReportHistory()
  }, [])

  const fetchReportHistory = async () => {
    try {
      setHistoryLoading(true)
      const response = await fetch('/api/reports')
      const data = await response.json()
      if (data.success) setReportHistory(data.reports)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze website')
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
    } catch {
      setError('Failed to load report')
    }
  }

  const handleDeleteReport = async (id: number) => {
    try {
      const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' })
      if (response.ok) {
        if (currentReport?.id === id) setCurrentReport(null)
        await fetchReportHistory()
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

        <div className="mb-8">
          <UrlInputForm ref={urlInputRef} onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {error && (
          <div className="mb-8">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

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
