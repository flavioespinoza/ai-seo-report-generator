import { generateTagsFromMetadata, detectBusinessCategory } from '../generateTags'
import type { Metadata } from '@/types/report'

describe('generateTagsFromMetadata', () => {
	const baseMetadata: Metadata = {
		pageTitle: 'Test Page',
		metaDescription: 'This is a test description.',
		h1Tags: ['Test H1'],
		hasFavicon: true,
		imageCount: 5,
		titleLength: 45,
		descriptionLength: 140,
		url: 'https://example.com'
	}

	it('should return "Optimized" for perfect metadata', () => {
		const tags = generateTagsFromMetadata(baseMetadata, '')
		expect(tags).toEqual(['Optimized'])
	})

	it('should return "Missing Meta Description" if meta description is missing', () => {
		const metadata = { ...baseMetadata, metaDescription: '' }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Missing Meta Description')
	})

	it('should return "Missing Title Tag" if page title is missing', () => {
		const metadata = { ...baseMetadata, pageTitle: '' }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Missing Title Tag')
	})

	it('should return "No H1 Tag" if there are no H1 tags', () => {
		const metadata = { ...baseMetadata, h1Tags: [] }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('No H1 Tag')
	})

	it('should return "Multiple H1 Tags" if there are multiple H1 tags', () => {
		const metadata = { ...baseMetadata, h1Tags: ['H1 One', 'H1 Two'] }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Multiple H1 Tags')
	})

	it('should return "No Favicon" if favicon is missing', () => {
		const metadata = { ...baseMetadata, hasFavicon: false }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('No Favicon')
	})

	it('should return "No Images" if there are no images', () => {
		const metadata = { ...baseMetadata, imageCount: 0 }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('No Images')
	})

	it('should return "Title Too Short" if title is too short', () => {
		const metadata = { ...baseMetadata, titleLength: 20 }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Title Too Short')
	})

	it('should return "Title Too Long" if title is too long', () => {
		const metadata = { ...baseMetadata, titleLength: 70 }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Title Too Long')
	})

	it('should return "Description Too Short" if description is too short', () => {
		const metadata = { ...baseMetadata, descriptionLength: 100 }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Description Too Short')
	})

	it('should return "Description Too Long" if description is too long', () => {
		const metadata = { ...baseMetadata, descriptionLength: 170 }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Description Too Long')
	})

	it('should return "Critical Issues" if there are 2 or more critical issues', () => {
		const metadata = { ...baseMetadata, pageTitle: '', metaDescription: '' }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Critical Issues')
	})

	it('should return "Needs Improvement" if there are issues but not critical', () => {
		const metadata = { ...baseMetadata, hasFavicon: false, imageCount: 0 }
		const tags = generateTagsFromMetadata(metadata, '')
		expect(tags).toContain('Needs Improvement')
	})
})

describe('detectBusinessCategory', () => {
	const baseMetadata: Metadata = {
		pageTitle: '',
		metaDescription: '',
		h1Tags: [],
		hasFavicon: true,
		imageCount: 5,
		url: 'https://example.com'
	}

	it('should detect "E-commerce"', () => {
		const metadata = { ...baseMetadata, pageTitle: 'Shop for shoes' }
		const category = detectBusinessCategory(metadata, '', '')
		expect(category).toBe('E-commerce')
	})

	it('should detect "SaaS"', () => {
		const metadata = { ...baseMetadata, metaDescription: 'Our software as a service' }
		const category = detectBusinessCategory(metadata, '', '')
		expect(category).toBe('SaaS')
	})

	it('should detect "Blog/Content"', () => {
		const metadata = { ...baseMetadata, h1Tags: ['My Latest Blog Post'] }
		const category = detectBusinessCategory(metadata, '', '')
		expect(category).toBe('Blog/Content')
	})

	it('should detect "Portfolio"', () => {
		const metadata = { ...baseMetadata, pageTitle: 'My design portfolio' }
		const category = detectBusinessCategory(metadata, '', '')
		expect(category).toBe('Portfolio')
	})

	it('should detect "Healthcare"', () => {
		const aiFeedback = 'This is a clinic'
		const category = detectBusinessCategory(baseMetadata, aiFeedback, '')
		expect(category).toBe('Healthcare')
	})

	it('should return "Other" when no category is detected', () => {
		const category = detectBusinessCategory(baseMetadata, '', '')
		expect(category).toBe('Other')
	})
})
