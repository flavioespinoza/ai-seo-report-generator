import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'
import type { Report } from '@/types/report'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')
    const collection = db.collection<Report>('reports')

    const reports = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      reports: reports.map((report) => ({
        id: report.id || null,
        _id: report._id ? report._id.toString() : null,
        url: report.url,
        pageTitle: report.metadata?.pageTitle || null,
        metaDescription: report.metadata?.metaDescription || null,
        createdAt:
          typeof report.createdAt === 'string'
            ? report.createdAt
            : report.createdAt?.toISOString() ?? null,
        hasIssues: !!report.hasIssues,
      })),
    })
  } catch (error) {
    console.error('Error in GET /api/reports:', error)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { report }: { report: Report } = body

    if (!report || !report.url) {
      return NextResponse.json({ success: false, error: 'Missing report data.' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')
    const collection = db.collection<Report>('reports')

    const newReport: Report = {
      ...report,
      createdAt: new Date(), // fine now: Report allows Date
    }

    const result = await collection.insertOne(newReport)

    return NextResponse.json({
      success: true,
      report: { ...newReport, _id: result.insertedId.toString() },
    })
  } catch (error) {
    console.error('Error in POST /api/reports:', error)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
