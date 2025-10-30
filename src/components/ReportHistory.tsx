'use client'

import { useState, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { reportHistoryState, reportTagsState } from '@/state/atoms'
import {
	Trash2, FileDown, FileText, Eye, Search, ChevronDown, ChevronUp
} from 'lucide-react'
import ExternalLink from './ExternalLink'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { getTagColor } from '@/utils/getTagColor'

interface ReportHistoryProps {
	onViewReport: (id: string) => void
	onDeleteReport: (id: string) => void
	onExportPDF: (id: string) => void
	onExportMarkdown: (id: string) => void
	loading?: boolean
	isReportView?: boolean
}

type SortField = 'createdAt' | 'url'
type SortDirection = 'asc' | 'desc'

export default function ReportHistory({
	onViewReport,
	onDeleteReport,
	onExportPDF,
	onExportMarkdown,
	loading = false,
	isReportView = false
}: ReportHistoryProps) {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [sortField, setSortField] = useState<SortField>('createdAt')
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
	const [showFilters, setShowFilters] = useState(true)

	const reports = useRecoilValue(reportHistoryState)
	const globalTags = useRecoilValue(reportTagsState)

	const toggleTag = (tag: string) => {
		setSelectedTags(prev =>
			prev.includes(tag)
				? prev.filter(t => t !== tag)
				: [...prev, tag]
		)
	}

	const clearFilters = () => {
		setSelectedTags([])
		setSearchQuery('')
	}

	const filteredReports = useMemo(() => {
		let filtered = [...reports]

		if (searchQuery) {
			const q = searchQuery.toLowerCase()
			filtered = filtered.filter(r =>
				r.url.toLowerCase().includes(q) ||
				r.pageTitle?.toLowerCase().includes(q) ||
				r.tags?.some(t => t.toLowerCase().includes(q)) ||
				r.businessCategory?.toLowerCase().includes(q)
			)
		}

		if (selectedTags.length > 0) {
			filtered = filtered.filter(r =>
				selectedTags.every(tag =>
					r.tags?.includes(tag) || r.businessCategory === tag
				)
			)
		}

		filtered.sort((a, b) => {
			if (sortField === 'createdAt') {
				const aVal = new Date(a.createdAt).getTime()
				const bVal = new Date(b.createdAt).getTime()
				return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
			}
			return sortDirection === 'asc'
				? a.url.localeCompare(b.url)
				: b.url.localeCompare(a.url)
		})

		return filtered
	}, [reports, searchQuery, selectedTags, sortField, sortDirection])

	const SortIcon = sortDirection === 'asc' ? ChevronUp : ChevronDown

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		)
	}

	return (
		<div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
			<div className={`flex ${isReportView ? 'flex-col' : 'flex-col md:flex-row'} gap-6`}>
				
				{/* 🧩 Filters Sidebar */}
				{!isReportView && (
					<aside className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 space-y-4">
						<div className="bg-white rounded-lg shadow-md p-4 w-full">
							<div className="flex items-center justify-between mb-4">
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
									className="flex items-center justify-between w-full text-sm font-semibold text-gray-700"
								>
									<span>Tags</span>
									{showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
								</button>

								{showFilters && (
									<div className="space-y-2 max-h-96 overflow-y-auto">
										{globalTags.length === 0 ? (
											<p className="text-gray-400 text-sm italic px-2">No tags yet...</p>
										) : (
											globalTags.map(tag => {
												const colorClass = getTagColor(tag)
												const bgClass = colorClass.split(' ')[0]
												return (
													<label
														key={tag}
														className="flex items-center justify-between text-xs cursor-pointer hover:bg-gray-50 p-2 rounded"
													>
														<div className="flex items-center gap-2">
															<input
																type="checkbox"
																checked={selectedTags.includes(tag)}
																onChange={() => toggleTag(tag)}
																className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
															/>
															<span className="text-gray-700">{tag}</span>
														</div>
														<span className={`w-3 h-3 rounded-full border border-gray-200 ${bgClass}`} />
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

				{/* 📋 Report List */}
				<div className="flex-1 min-w-0">
					<div className="mb-4 flex items-center gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
							<input
								type="text"
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								placeholder="Search reports..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					{filteredReports.length === 0 ? (
						<div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
							No reports found.
						</div>
					) : (
						<div className="bg-white rounded-lg shadow-md overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full min-w-full">
									<thead className="bg-gray-50 border-b border-gray-200">
										<tr>
											<th
												className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
												onClick={() => setSortField('url')}
											>
												<div className="flex items-center gap-1">
													Report
													{sortField === 'url' && <SortIcon size={14} />}
												</div>
											</th>
											<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
												onClick={() => setSortField('createdAt')}>
												<div className="flex items-center gap-1">
													Created
													{sortField === 'createdAt' && <SortIcon size={14} />}
												</div>
											</th>
											<th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredReports.map(report => {
											const id = report._id || report.id?.toString() || ''
											return (
												<tr key={id} className="hover:bg-gray-50">
													<td className="px-4 py-3">
														<div>
															<ExternalLink
																href={report.url}
																target="_blank"
																className="text-blue-600 hover:text-blue-800 font-medium text-sm"
															>
																{report.url}
															</ExternalLink>
															<div className="text-xs text-gray-500 mt-1 truncate">
																{report.pageTitle || '(No title)'}
															</div>

															{/* 🏷️ Inline tags */}
															<div className="flex flex-wrap gap-1 mt-2">
																{report.tags?.map(tag => (
																	<span
																		key={tag}
																		className={`inline-block px-2 py-1 text-[11px] font-semibold rounded border ${getTagColor(tag)}`}
																	>
																		{tag}
																	</span>
																))}
																{report.businessCategory && (
																	<span
																		className={`inline-block px-2 py-1 text-[11px] font-semibold rounded border ${getTagColor(report.businessCategory)}`}
																	>
																		{report.businessCategory}
																	</span>
																)}
															</div>
														</div>
													</td>
													<td className="px-4 py-3 text-sm text-gray-600">
														{new Date(report.createdAt).toLocaleDateString()}
													</td>
													<td className="px-4 py-3 text-right">
														<div className="flex justify-end gap-2">
															<DeleteConfirmDialog
																onConfirm={() => onDeleteReport(id)}
																trigger={<button className="p-2 rounded hover:bg-gray-100 text-red-600"><Trash2 size={18} /></button>}
															/>
															<button onClick={() => onExportPDF(id)} className="p-2 rounded hover:bg-gray-100 text-gray-600"><FileDown size={18} /></button>
															<button onClick={() => onExportMarkdown(id)} className="p-2 rounded hover:bg-gray-100 text-gray-600"><FileText size={18} /></button>
															<button onClick={() => onViewReport(id)} className="p-2 rounded hover:bg-gray-100 text-blue-600"><Eye size={18} /></button>
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
		</div>
	)
}
