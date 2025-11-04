import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')

		const reports = await db
			.collection('reports')
			.find(
				{ userId: session.user.id },
				{
					projection: {
						url: 1,
						pageTitle: 1,
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
		return NextResponse.json({ success: false, error: 'Failed to load reports' }, { status: 500 })
	}
}
