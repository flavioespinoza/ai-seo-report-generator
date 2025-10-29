import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/db'
import { generateSeoFeedback } from '@/lib/openai'
import { ScraperError, scrapeMetadata } from '@/lib/scraper'
import type { Report } from '@/types/report'
import { z } from 'zod'

const analyzeSchema = z.object({
	url: z.string().url('Please provide a valid URL')
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		const validation = analyzeSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
		}

		const { url } = validation.data

		// Scrape metadata
		let metadata
		try {
			metadata = await scrapeMetadata(url)
		} catch (error) {
			if (error instanceof ScraperError) {
				return NextResponse.json({ error: error.message }, { status: error.statusCode || 400 })
			}
			throw error
		}

		// Generate AI feedback
		const aiFeedback = await generateSeoFeedback(metadata)

		// Save report to MongoDB
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')
		const collection = db.collection<Report>('reports')

		const newReport: Report = {
			url: metadata.url,
			metadata: {
				pageTitle: metadata.pageTitle,
				metaDescription: metadata.metaDescription,
				metaKeywords: metadata.metaKeywords,
				h1Tags: metadata.h1Tags,
				imageCount: metadata.imageCount,
				hasFavicon: metadata.hasFavicon,
				titleLength: metadata.titleLength,
				descriptionLength: metadata.descriptionLength
			},
			aiFeedback,
			createdAt: new Date(),
			hasIssues: metadata.imageCount === 0 || !metadata.hasFavicon
		}

		const result = await collection.insertOne(newReport)
		const insertedId = result.insertedId.toString()

		// Return the full report
		return NextResponse.json({
			success: true,
			report: {
				_id: insertedId,
				...newReport
			}
		})
	} catch (error) {
		console.error('Analysis error:', error)
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Failed to analyze website. Please try again.'
			},
			{ status: 500 }
		)
	}
}
