import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { detectBusinessCategory, generateTagsFromMetadata } from '@/lib/generateTags'
import { generateSeoFeedback } from '@/lib/openai'
import { ScraperError, scrapeMetadata } from '@/lib/scraper'
import type { Report } from '@/types/report'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const analyzeSchema = z.object({
	url: z.string().url('Please provide a valid URL')
})

/**
 * Handles the POST request to analyze a URL for SEO.
 * This endpoint scrapes metadata from a given URL, generates AI-based SEO feedback,
 * derives tags and a business category, and saves a comprehensive report to the database.
 *
 * @param {NextRequest} request - The incoming Next.js API request object, containing the URL to be analyzed in its JSON body.
 * @returns {Promise<NextResponse>} A promise that resolves to a JSON response containing the saved report data on success,
 * or an error message on failure.
 */
export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session) {
		return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const body = await request.json()
		const validation = analyzeSchema.safeParse(body)

		if (!validation.success) {
			return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
		}

		const { url } = validation.data

		// 🕷️ Scrape metadata from the target URL
		let metadata
		try {
			metadata = await scrapeMetadata(url)
		} catch (error) {
			if (error instanceof ScraperError) {
				return NextResponse.json({ error: error.message }, { status: error.statusCode || 400 })
			}
			throw error
		}

		// 🧠 Generate AI-based SEO feedback
		const aiFeedback = await generateSeoFeedback(metadata)

		// 🏷️ Derive tags & business category
		const tags = generateTagsFromMetadata(metadata, aiFeedback)
		const businessCategory = detectBusinessCategory(metadata, aiFeedback, url)

		// ✅ Normalize nulls → undefined (TypeScript-safe)
		const safeMeta = {
			pageTitle: metadata.pageTitle ?? undefined,
			metaDescription: metadata.metaDescription ?? undefined,
			metaKeywords: Array.isArray(metadata.metaKeywords)
				? metadata.metaKeywords
				: metadata.metaKeywords
					? [metadata.metaKeywords]
					: undefined,
			h1Tags: metadata.h1Tags ?? undefined,
			imageCount: metadata.imageCount ?? undefined,
			hasFavicon: metadata.hasFavicon ?? undefined,
			titleLength: metadata.titleLength ?? undefined,
			descriptionLength: metadata.descriptionLength ?? undefined
		}

		// ✅ Always store a top-level pageTitle with a fallback
		const pageTitle = safeMeta.pageTitle?.trim() || '(No title)'

		// 💾 Save report to MongoDB
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB || 'seo_support_generator')
		const collection = db.collection<Report>('reports')

		const newReport: Report = {
			userId: session.user.id,
			url: metadata.url,
			pageTitle, // ✅ top-level title
			metadata: safeMeta,
			aiFeedback,
			createdAt: new Date(),
			lastModified: new Date(),
			hasIssues:
				!safeMeta.pageTitle ||
				!safeMeta.metaDescription ||
				safeMeta.imageCount === 0 ||
				!safeMeta.hasFavicon,
			tags,
			businessCategory
		}

		const result = await collection.insertOne(newReport)
		const insertedId = result.insertedId.toString()

		// ✅ Return the full saved report
		return NextResponse.json({
			success: true,
			report: {
				_id: insertedId,
				...newReport
			}
		})
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Failed to analyze website. Please try again.'
			},
			{ status: 500 }
		)
	}
}
