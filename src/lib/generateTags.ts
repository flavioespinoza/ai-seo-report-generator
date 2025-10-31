import type { Metadata, ReportTag } from '@/types/report'

/**
 * Generates a list of SEO-related tags based on website metadata.
 * This function analyzes the provided metadata for common SEO issues and assigns tags
 * accordingly, such as 'Missing Meta Description', 'Title Too Long', etc. It also provides
 * an overall health status tag like 'Critical Issues' or 'Optimized'.
 *
 * @param {Metadata} metadata - The scraped metadata of the website.
 * @param {string} aiFeedback - AI-generated feedback string (currently unused in this function but included for future enhancements).
 * @returns {ReportTag[]} An array of strings representing the identified SEO tags.
 */
export function generateTagsFromMetadata(metadata: Metadata, aiFeedback: string): ReportTag[] {
	const tags: ReportTag[] = []

	// Technical SEO tags based on metadata
	if (!metadata.metaDescription) {
		tags.push('Missing Meta Description')
	}

	if (!metadata.pageTitle) {
		tags.push('Missing Title Tag')
	}

	if (metadata.h1Tags.length === 0) {
		tags.push('No H1 Tag')
	} else if (metadata.h1Tags.length > 1) {
		tags.push('Multiple H1 Tags')
	}

	if (!metadata.hasFavicon) {
		tags.push('No Favicon')
	}

	if (metadata.imageCount === 0) {
		tags.push('No Images')
	}

	if (metadata.titleLength && metadata.titleLength < 30) {
		tags.push('Title Too Short')
	} else if (metadata.titleLength && metadata.titleLength > 60) {
		tags.push('Title Too Long')
	}

	if (metadata.descriptionLength && metadata.descriptionLength < 120) {
		tags.push('Description Too Short')
	} else if (metadata.descriptionLength && metadata.descriptionLength > 160) {
		tags.push('Description Too Long')
	}

	// SEO Health Status based on issues count
	const criticalIssues = [
		!metadata.metaDescription,
		!metadata.pageTitle,
		metadata.h1Tags.length === 0
	].filter(Boolean).length

	if (criticalIssues >= 2) {
		tags.push('Critical Issues')
	} else if (tags.length > 0) {
		tags.push('Needs Improvement')
	} else {
		tags.push('Optimized')
	}

	return tags
}

/**
 * Detects the business category of a website based on its content.
 * This function analyzes the page title, meta description, H1 tags, and AI feedback
 * to identify keywords that suggest a specific business category like 'E-commerce' or 'SaaS'.
 *
 * @param {Metadata} metadata - The scraped metadata of the website.
 * @param {string} aiFeedback - The AI-generated SEO feedback text.
 * @param {string} url - The URL of the website (currently unused but included for future context).
 * @returns {string} The detected business category, or 'Other' if no specific category is identified.
 */
export function detectBusinessCategory(
	metadata: Metadata,
	aiFeedback: string,
	url: string
): string {
	const content =
		`${metadata.pageTitle} ${metadata.metaDescription} ${metadata.h1Tags.join(' ')} ${aiFeedback}`.toLowerCase()

	// E-commerce indicators
	if (content.match(/shop|store|cart|product|buy|purchase|checkout|price/)) {
		return 'E-commerce'
	}

	// SaaS indicators
	if (content.match(/saas|software|platform|api|cloud|solution|tool|service/)) {
		return 'SaaS'
	}

	// Blog/Content indicators
	if (content.match(/blog|article|news|post|story|read|author/)) {
		return 'Blog/Content'
	}

	// Portfolio indicators
	if (content.match(/portfolio|work|project|case study|designer|developer|freelance/)) {
		return 'Portfolio'
	}

	// Healthcare indicators
	if (content.match(/health|medical|doctor|hospital|clinic|patient|care|treatment/)) {
		return 'Healthcare'
	}

	// Education indicators
	if (content.match(/education|school|university|course|learn|student|teacher|training/)) {
		return 'Education'
	}

	// Non-profit indicators
	if (content.match(/nonprofit|non-profit|charity|donate|foundation|cause/)) {
		return 'Non-profit'
	}

	// Real Estate indicators
	if (content.match(/real estate|property|home|house|apartment|rent|sale|listing/)) {
		return 'Real Estate'
	}

	// Finance indicators
	if (content.match(/finance|bank|investment|loan|credit|trading|insurance/)) {
		return 'Finance'
	}

	// Technology indicators
	if (content.match(/technology|tech|innovation|startup|ai|ml|data/)) {
		return 'Technology'
	}

	// Media/Entertainment indicators
	if (content.match(/entertainment|movie|music|video|streaming|media|film/)) {
		return 'Media/Entertainment'
	}

	// Food & Beverage indicators
	if (content.match(/restaurant|food|menu|cafe|coffee|dining|recipe|delivery/)) {
		return 'Food & Beverage'
	}

	// Corporate indicators
	if (content.match(/corporate|enterprise|business|company|about us|team|career/)) {
		return 'Corporate'
	}

	// Local Business indicators
	if (content.match(/local|location|hours|address|contact|near me/)) {
		return 'Local Business'
	}

	return 'Other'
}
