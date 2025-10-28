import { scrapeMetadata, validateMetadata, ScraperError } from '@/lib/scraper';

global.fetch = jest.fn();

describe('Scraper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeMetadata', () => {
    it('should successfully scrape metadata from valid HTML', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Page Title</title>
            <meta name="description" content="Test description for SEO">
            <meta name="keywords" content="test, seo, keywords">
            <link rel="icon" href="/favicon.ico">
          </head>
          <body>
            <h1>Main Heading</h1>
            <img src="test1.jpg" alt="Test 1">
            <img src="test2.jpg" alt="Test 2">
          </body>
        </html>
      `;

      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockHtml,
        status: 200,
        statusText: 'OK',
      });

      const result = await scrapeMetadata('https://example.com');

      expect(result).toMatchObject({
        url: 'https://example.com',
        pageTitle: 'Test Page Title',
        metaDescription: 'Test description for SEO',
        metaKeywords: 'test, seo, keywords',
        imageCount: 2,
        hasFavicon: true,
      });
      expect(result.h1Tags).toContain('Main Heading');
    });

    it('should handle missing metadata gracefully', async () => {
      const mockHtml = `
        <!DOCTYPE html>
        <html>
          <head></head>
          <body><p>No metadata</p></body>
        </html>
      `;

      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockHtml,
      });

      const result = await scrapeMetadata('https://example.com');

      expect(result.pageTitle).toBeNull();
      expect(result.metaDescription).toBeNull();
      expect(result.metaKeywords).toBeNull();
      expect(result.h1Tags).toHaveLength(0);
    });

    it('should throw error for invalid URL', async () => {
      await expect(scrapeMetadata('not-a-url')).rejects.toThrow(ScraperError);
    });

    it('should throw error for failed fetch', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(scrapeMetadata('https://example.com')).rejects.toThrow(ScraperError);
    });

    it('should add https:// protocol if missing', async () => {
      const mockHtml = '<html><head><title>Test</title></head></html>';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockHtml,
      });

      const result = await scrapeMetadata('example.com');
      expect(result.url).toBe('https://example.com');
    });
  });

  describe('validateMetadata', () => {
    it('should identify missing title as an issue', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: null,
        metaDescription: 'Valid description',
        metaKeywords: null,
        h1Tags: ['Heading'],
        imageCount: 5,
        hasFavicon: true,
        titleLength: 0,
        descriptionLength: 18,
      };

      const result = validateMetadata(metadata);
      expect(result.issues).toContain('Missing page title');
    });

    it('should warn about short title', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: 'Short',
        metaDescription: 'Valid description',
        metaKeywords: null,
        h1Tags: ['Heading'],
        imageCount: 5,
        hasFavicon: true,
        titleLength: 5,
        descriptionLength: 18,
      };

      const result = validateMetadata(metadata);
      expect(result.warnings).toContain('Title is too short (recommended: 50-60 characters)');
    });

    it('should warn about long title', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: 'A'.repeat(70),
        metaDescription: 'Valid description',
        metaKeywords: null,
        h1Tags: ['Heading'],
        imageCount: 5,
        hasFavicon: true,
        titleLength: 70,
        descriptionLength: 18,
      };

      const result = validateMetadata(metadata);
      expect(result.warnings).toContain('Title is too long (recommended: 50-60 characters)');
    });

    it('should identify missing meta description as an issue', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: 'Valid Title',
        metaDescription: null,
        metaKeywords: null,
        h1Tags: ['Heading'],
        imageCount: 5,
        hasFavicon: true,
        titleLength: 11,
        descriptionLength: 0,
      };

      const result = validateMetadata(metadata);
      expect(result.issues).toContain('Missing meta description');
    });

    it('should identify missing H1 tags as an issue', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: 'Valid Title',
        metaDescription: 'Valid description',
        metaKeywords: null,
        h1Tags: [],
        imageCount: 5,
        hasFavicon: true,
        titleLength: 11,
        descriptionLength: 18,
      };

      const result = validateMetadata(metadata);
      expect(result.issues).toContain('No H1 tags found');
    });

    it('should warn about multiple H1 tags', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: 'Valid Title',
        metaDescription: 'Valid description',
        metaKeywords: null,
        h1Tags: ['Heading 1', 'Heading 2', 'Heading 3'],
        imageCount: 5,
        hasFavicon: true,
        titleLength: 11,
        descriptionLength: 18,
      };

      const result = validateMetadata(metadata);
      expect(result.warnings.some(w => w.includes('Multiple H1 tags'))).toBe(true);
    });

    it('should have no issues for well-optimized page', () => {
      const metadata = {
        url: 'https://example.com',
        pageTitle: 'Perfect Title Length For SEO Optimization Here',
        metaDescription: 'A'.repeat(155),
        metaKeywords: 'seo, optimization',
        h1Tags: ['Main Heading'],
        imageCount: 10,
        hasFavicon: true,
        titleLength: 46,
        descriptionLength: 155,
      };

      const result = validateMetadata(metadata);
      expect(result.issues).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });
  });
});
