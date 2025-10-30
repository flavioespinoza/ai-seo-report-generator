export interface Metadata {
	pageTitle: string | null
	metaDescription: string | null
	metaKeywords: string | null
	h1Tags: string[]
	imageCount: number
	hasFavicon: boolean
	titleLength?: number
	descriptionLength?: number
}

export interface Report {
	_id?: string
	url: string
	pageTitle?: string
	metadata: {
		pageTitle?: string
		metaDescription?: string
		metaKeywords?: string[]
		h1Tags?: string[]
		imageCount?: number
		hasFavicon?: boolean
		titleLength?: number
		descriptionLength?: number
	}
	aiFeedback?: string | object
	createdAt: Date
	lastModified: Date
	hasIssues: boolean
	tags: string[]
	businessCategory?: string | null
}

export interface ReportSummary {
	_id?: string
	id?: string | number
	url: string
	pageTitle: string | null
	metaDescription: string | null
	createdAt: string
	lastModified?: string
	hasIssues: boolean
	tags?: string[]
	businessCategory?: string
}

interface ReportHistoryProps {
	onViewReport: (id: string) => void
	onDeleteReport: (id: string) => void
	onExportPDF: (id: string) => void
	onExportMarkdown: (id: string) => void
	loading?: boolean
	isReportView?: boolean
	currentReportId?: string // ✅ add this
}

// Tag categories for filtering
export const SEO_STATUS_TAGS = [
	'Optimized',
	'Needs Improvement',
	'Critical Issues',
	'Newly Analyzed'
] as const

export const TECHNICAL_SEO_TAGS = [
	'Missing Meta Description',
	'Missing Title Tag',
	'No H1 Tag',
	'Multiple H1 Tags',
	'No Favicon',
	'No Images',
	'Title Too Short',
	'Title Too Long',
	'Description Too Short',
	'Description Too Long'
] as const

export const BUSINESS_CATEGORY_TAGS = [
	'E-commerce',
	'SaaS',
	'Blog/Content',
	'Portfolio',
	'Corporate',
	'Local Business',
	'Healthcare',
	'Education',
	'Non-profit',
	'Real Estate',
	'Finance',
	'Technology',
	'Media/Entertainment',
	'Food & Beverage',
	'Other'
] as const

export type SeoStatusTag = (typeof SEO_STATUS_TAGS)[number]
export type TechnicalSeoTag = (typeof TECHNICAL_SEO_TAGS)[number]
export type BusinessCategoryTag = (typeof BUSINESS_CATEGORY_TAGS)[number]
export type ReportTag = SeoStatusTag | TechnicalSeoTag | BusinessCategoryTag

export const ALL_TAGS = [
	...SEO_STATUS_TAGS,
	...TECHNICAL_SEO_TAGS,
	...BUSINESS_CATEGORY_TAGS
] as const
