import { NextRequest, NextResponse } from 'next/server';
import { scrapeMetadata, ScraperError } from '@/lib/scraper';
import { generateSeoFeedback } from '@/lib/openai';
import { dbOperations } from '@/lib/db';
import { z } from 'zod';

const analyzeSchema = z.object({
  url: z.string().url('Please provide a valid URL'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = analyzeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { url } = validation.data;

    let metadata;
    try {
      metadata = await scrapeMetadata(url);
    } catch (error) {
      if (error instanceof ScraperError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode || 400 }
        );
      }
      throw error;
    }

    const aiFeedback = await generateSeoFeedback(metadata);

    const reportId = dbOperations.createReport({
      url: metadata.url,
      page_title: metadata.pageTitle,
      meta_description: metadata.metaDescription,
      meta_keywords: metadata.metaKeywords,
      h1_tags: metadata.h1Tags.join(' | '),
      image_count: metadata.imageCount,
      has_favicon: metadata.hasFavicon ? 1 : 0,
      ai_feedback: aiFeedback,
    });

    const report = dbOperations.getReportById(Number(reportId));

    return NextResponse.json({
      success: true,
      report: {
        id: report?.id,
        url: report?.url,
        metadata: {
          pageTitle: metadata.pageTitle,
          metaDescription: metadata.metaDescription,
          metaKeywords: metadata.metaKeywords,
          h1Tags: metadata.h1Tags,
          imageCount: metadata.imageCount,
          hasFavicon: metadata.hasFavicon,
          titleLength: metadata.titleLength,
          descriptionLength: metadata.descriptionLength,
        },
        aiFeedback,
        createdAt: report?.created_at,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to analyze website. Please try again.' 
      },
      { status: 500 }
    );
  }
}
