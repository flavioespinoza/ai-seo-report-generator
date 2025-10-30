import { atom, selector } from 'recoil'
import type { ReportSummary } from '@/types/report'

// All tags extracted from MongoDB reports
export const reportTagsState = atom<string[]>({
	key: 'reportTagsState',
	default: [],
})

// Store all report summaries
export const reportHistoryState = atom<ReportSummary[]>({
	key: 'reportHistoryState',
	default: [],
})

// Selector to generate unique tags dynamically from history
export const derivedReportTagsState = selector<string[]>({
	key: 'derivedReportTagsState',
	get: ({ get }) => {
		const reports = get(reportHistoryState)
		const tags = new Set<string>()
		reports.forEach(r => {
			r.tags?.forEach(t => tags.add(t))
			if (r.businessCategory) tags.add(r.businessCategory)
		})
		return Array.from(tags).sort((a, b) => a.localeCompare(b))
	},
})
