'use client'

import { useMemo, useState } from 'react'
import { reportHistoryState, reportTagsState } from '@/state/atoms'
import { getTagColor } from '@/utils/getTagColor'
import { ChevronDown, ChevronUp, Eye, FileDown, FileText, Search, Trash2 } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import ExternalLink from './ExternalLink'

interface ReportHistoryProps {
	onViewReport: (id: string) => void
	onDeleteReport: (id: string) => void
	onExportPDF: (id: string) => void
	onExportMarkdown: (id: string) => void
	loading?: boolean
	isReportView?: boolean
	currentReportId?: string
}

type SortField = 'createdAt' | 'url'
type SortDirection = 'asc' | 'desc'

export default function ReportHistory({
	onViewReport,
	onDeleteReport,
	onExportPDF,
	onExportMarkdown,
	loading = false,
	isReportView = false,
	currentReportId
}: ReportHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [sortField, setSortField] = useState<SortField>('createdAt')
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
	const [showFilters, setShowFilters] = useState(true)

	const reports = useRecoilValue(reportHistoryState)
	const globalTags = useRecoilValue(reportTagsState)

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
	}

	const clearFilters = () => {
		setSelectedTags([])
		setSearchQuery('')
	}

	const filteredReports = useMemo(() => {
		let filtered = [...reports]

		if (searchQuery) {
			const q = searchQuery.toLowerCase()
			filtered = filtered.filter(
				(r) =>
					r.url.toLowerCase().includes(q) ||
					r.pageTitle?.toLowerCase().includes(q) ||
					r.tags?.some((t) => t.toLowerCase().includes(q)) ||
					r.businessCategory?.toLowerCase().includes(q)
			)
		}

		if (selectedTags.length > 0) {
			filtered = filtered.filter((r) =>
				selectedTags.every((tag) => r.tags?.includes(tag) || r.businessCategory === tag)
			)
		}

		filtered.sort((a, b) => {
			if (sortField === 'createdAt') {
				const aVal = new Date(a.createdAt).getTime()
				const bVal = new Date(b.createdAt).getTime()
				return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
			}
			return sortDirection === 'asc' ? a.url.localeCompare(b.url) : b.url.localeCompare(a.url)
		})

		return filtered
	}, [reports, searchQuery, selectedTags, sortField, sortDirection])

	const SortIcon = sortDirection === 'asc' ? ChevronUp : ChevronDown

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
			</div>
		)
	}

	return (
		<div className={`flex ${isReportView ? 'flex-col' : 'flex-col lg:flex-row'} gap-6`}>
			{/* Sidebar Filters */}
			{!isReportView && (
				<aside className="w-full flex-shrink-0 lg:w-[320px] xl:w-[340px]">
					<div className="card p-4">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold">Filters</h2>
							{(selectedTags.length > 0 || searchQuery) && (
								<button onClick={clearFilters} className="btn-primary py-2 text-[11px]">
									Clear All
								</button>
							)}
						</div>

						<div className="space-y-3">
							<button
								onClick={() => setShowFilters(!showFilters)}
								className="btn-outline flex w-full items-center justify-between"
							>
								<span>Tags</span>
								{showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
							</button>

							{showFilters && (
								<div className="max-h-96 space-y-2 overflow-y-auto">
									{globalTags.length === 0 ? (
										<p className="px-2 text-sm italic text-gray-400">No tags yet...</p>
									) : (
										globalTags.map((tag) => {
											const colorClass = getFilterDotColor(tag)
											const isSelected = selectedTags.includes(tag)

											return (
												<label
													key={tag}
													className={`flex cursor-pointer items-center justify-between rounded p-2 text-xs transition-colors ${
														isSelected ? 'active-filter' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
													}`}
												>
													<div className="flex items-center gap-2">
														<input
															type="checkbox"
															checked={isSelected}
															onChange={() => toggleTag(tag)}
															className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
														/>
														<span className="text-gray-700 dark:text-gray-300">{tag}</span>
													</div>
													<span className={`filter-dot ${colorClass}`} />
												</label>
											)
										})
									)}
								</div>
							)}
						</div>
					</div>
				</aside>
			)}

			{/* Main Report Table */}
			<div className="min-w-0 flex-1">
				{/* Search */}
				<div className="mb-4 flex items-center gap-2">
					<div className="relative flex-1">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
							size={20}
						/>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search reports..."
							className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Table */}
				{filteredReports.length === 0 ? (
					<div className="card p-8 text-center text-gray-500">No reports found.</div>
				) : (
					<div className="rounded-lg bg-white shadow-md">
						<div className="overflow-x-auto">
							<table className="min-w-full table-fixed">
								<thead>
									<tr>
										<th
											className="w-[60%] cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
											onClick={() => setSortField('url')}
										>
											<div className="flex items-center gap-1 hover:text-blue-600">
												Report
												{sortField === 'url' && <SortIcon size={14} />}
											</div>
										</th>
										<th
											className="w-[20%] cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
											onClick={() => setSortField('createdAt')}
										>
											<div className="flex items-center gap-1 hover:text-blue-600">
												Created
												{sortField === 'createdAt' && <SortIcon size={14} />}
											</div>
										</th>
										<th className="w-[20%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
											Actions
										</th>
									</tr>
								</thead>

								<tbody className="divide-y divide-gray-200">
									{filteredReports.map((r) => {
										const id = r._id || ''
										const active = id === currentReportId

										return (
											<tr
												key={id}
												className={`hover:bg-gray-50 dark:hover:bg-zinc-800 ${
													active ? 'bg-blue-50 dark:bg-blue-900/20' : ''
												}`}
											>
												{/* 🧱 Report Column */}
												<td className="px-4 py-3 align-top">
													<div className="flex flex-col gap-1">
														<ExternalLink
															href={r.url}
															target="_blank"
															className="truncate text-sm font-medium text-blue-600 hover:text-blue-800"
														>
															{r.url}
														</ExternalLink>
														<div className="line-clamp-2 text-xs text-gray-500">
															{r.pageTitle || '(No title)'}
														</div>
														<div className="mt-2 flex flex-wrap gap-1">
															{r.tags?.map((tag) => (
																<span
																	key={tag}
																	className={`inline-block rounded border px-2 py-1 text-[11px] font-semibold ${getTagColor(
																		tag
																	)}`}
																>
																	{tag}
																</span>
															))}
															{r.businessCategory && (
																<span
																	className={`inline-block rounded border px-2 py-1 text-[11px] font-semibold ${getTagColor(
																		r.businessCategory
																	)}`}
																>
																	{r.businessCategory}
																</span>
															)}
														</div>
													</div>
												</td>

												{/* 🗓️ Created Column */}
												<td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
													{new Date(r.createdAt).toLocaleDateString()}
												</td>

												{/* ⚙️ Actions Column */}
												<td className="px-4 py-3 text-right">
													<div className="mt-6 flex flex-wrap justify-end gap-2">
														<div className="tooltip">
															<button
																type="button"
																className="btn-icon text-red-600"
																onClick={() => onDeleteReport(id)}
															>
																<Trash2 size={18} />
															</button>
															<span className="tooltip-text">Delete Report</span>
														</div>

														<div className="tooltip">
															<button
																type="button"
																onClick={() => {
																	onViewReport(id)
																	setTimeout(() => onExportPDF(id), 400)
																}}
																className="btn-icon text-gray-600"
															>
																<FileDown size={18} />
															</button>
															<span className="tooltip-text">Download PDF</span>
														</div>

														<div className="tooltip">
															<button
																type="button"
																onClick={() => {
																	onViewReport(id)
																	setTimeout(() => onExportMarkdown(id), 400)
																}}
																className="btn-icon text-gray-600"
															>
																<FileText size={18} />
															</button>
															<span className="tooltip-text">Download Markdown</span>
														</div>

														<div className="tooltip">
															<button
																type="button"
																onClick={() => onViewReport(id)}
																className="btn-icon text-blue-600"
															>
																<Eye size={18} />
															</button>
															<span className="tooltip-text">View Report</span>
														</div>
													</div>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

/* ---------------------------------
   Helper: match tag keyword to .filter-dot-* class
----------------------------------- */
function getFilterDotColor(tag: string): string {
	const lower = tag.toLowerCase()

	if (lower.includes('error') || lower.includes('missing') || lower.includes('duplicate'))
		return 'filter-dot-red'
	if (lower.includes('improve') || lower.includes('slow') || lower.includes('warning'))
		return 'filter-dot-orange'
	if (lower.includes('optimized') || lower.includes('good') || lower.includes('valid'))
		return 'filter-dot-green'
	if (lower.includes('meta') || lower.includes('title') || lower.includes('schema'))
		return 'filter-dot-blue'
	if (lower.includes('accessibility') || lower.includes('contrast') || lower.includes('aria'))
		return 'filter-dot-purple'
	if (lower.includes('ecommerce') || lower.includes('agency') || lower.includes('blog'))
		return 'filter-dot-yellow'
	if (lower.includes('performance') || lower.includes('speed') || lower.includes('load'))
		return 'filter-dot-amber'
	if (lower.includes('link') || lower.includes('backlink') || lower.includes('anchor'))
		return 'filter-dot-cyan'
	if (lower.includes('content') || lower.includes('readability')) return 'filter-dot-slate'
	return 'filter-dot-gray'
}
