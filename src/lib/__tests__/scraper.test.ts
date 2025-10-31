/** @jest-environment node */

import { scrapeMetadata, ScraperError } from '../scraper'

// Mock the global fetch function
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('scrapeMetadata', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should scrape metadata from a URL', async () => {
    const mockHtml = `
      <html>
        <head>
          <title>Test Title</title>
          <meta name="description" content="Test description." />
          <meta name="keywords" content="test, keywords" />
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
          <h1>Test H1</h1>
          <img src="test.jpg" />
        </body>
      </html>
    `
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml)
    })
    const metadata = await scrapeMetadata('http://example.com')
    expect(metadata).toEqual({
      url: 'http://example.com',
      pageTitle: 'Test Title',
      metaDescription: 'Test description.',
      metaKeywords: 'test, keywords',
      h1Tags: ['Test H1'],
      imageCount: 1,
      hasFavicon: true,
      titleLength: 10,
      descriptionLength: 17
    })
  })

  it('should throw a ScraperError for a non-200 response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })
    await expect(scrapeMetadata('http://example.com')).rejects.toThrow(
      new ScraperError('Failed to fetch URL: 404 Not Found', 404)
    )
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    await expect(scrapeMetadata('http://example.com')).rejects.toThrow(
      new ScraperError('Failed to scrape URL: Network error')
    )
  })
})
