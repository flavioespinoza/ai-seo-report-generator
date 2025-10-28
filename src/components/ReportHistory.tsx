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
      <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        Loading report history...
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        No reports found.
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm">
      {reports.map((report) => {
        const id = report._id || report.id!
        const isActive = activeReportId === id

        return (
          <div
            key={id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 cursor-pointer transition ${
              isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectReport(id)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{report.url}</p>
              {report.pageTitle && (
                <p className="text-xs text-gray-600 truncate">{report.pageTitle}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(report.createdAt).toLocaleString()}
              </p>
              {report._id && (
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: {report._id}</p>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-3">
              <span
                className={`text-xs font-medium ${
                  report.hasIssues ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {report.hasIssues ? 'Issues found' : 'No issues'}
              </span>

              <DeleteConfirmDialog
                onConfirm={() => onDeleteReport(id)}
                triggerLabel="Delete"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
