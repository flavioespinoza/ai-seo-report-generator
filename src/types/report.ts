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
  id?: string | number
  url: string
  metadata: Metadata
  aiFeedback: string
  createdAt?: string
  hasIssues?: boolean
}

export interface ReportSummary {
  _id?: string
  id?: string | number
  url: string
  pageTitle: string | null
  metaDescription: string | null
  createdAt: string
  hasIssues: boolean
}
