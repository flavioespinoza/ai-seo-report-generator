// src/utils/getTagColor.ts

export function getTagColor(tag: string): string {
	const lower = tag.toLowerCase()

	// 🔴 Structural or critical issues
	if (lower.includes('h1') || lower.includes('duplicate') || lower.includes('missing') || lower.includes('error'))
		return 'bg-red-500 text-white border-red-500'

	// 🟠 Needs improvement or warnings
	if (lower.includes('improve') || lower.includes('needs') || lower.includes('slow') || lower.includes('warning') || lower.includes('poor') || lower.includes('low'))
		return 'bg-orange-500 text-white border-orange-500'

	// ⚫ Optimized / Passed checks (your custom preference)
	if (lower.includes('optimized') || lower.includes('passed') || lower.includes('ok') || lower.includes('good') || lower.includes('valid'))
		return 'bg-black text-white border-black'

	// 🔵 Metadata / SEO elements
	if (lower.includes('meta') || lower.includes('title') || lower.includes('description') || lower.includes('keyword') || lower.includes('schema'))
		return 'bg-blue-500 text-white border-blue-500'

	// 🟣 Accessibility
	if (lower.includes('accessibility') || lower.includes('contrast') || lower.includes('aria') || lower.includes('alt'))
		return 'bg-purple-500 text-white border-purple-500'

	// 🟡 Business / industry categories
	if (lower.includes('e-commerce') || lower.includes('ecommerce') || lower.includes('saas') || lower.includes('portfolio') || lower.includes('blog') || lower.includes('agency'))
		return 'bg-yellow-500 text-black border-yellow-500'

	// 🟤 Performance
	if (lower.includes('performance') || lower.includes('speed') || lower.includes('load') || lower.includes('core web vitals'))
		return 'bg-amber-500 text-black border-amber-500'

	// ⚪ Default fallback
	return 'bg-gray-400 text-black border-gray-400'
}
