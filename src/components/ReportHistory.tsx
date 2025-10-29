'use client'

import React from 'react'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import type { ReportSummary } from '@/types/report'

interface ReportHistoryProps {
	reports: ReportSummary[]
	onSelectReport: (id: string | number) => Promise<void> | void
	onDeleteReport: (id: string | number) => Promise<void> | void
	loading?: boolean
	activeReportId?: string | number | null
}

export default function ReportHistory({
	reports,
	onSelectReport,
	onDeleteReport,
	loading = false,
	activeReportId
}: ReportHistoryProps) {
	if (loading) {
		return (
			<div className="text-gray-500 rounded-xl bg-white p-4 text-center shadow-lg">
				Loading report history...
			</div>
		)
	}

	if (!reports || reports.length === 0) {
		return <div className="text-gray-500 rounded-xl p-4 text-center">No reports found.</div>
	}

	const handleViewReport = async (id: string | number) => {
		await onSelectReport(id)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<div className="divide-y divide-[#bdbdbd] rounded-xl bg-white shadow-lg">
			{reports.map((report) => {
				const id = report._id || report.id!
				const isActive = activeReportId === id

				return (
					<div
						key={id}
						className={`flex flex-col justify-between gap-3 p-4 transition sm:flex-row sm:items-center sm:gap-4 ${
							isActive ? 'border-l-4 border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
						}`}
					>
						<div className="min-w-0 flex-1">
							<a
								href={report.url.startsWith('http') ? report.url : `https://${report.url}`}
								target="_blank"
								rel="noopener noreferrer"
								className="block truncate text-sm font-medium text-blue-600 hover:underline"
							>
								{report.url}
							</a>
							{report.pageTitle && (
								<p className="text-gray-600 truncate text-xs">{report.pageTitle}</p>
							)}
							<p className="text-gray-400 mt-1 text-xs">
								{new Date(report.createdAt).toLocaleString()}
							</p>
							{report._id && (
								<p className="text-gray-400 mt-1 font-mono text-xs">ID: {report._id}</p>
							)}
						</div>

						<div className="flex flex-shrink-0 items-center gap-3">
							<button
								onClick={() => handleViewReport(id)}
								className="rounded bg-blue-500 px-4 py-1.5 text-sm text-white transition hover:bg-blue-600"
							>
								View Report
							</button>

							<DeleteConfirmDialog onConfirm={() => onDeleteReport(id)} triggerLabel="Delete" />
						</div>
					</div>
				)
			})}
		</div>
	)
}
