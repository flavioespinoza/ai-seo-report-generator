import { NextRequest, NextResponse } from 'next/server'
import { dbOperations } from '@/lib/db'

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const url = searchParams.get('url')
		const limit = parseInt(searchParams.get('limit') || '50')

		let reports

		if (url) {
			reports = dbOperations.getReportsByUrl(url)
		} else {
			reports = dbOperations.getAllReports(limit)
		}

		const transformedReports = reports.map((report) => ({
			id: report.id,
			url: report.url,
			pageTitle: report.page_title,
			metaDescription: report.meta_description,
			createdAt: report.created_at,
			hasIssues: !report.page_title || !report.meta_description
		}))

		return NextResponse.json({
			success: true,
			reports: transformedReports,
			count: transformedReports.length
		})
	} catch (error) {
		console.error('Fetch reports error:', error)

		return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
	}
}
