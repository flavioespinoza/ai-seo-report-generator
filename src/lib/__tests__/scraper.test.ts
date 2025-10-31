import { scrapeMetadata, validateMetadata, ScraperError } from '../scraper'
import { PageMetadata } from '../scraper'

global.fetch = jest.fn()

describe('scrapeMetadata', () => {
	beforeEach(() => {
		;(fetch as jest.Mock).mockClear()
	})

	it('should scrape metadata correctly', async () => {
		;(fetch as jest.Mock).mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			text: () =>
				Promise.resolve(`
        <html>
          <head>
            <title>Test Page</title>
            <meta name="description" content="Test Description">
            <meta name="keywords" content="test, page">
            <link rel="icon" href="/favicon.ico">
          </head>
          <body>
            <h1>H1 Tag</h1>
            <img src="/image.png">
          </body>
        </html>
      `)
		})

		const metadata = await scrapeMetadata('https://example.com')

		expect(metadata.pageTitle).toBe('Test Page')
		expect(metadata.metaDescription).toBe('Test Description')
		expect(metadata.metaKeywords).toBe('test, page')
		expect(metadata.h1Tags).toEqual(['H1 Tag'])
		expect(metadata.imageCount).toBe(1)
		expect(metadata.hasFavicon).toBe(true)
		expect(metadata.titleLength).toBe(9)
		expect(metadata.descriptionLength).toBe(16)
	})

	it('should throw ScraperError for invalid URL format', async () => {
		await expect(scrapeMetadata('invalid-url')).rejects.toThrow(new ScraperError('Invalid URL format'))
	})

	it('should throw ScraperError when fetch fails', async () => {
		;(fetch as jest.Mock).mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found'
		})

		await expect(scrapeMetadata('https://example.com')).rejects.toThrow(
			new ScraperError('Failed to fetch URL: 404 Not Found', 404)
		)
	})
})

describe('validateMetadata', () => {
	it('should return no issues or warnings for valid metadata', () => {
		const metadata: PageMetadata = {
			url: 'https://example.com',
			pageTitle: 'This is a valid title',
			metaDescription:
				'This is a valid meta description that is long enough to pass the validation check.',
			metaKeywords: 'test, page',
			h1Tags: ['H1 Tag'],
			imageCount: 1,
			hasFavicon: true,
			titleLength: 55,
			descriptionLength: 155
		}
		const { issues, warnings } = validateMetadata(metadata)
		expect(issues).toEqual([])
		expect(warnings).toEqual([])
	})

	it('should return issues for missing title and description', () => {
		const metadata: PageMetadata = {
			url: 'https://example.com',
			pageTitle: null,
			metaDescription: null,
			metaKeywords: null,
			h1Tags: [],
			imageCount: 0,
			hasFavicon: false,
			titleLength: 0,
			descriptionLength: 0
		}
		const { issues, warnings } = validateMetadata(metadata)
		expect(issues).toContain('Missing page title')
		expect(issues).toContain('Missing meta description')
		expect(issues).toContain('No H1 tags found')
		expect(warnings).toContain('No favicon detected')
	})
})
