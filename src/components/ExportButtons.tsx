// src/components/ExportButtons.tsx
import React from 'react'

interface ExportButtonsProps {
  onExportMarkdown: () => void
  onExportPDF: () => void
  onNewSearch: () => void
  className?: string
}

export default function ExportButtons({
  onExportMarkdown,
  onExportPDF,
  onNewSearch,
  className = ''
}: ExportButtonsProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between mb-8 gap-3 ${className}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onExportMarkdown}
          className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Export as Markdown
        </button>
        <button
          onClick={onExportPDF}
          className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Export as PDF
        </button>
      </div>

      <div className="flex justify-end flex-1 sm:flex-none">
        <button
          onClick={onNewSearch}
          className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          New Search
        </button>
      </div>
    </div>
  )
}
