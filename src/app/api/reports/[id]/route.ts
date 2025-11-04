import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import type { Report } from '@/types/report'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// Extend Report to support ObjectId on the backend
interface DbReport extends Omit<Report, '_id'> {
	_id?: string | ObjectId
	userId?: string
}

export async function GET(request: Request, { params }: { params: { id:string } }) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')
		const collection = db.collection<DbReport>('reports')

		let query: { _id: ObjectId }
		try {
			query = { _id: new ObjectId(params.id) }
		} catch {
			return NextResponse.json({ success: false, error: 'Invalid report ID.' }, { status: 400 })
		}

		const report = await collection.findOne(query)
		if (!report) {
			return NextResponse.json({ success: false, error: 'Report not found.' }, { status: 404 })
		}

		if (report.userId !== session.user.id) {
			return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
		}

		return NextResponse.json({
			success: true,
			report: { ...report, _id: report._id?.toString() }
		})
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
	}
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')
		const collection = db.collection<DbReport>('reports')

		let query: { _id: ObjectId }
		try {
			query = { _id: new ObjectId(params.id) }
		} catch {
			return NextResponse.json({ success: false, error: 'Invalid report ID.' }, { status: 400 })
		}

		// First, find the report to check for ownership
		const report = await collection.findOne(query)
		if (!report) {
			return NextResponse.json({ success: false, error: 'Report not found.' }, { status: 404 })
		}

		// Check if the user owns the report
		if (report.userId !== session.user.id) {
			return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
		}

		const result = await collection.deleteOne(query)
		if (result.deletedCount === 0) {
			return NextResponse.json({ success: false, error: 'Report not found.' }, { status: 404 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
	}
}
