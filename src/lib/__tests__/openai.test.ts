
import { PageMetadata } from '../scraper'

let generateSeoFeedback: any, parseSeoFeedback: any

const mockCreate = jest.fn()

jest.doMock('openai', () => {
	return {
		__esModule: true,
		default: jest.fn().mockImplementation(() => ({
			chat: {
				completions: {
					create: mockCreate
				}
			}
		}))
	}
})

beforeAll(async () => {
	const openaiModule = await import('../openai')
	generateSeoFeedback = openaiModule.generateSeoFeedback
	parseSeoFeedback = openaiModule.parseSeoFeedback
})

describe('generateSeoFeedback', () => {
	const metadata: PageMetadata = {
		url: 'https://example.com',
		pageTitle: 'Test Page',
		titleLength: 45,
		metaDescription: 'Test Description',
		descriptionLength: 140,
		metaKeywords: 'test, page',
		h1Tags: ['H1 Tag'],
		imageCount: 10,
		hasFavicon: true
	}

	beforeEach(() => {
		mockCreate.mockClear()
	})

	it('should generate SEO feedback', async () => {
		mockCreate.mockResolvedValue({
			choices: [
				{
					message: {
						content: 'This is a test summary.'
					}
				}
			]
		})
		const feedback = await generateSeoFeedback(metadata)
		expect(feedback).toBeDefined()
		expect(feedback).toContain('This is a test summary.')
	})

	it('should handle OpenAI API errors', async () => {
		mockCreate.mockRejectedValue(new Error('API Error'))
		await expect(generateSeoFeedback(metadata)).rejects.toThrow(
			'OpenAI API error: API Error'
		)
	})
})

describe('parseSeoFeedback', () => {
	const feedback = `
Overall SEO Health Summary:
This is a test summary.

Key Strengths:
- Strength 1
- Strength 2

Critical Improvements Needed:
* Improvement 1
* Improvement 2

Technical SEO Issues:
1. Technical Issue 1

Specific, Actionable Recommendations:
- Recommendation 1
  `

	it('should parse the SEO feedback correctly', () => {
		const parsed = parseSeoFeedback(feedback)
		expect(parsed.summary).toBe('This is a test summary.')
		expect(parsed.strengths).toEqual(['Strength 1', 'Strength 2'])
		expect(parsed.improvements).toEqual(['Improvement 1', 'Improvement 2'])
		expect(parsed.technicalIssues).toEqual(['Technical Issue 1'])
		expect(parsed.recommendations).toEqual(['Recommendation 1'])
	})
})
