import React from 'react';

interface ReportSummary {
  id: number;
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  hasIssues: boolean;
}

interface ReportHistoryProps {
  reports: ReportSummary[];
  onSelectReport: (id: number) => void;
  onDeleteReport: (id: number) => void;
  loading?: boolean;
}

export default function ReportHistory({
  reports,
  onSelectReport,
  onDeleteReport,
  loading = false,
}: ReportHistoryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Report History</h3>
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Report History</h3>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No reports yet</p>
          <p className="text-sm mt-1">Analyze a website to create your first report</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Report History
        <span className="ml-2 text-sm font-normal text-gray-500">
          ({reports.length} {reports.length === 1 ? 'report' : 'reports'})
        </span>
      </h3>
      <div className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition group"
          >
            <div className="flex justify-between items-start gap-4">
              <button
                onClick={() => onSelectReport(report.id)}
                className="flex-1 text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                    {report.pageTitle || 'Untitled Page'}
                  </h4>
                  {report.hasIssues && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Issues Found
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{report.url}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this report?')) {
                    onDeleteReport(report.id);
                  }
                }}
                className="text-gray-400 hover:text-red-600 transition p-1"
                title="Delete report"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
