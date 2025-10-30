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
	currentReportId?: string // ✅ FIX: added missing prop
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
				<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
			</div>
		)
	}

	return (
		<div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
			<div className={`flex ${isReportView ? 'flex-col' : 'flex-col md:flex-row'} gap-6`}>
				{/* Sidebar Filters */}
				{!isReportView && (
					<aside className="w-full flex-shrink-0 space-y-4 md:w-[320px] lg:w-[360px]">
						<div className="w-full rounded-lg bg-white p-4 shadow-md">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-lg font-bold">Filters</h2>
								{(selectedTags.length > 0 || searchQuery) && (
									<button
										onClick={clearFilters}
										className="text-sm text-blue-600 hover:text-blue-700"
									>
										Clear All
									</button>
								)}
							</div>

							{/* Tag Filters */}
							<div className="space-y-3">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className="text-gray-700 flex w-full items-center justify-between text-sm font-semibold"
								>
									<span>Tags</span>
									{showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
								</button>

								{showFilters && (
									<div className="max-h-96 space-y-2 overflow-y-auto">
										{globalTags.length === 0 ? (
											<p className="text-gray-400 px-2 text-sm italic">No tags yet...</p>
										) : (
											globalTags.map((tag) => {
												const colorClass = getTagColor(tag)
												const bgClass = colorClass.split(' ')[0]
												return (
													<label
														key={tag}
														className="hover:bg-gray-50 flex cursor-pointer items-center justify-between rounded p-2 text-xs"
													>
														<div className="flex items-center gap-2">
															<input
																type="checkbox"
																checked={selectedTags.includes(tag)}
																onChange={() => toggleTag(tag)}
																className="border-gray-300 rounded text-blue-600 focus:ring-blue-500"
															/>
															<span className="text-gray-700">{tag}</span>
														</div>
														<span
															className={`border-gray-200 h-3 w-3 rounded-full border ${bgClass}`}
														/>
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

				{/* Report List */}
				<div className="min-w-0 flex-1">
					<div className="mb-4 flex items-center gap-2">
						<div className="relative flex-1">
							<Search
								className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 transform"
								size={20}
							/>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search reports..."
								className="border-gray-300 w-full rounded-lg border py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					{filteredReports.length === 0 ? (
						<div className="text-gray-500 rounded-lg bg-white p-8 text-center shadow-md">
							No reports found.
						</div>
					) : (
						<div className="overflow-hidden rounded-lg bg-white shadow-md">
							<div className="overflow-x-auto">
								<table className="w-full min-w-full">
									<thead className="bg-gray-50 border-gray-200 border-b">
										<tr>
											<th
												className="text-gray-700 hover:bg-gray-100 cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
												onClick={() => setSortField('url')}
											>
												<div className="flex items-center gap-1">
													Report
													{sortField === 'url' && <SortIcon size={14} />}
												</div>
											</th>
											{!isReportView && (
												<>
													<th
														className="text-gray-700 hover:bg-gray-100 cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
														onClick={() => setSortField('createdAt')}
													>
														<div className="flex items-center gap-1">
															Created
															{sortField === 'createdAt' && <SortIcon size={14} />}
														</div>
													</th>
													<th className="text-gray-700 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
														Actions
													</th>
												</>
											)}
										</tr>
									</thead>
									<tbody className="divide-gray-200 divide-y">
										{filteredReports.map((report) => {
											const id = report._id || ''
											const isActive = id === currentReportId
											return (
												<tr key={id} className={`hover:bg-gray-50 ${isActive ? 'bg-blue-50' : ''}`}>
													<td className="px-4 py-3">
														<div>
															<ExternalLink
																href={report.url}
																target="_blank"
																className="text-sm font-medium text-blue-600 hover:text-blue-800"
															>
																{report.url}
															</ExternalLink>
															<div className="text-gray-500 mt-1 truncate text-xs">
																{report.pageTitle || '(No title)'}
															</div>

															{/* Tags */}
															<div className="mt-2 flex flex-wrap gap-1">
																{report.tags?.map((tag) => (
																	<span
																		key={tag}
																		className={`inline-block rounded border px-2 py-1 text-[11px] font-semibold ${getTagColor(tag)}`}
																	>
																		{tag}
																	</span>
																))}
																{report.businessCategory && (
																	<span
																		className={`inline-block rounded border px-2 py-1 text-[11px] font-semibold ${getTagColor(report.businessCategory)}`}
																	>
																		{report.businessCategory}
																	</span>
																)}
															</div>
														</div>
													</td>

													{!isReportView && (
														<>
															<td className="text-gray-600 px-4 py-3 text-sm">
																{new Date(report.createdAt).toLocaleDateString()}
															</td>
															<td className="px-4 py-3 text-right">
																<div className="flex justify-end gap-2">
																	<DeleteConfirmDialog
																		onConfirm={() => onDeleteReport(id)}
																		trigger={
																			<button className="hover:bg-gray-100 rounded p-2 text-red-600">
																				<Trash2 size={18} />
																			</button>
																		}
																	/>
																	<button
																		onClick={() => onExportPDF(id)}
																		className="hover:bg-gray-100 text-gray-600 rounded p-2"
																	>
																		<FileDown size={18} />
																	</button>
																	<button
																		onClick={() => onExportMarkdown(id)}
																		className="hover:bg-gray-100 text-gray-600 rounded p-2"
																	>
																		<FileText size={18} />
																	</button>
																	<button
																		onClick={() => onViewReport(id)}
																		className="hover:bg-gray-100 rounded p-2 text-blue-600"
																	>
																		<Eye size={18} />
																	</button>
																</div>
															</td>
														</>
													)}
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
		</div>
	)
}
