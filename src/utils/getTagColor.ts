/**
 * Returns a Tailwind CSS class string for styling a tag based on its content.
 * The function matches keywords within the tag string to determine the appropriate color scheme,
 * which helps to visually categorize tags (e.g., critical issues are red, optimizations are green).
 *
 * @param {string} tag - The tag string to be evaluated.
 * @returns {string} A string of Tailwind CSS classes for background, text, and border colors.
 */
export function getTagColor(tag: string): string {
	const lower = tag.toLowerCase()

	// 🔴 Structural / critical issues
	if (
		lower.includes('h1') ||
		lower.includes('duplicate') ||
		lower.includes('missing') ||
		lower.includes('error')
	)
		return 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-400/30'

	// 🟠 Needs improvement / warnings
	if (
		lower.includes('improve') ||
		lower.includes('needs') ||
		lower.includes('slow') ||
		lower.includes('warning') ||
		lower.includes('poor') ||
		lower.includes('low')
	)
		return 'bg-orange-400/15 text-orange-700 dark:text-orange-300 border border-orange-400/30'

	// 🟢 Optimized / passed checks
	if (
		lower.includes('optimized') ||
		lower.includes('passed') ||
		lower.includes('ok') ||
		lower.includes('good') ||
		lower.includes('valid')
	)
		return 'bg-green-500/15 text-green-700 dark:text-green-300 border border-green-400/30'

	// 🔵 Metadata / SEO elements
	if (
		lower.includes('meta') ||
		lower.includes('title') ||
		lower.includes('description') ||
		lower.includes('keyword') ||
		lower.includes('schema')
	)
		return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-400/30'

	// 🟣 Accessibility
	if (
		lower.includes('accessibility') ||
		lower.includes('contrast') ||
		lower.includes('aria') ||
		lower.includes('alt')
	)
		return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-400/30'

	// 🟡 Business / industry categories
	if (
		lower.includes('e-commerce') ||
		lower.includes('ecommerce') ||
		lower.includes('saas') ||
		lower.includes('portfolio') ||
		lower.includes('blog') ||
		lower.includes('agency')
	)
		return 'bg-yellow-400/20 text-yellow-800 dark:text-yellow-300 border border-yellow-400/30'

	// 🟤 Performance
	if (
		lower.includes('performance') ||
		lower.includes('speed') ||
		lower.includes('load') ||
		lower.includes('core web vitals')
	)
		return 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30'

	// 🩵 Links / external references
	if (
		lower.includes('link') ||
		lower.includes('anchor') ||
		lower.includes('nofollow') ||
		lower.includes('backlink')
	)
		return 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-400/30'

	// 🩶 Content quality / readability
	if (
		lower.includes('content') ||
		lower.includes('readability') ||
		lower.includes('keyword density') ||
		lower.includes('duplicate text')
	)
		return 'bg-slate-400/15 text-slate-700 dark:text-slate-300 border border-slate-400/30'

	// ⚪ Default fallback
	return 'bg-gray-400/15 text-gray-700 dark:text-gray-300 border border-gray-400/30'
}
