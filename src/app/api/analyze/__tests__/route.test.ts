/** @jest-environment node */

import { POST } from '../route'
import { NextRequest } from 'next/server'
import { generateSeoFeedback } from '@/lib/openai'
import { detectBusinessCategory, generateTagsFromMetadata } from '@/lib/generateTags'

// Mock the external dependencies
jest.mock('@/lib/scraper', () => ({
  ...jest.requireActual('@/lib/scraper'),
  scrapeMetadata: jest.fn()
}))
import { scrapeMetadata, ScraperError } from '@/lib/scraper'

jest.mock('@/lib/openai')
jest.mock('@/lib/generateTags')
jest.mock(
  '@/lib/db',
  () => ({
    __esModule: true,
    default: Promise.resolve({
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      insertOne: jest.fn().mockResolvedValue({ insertedId: 'mock-id' })
    })
  })
)

describe('POST /api/analyze', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a 400 error for an invalid URL', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ url: 'invalid-url' })
    })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please provide a valid URL')
  })

  it('should handle scraper errors', async () => {
    ;(scrapeMetadata as jest.Mock).mockRejectedValue(new ScraperError('Scraping failed', 500))
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ url: 'http://example.com' })
    })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Scraping failed')
  })

  it('should handle AI feedback generation errors', async () => {
    ;(scrapeMetadata as jest.Mock).mockResolvedValue({ url: 'http://example.com' })
    ;(generateSeoFeedback as jest.Mock).mockRejectedValue(new Error('AI feedback generation failed'))
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ url: 'http://example.com' })
    })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('AI feedback generation failed')
  })

  it('should return a successful report', async () => {
    const mockMetadata = {
      url: 'http://example.com',
      pageTitle: 'Example Domain',
      metaDescription: 'This is an example domain.',
      metaKeywords: ['example', 'domain'],
      h1Tags: ['Example Domain'],
      imageCount: 1,
      hasFavicon: true,
      titleLength: 14,
      descriptionLength: 29
    }
    const mockAiFeedback = 'This is AI feedback'
    const mockTags = ['example', 'domain']
    const mockBusinessCategory = 'Technology'

    ;(scrapeMetadata as jest.Mock).mockResolvedValue(mockMetadata)
    ;(generateSeoFeedback as jest.Mock).mockResolvedValue(mockAiFeedback)
    ;(generateTagsFromMetadata as jest.Mock).mockReturnValue(mockTags)
    ;(detectBusinessCategory as jest.Mock).mockReturnValue(mockBusinessCategory)

    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ url: 'http://example.com' })
    })
    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.report).toBeDefined()
    expect(data.report._id).toBe('mock-id')
  })
})
