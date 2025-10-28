import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'
import { ObjectId } from 'mongodb'
import type { Report } from '@/types/report'

// Extend Report to support ObjectId on the backend
interface DbReport extends Omit<Report, '_id'> {
  _id?: string | ObjectId
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    return NextResponse.json({
      success: true,
      report: { ...report, _id: report._id?.toString() },
    })
  } catch (error) {
    console.error('Error in GET /api/reports/[id]:', error)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const result = await collection.deleteOne(query)
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Report not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/reports/[id]:', error)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
