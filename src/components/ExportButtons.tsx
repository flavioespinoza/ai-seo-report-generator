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
					className='btn-primary'
				>
					Export as Markdown
				</button>
				<button
					onClick={onExportPDF}
					className='btn-danger'
				>
					Export as PDF
				</button>
			</div>

			<div className="flex flex-1 justify-end sm:flex-none">
				<button
					onClick={onNewSearch}
					className='btn-outline'
				>
					New Search
				</button>
			</div>
		</div>
	)
}
