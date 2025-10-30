import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export async function GET() {
	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB || 'seo-reports')

		// ✅ include pageTitle so the report history list can show it
		const reports = await db
			.collection('reports')
			.find(
				{},
				{
					projection: {
						url: 1,
						pageTitle: 1, // 👈 add this line
						createdAt: 1,
						tags: 1,
						businessCategory: 1
					}
				}
			)
			.sort({ createdAt: -1 })
			.toArray()

		return NextResponse.json({ success: true, reports })
	} catch (error) {
		console.error('Error loading reports:', error)
		return NextResponse.json({ success: false, error: 'Failed to load reports' }, { status: 500 })
	}
}
