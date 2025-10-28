import * as cheerio from 'cheerio';
import { z } from 'zod';

export interface PageMetadata {
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  h1Tags: string[];
  imageCount: number;
  hasFavicon: boolean;
  titleLength: number;
  descriptionLength: number;
}

const urlSchema = z.string().url();

export class ScraperError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ScraperError';
  }
}

export async function scrapeMetadata(url: string): Promise<PageMetadata> {
  try {
    urlSchema.parse(url);
  } catch (error) {
    throw new ScraperError('Invalid URL format');
  }

  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Report-Generator/1.0)',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new ScraperError(
        `Failed to fetch URL: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const pageTitle = $('title').first().text().trim() || null;
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;
    const metaKeywords = $('meta[name="keywords"]').attr('content')?.trim() || null;
    
    const h1Tags: string[] = [];
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Tags.push(text);
    });

    const imageCount = $('img').length;
    const hasFavicon = $('link[rel*="icon"]').length > 0;

    const titleLength = pageTitle?.length || 0;
    const descriptionLength = metaDescription?.length || 0;

    return {
      url: fullUrl,
      pageTitle,
      metaDescription,
      metaKeywords,
      h1Tags,
      imageCount,
      hasFavicon,
      titleLength,
      descriptionLength,
    };
  } catch (error) {
    if (error instanceof ScraperError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ScraperError('Request timeout - the website took too long to respond');
      }
      throw new ScraperError(`Failed to scrape URL: ${error.message}`);
    }
    
    throw new ScraperError('An unknown error occurred while scraping');
  }
}

export function validateMetadata(metadata: PageMetadata): {
  issues: string[];
  warnings: string[];
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!metadata.pageTitle) {
    issues.push('Missing page title');
  } else {
    if (metadata.titleLength < 30) {
      warnings.push('Title is too short (recommended: 50-60 characters)');
    } else if (metadata.titleLength > 60) {
      warnings.push('Title is too long (recommended: 50-60 characters)');
    }
  }

  if (!metadata.metaDescription) {
    issues.push('Missing meta description');
  } else {
    if (metadata.descriptionLength < 120) {
      warnings.push('Meta description is too short (recommended: 150-160 characters)');
    } else if (metadata.descriptionLength > 160) {
      warnings.push('Meta description is too long (recommended: 150-160 characters)');
    }
  }

  if (metadata.h1Tags.length === 0) {
    issues.push('No H1 tags found');
  } else if (metadata.h1Tags.length > 1) {
    warnings.push(`Multiple H1 tags found (${metadata.h1Tags.length}). Best practice is one H1 per page.`);
  }

  if (!metadata.hasFavicon) {
    warnings.push('No favicon detected');
  }

  return { issues, warnings };
}
