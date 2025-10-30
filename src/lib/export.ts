// src/lib/export.ts
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Generate a markdown version of the SEO report
 * Handles both string and object aiFeedback values safely.
 */
export function generateMarkdown(report: {
	url: string
	metadata: {
		pageTitle: string | null
		metaDescription: string | null
		metaKeywords: string | null
		h1Tags: string[]
		imageCount: number
		hasFavicon: boolean
	}
	aiFeedback?: string | object | undefined
	createdAt?: string
}): string {
	const { metadata, aiFeedback, url, createdAt } = report

	// Convert AI feedback to a clean string
	const formattedFeedback =
		typeof aiFeedback === 'string'
			? aiFeedback
			: aiFeedback
				? JSON.stringify(aiFeedback, null, 2)
				: 'No AI feedback available.'

	// Ensure metadata safety
	const safeMeta = {
		pageTitle: metadata.pageTitle ?? 'Missing',
		metaDescription: metadata.metaDescription ?? 'Missing',
		metaKeywords: metadata.metaKeywords ?? 'Not specified',
		h1Tags: metadata.h1Tags ?? [],
		imageCount: metadata.imageCount ?? 0,
		hasFavicon: metadata.hasFavicon ?? false
	}

	return `# SEO Report for ${url}

**Generated:** ${createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}

---

## 🏷 Page Metadata

- **Title:** ${safeMeta.pageTitle}
- **Description:** ${safeMeta.metaDescription}
- **Keywords:** ${safeMeta.metaKeywords}
- **Images:** ${safeMeta.imageCount}
- **Favicon:** ${safeMeta.hasFavicon ? 'Present' : 'Missing'}
- **H1 Tags:**  
${safeMeta.h1Tags.length > 0 ? safeMeta.h1Tags.map((tag) => `  - ${tag}`).join('\n') : '  - None'}

---

## 🤖 AI-Powered SEO Analysis

${formattedFeedback}
`
}

/**
 * Export the visible SEO report as a PDF.
 * Captures the HTML content of an element by ID and converts it to a downloadable PDF file.
 */
export async function exportToPDF(elementId: string, url?: string): Promise<void> {
	const element = document.getElementById(elementId)
	if (!element) {
		console.warn(`Element with id "${elementId}" not found.`)
		return
	}

	// Render the HTML to canvas
	const canvas = await html2canvas(element, {
		scale: 2,
		backgroundColor: '#ffffff'
	})

	// Convert the canvas to image data
	const imgData = canvas.toDataURL('image/png')

	// Create the PDF
	const pdf = new jsPDF('p', 'mm', 'a4')
	const width = pdf.internal.pageSize.getWidth()
	const height = (canvas.height * width) / canvas.width
	pdf.addImage(imgData, 'PNG', 0, 0, width, height)

	// Build a safe domain name
	const domain = (() => {
		try {
			const parsed = new URL(url || '')
			return parsed.hostname.replace(/^www\./, '').replace(/[^\w.-]/g, '_')
		} catch {
			return 'unknown-site'
		}
	})()

	// Format date as YYYY-MM-DD_hh-mm-ss_Z
	const now = new Date()
	const formattedDate = now.toISOString().replace('T', '_').replace(/:/g, '-').replace(/\..+/, '_Z')

	// Save PDF with readable name
	pdf.save(`seo-report-${domain}-${formattedDate}.pdf`)
}
