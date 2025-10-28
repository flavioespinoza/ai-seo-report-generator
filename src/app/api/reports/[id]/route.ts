import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid report ID' },
        { status: 400 }
      );
    }

    const report = dbOperations.getReportById(id);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const transformedReport = {
      id: report.id,
      url: report.url,
      metadata: {
        pageTitle: report.page_title,
        metaDescription: report.meta_description,
        metaKeywords: report.meta_keywords,
        h1Tags: report.h1_tags?.split(' | ') || [],
        imageCount: report.image_count,
        hasFavicon: report.has_favicon === 1,
      },
      aiFeedback: report.ai_feedback,
      createdAt: report.created_at,
    };

    return NextResponse.json({
      success: true,
      report: transformedReport,
    });
  } catch (error) {
    console.error('Fetch report error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid report ID' },
        { status: 400 }
      );
    }

    dbOperations.deleteReport(id);

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
