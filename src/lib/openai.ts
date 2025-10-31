import OpenAI from 'openai'
import { PageMetadata, validateMetadata } from './scraper'

console.log(process.env.OPENAI_API_KEY)

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

export interface SeoAnalysis {
	summary: string
	strengths: string[]
	improvements: string[]
	technicalIssues: string[]
	recommendations: string[]
}

/**
 * Generates SEO feedback for a given webpage using the OpenAI API.
 * It constructs a detailed prompt based on the scraped metadata, sends it to the GPT-4o-mini model,
 * and returns the AI-generated analysis as a raw string.
 *
 * @param {PageMetadata} metadata - The scraped metadata of the webpage to be analyzed.
 * @returns {Promise<string>} A promise that resolves to a string containing the SEO feedback.
 * @throws {Error} Throws an error if the OpenAI API call fails or returns no feedback.
 */
export async function generateSeoFeedback(metadata: PageMetadata): Promise<string> {
	const { issues, warnings } = validateMetadata(metadata)

	// Beginning of prompt
	const prompt = `You are an expert SEO consultant. Analyze the following webpage metadata and provide actionable SEO improvement recommendations.

Website URL: ${metadata.url}

Metadata:
- Page Title: ${metadata.pageTitle || 'MISSING'}
- Title Length: ${metadata.titleLength} characters
- Meta Description: ${metadata.metaDescription || 'MISSING'}
- Description Length: ${metadata.descriptionLength} characters
- Meta Keywords: ${metadata.metaKeywords || 'Not specified'}
- H1 Tags: ${metadata.h1Tags.length > 0 ? metadata.h1Tags.join(', ') : 'NONE FOUND'}
- Number of Images: ${metadata.imageCount}
- Has Favicon: ${metadata.hasFavicon ? 'Yes' : 'No'}

Automated Issues Detected:
${issues.length > 0 ? issues.map((i) => `- ${i}`).join('\n') : '- None'}

Automated Warnings:
${warnings.length > 0 ? warnings.map((w) => `- ${w}`).join('\n') : '- None'}

Please provide:
1. A brief overall SEO health summary (2-3 sentences)
2. Key strengths (if any)
3. Critical improvements needed
4. Technical SEO issues
5. Specific, actionable recommendations

Format your response in clear sections with bullet points where appropriate. Be specific and practical.`

	// End of prompt

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content:
						'You are an expert SEO consultant providing clear, actionable advice. Focus on practical improvements that will have the most impact.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			temperature: 0.7,
			max_tokens: 1000
		})

		const feedback = response.choices[0]?.message?.content

		if (!feedback) {
			throw new Error('No feedback generated from OpenAI')
		}

		return feedback
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`OpenAI API error: ${error.message}`)
		}
		throw new Error('Failed to generate SEO feedback')
	}
}

/**
 * Parses a raw SEO feedback string from OpenAI into a structured SeoAnalysis object.
 * The function iterates through the lines of the feedback text, identifying section headers
 * (like "Summary:", "Strengths:", etc.) and populating the corresponding fields in the
 * analysis object.
 *
 * @param {string} feedback - The raw, unstructured string of SEO feedback from the OpenAI API.
 * @returns {SeoAnalysis} A structured object containing the parsed SEO analysis.
 */
export function parseSeoFeedback(feedback: string): SeoAnalysis {
	const lines = feedback.split('\n')
	const analysis: SeoAnalysis = {
		summary: '',
		strengths: [],
		improvements: [],
		technicalIssues: [],
		recommendations: []
	}

	let currentSection: keyof SeoAnalysis | null = null
	let summaryLines: string[] = []

	for (const line of lines) {
		const trimmed = line.trim()
		const lowerTrimmed = trimmed.toLowerCase()

		if (!trimmed) continue

		if (
			!trimmed.startsWith('-') &&
			!trimmed.startsWith('*') &&
			!trimmed.match(/^\d+\./) &&
			lowerTrimmed.endsWith(':')
		) {
			if (lowerTrimmed.includes('summary') || lowerTrimmed.includes('overall')) {
				currentSection = 'summary'
				continue
			} else if (lowerTrimmed.includes('strength')) {
				currentSection = 'strengths'
				continue
			} else if (lowerTrimmed.includes('improvement') || lowerTrimmed.includes('critical')) {
				currentSection = 'improvements'
				continue
			} else if (lowerTrimmed.includes('technical')) {
				currentSection = 'technicalIssues'
				continue
			} else if (lowerTrimmed.includes('recommendation')) {
				currentSection = 'recommendations'
				continue
			}
		}

		if (currentSection === 'summary') {
			if (!trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.match(/^\d+\./)) {
				summaryLines.push(trimmed)
			}
		} else if (
			currentSection !== null &&
			(trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.match(/^\d+\./))
		) {
			const content = trimmed
				.replace(/^[-*]\s*/, '')
				.replace(/^\d+\.\s*/, '')
				.trim()
			if (content) {
				analysis[currentSection].push(content)
			}
		}
	}

	analysis.summary = summaryLines.join(' ').trim()

	return analysis
}
