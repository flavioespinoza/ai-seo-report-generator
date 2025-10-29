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
		<div className={`mb-8 flex flex-wrap items-center justify-between gap-3 ${className}`}>
			<div className="flex items-center gap-3">
				<button
					onClick={onExportMarkdown}
					className="rounded-lg bg-blue-400 px-4 py-2 text-white transition hover:bg-blue-700"
				>
					Export as Markdown
				</button>
				<button
					onClick={onExportPDF}
					className="rounded-lg bg-red-400 px-4 py-2 text-white transition hover:bg-red-700"
				>
					Export as PDF
				</button>
			</div>

			<div className="flex flex-1 justify-end sm:flex-none">
				<button
					onClick={onNewSearch}
					className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 rounded-lg border px-4 py-2 transition"
				>
					New Search
				</button>
			</div>
		</div>
	)
}
