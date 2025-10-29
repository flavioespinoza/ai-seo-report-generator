import React from 'react'
import ErrorAlert from '@/components/ErrorAlert'
import ReportHistory from '@/components/ReportHistory'
import SeoReport from '@/components/SeoReport'
import UrlInputForm from '@/components/UrlInputForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('UrlInputForm', () => {
	it('renders input and button', () => {
		const mockOnAnalyze = jest.fn()
		render(<UrlInputForm onAnalyze={mockOnAnalyze} loading={false} />)

		expect(screen.getByPlaceholderText(/example.com/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /analyze seo/i })).toBeInTheDocument()
	})

	it('calls onAnalyze with URL when form is submitted', async () => {
		const mockOnAnalyze = jest.fn()
		const user = userEvent.setup()

		render(<UrlInputForm onAnalyze={mockOnAnalyze} loading={false} />)

		const input = screen.getByPlaceholderText(/example.com/i)
		const button = screen.getByRole('button', { name: /analyze seo/i })

		await user.type(input, 'https://example.com')
		await user.click(button)

		expect(mockOnAnalyze).toHaveBeenCalledWith('https://example.com')
	})

	it('shows error for empty URL', async () => {
		const mockOnAnalyze = jest.fn()
		const user = userEvent.setup()

		render(<UrlInputForm onAnalyze={mockOnAnalyze} loading={false} />)

		const button = screen.getByRole('button', { name: /analyze seo/i })
		await user.click(button)

		expect(screen.getByText(/please enter a url/i)).toBeInTheDocument()
		expect(mockOnAnalyze).not.toHaveBeenCalled()
	})

	it('shows error for invalid URL', async () => {
		const mockOnAnalyze = jest.fn()
		const user = userEvent.setup()

		render(<UrlInputForm onAnalyze={mockOnAnalyze} loading={false} />)

		const input = screen.getByPlaceholderText(/example.com/i)
		const button = screen.getByRole('button', { name: /analyze seo/i })

		await user.type(input, 'not a valid url')
		await user.click(button)

		expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument()
		expect(mockOnAnalyze).not.toHaveBeenCalled()
	})

	it('disables input and button when loading', () => {
		const mockOnAnalyze = jest.fn()
		render(<UrlInputForm onAnalyze={mockOnAnalyze} loading={true} />)

		expect(screen.getByPlaceholderText(/example.com/i)).toBeDisabled()
		expect(screen.getByRole('button')).toBeDisabled()
		expect(screen.getByText(/analyzing/i)).toBeInTheDocument()
	})
})

describe('SeoReport', () => {
	const mockReport = {
		id: 1,
		url: 'https://example.com',
		metadata: {
			pageTitle: 'Example Website',
			metaDescription: 'This is an example website',
			metaKeywords: 'example, website',
			h1Tags: ['Main Heading', 'Secondary Heading'],
			imageCount: 5,
			hasFavicon: true,
			titleLength: 15,
			descriptionLength: 27
		},
		aiFeedback: 'This is AI feedback about the website.',
		createdAt: '2024-01-01T00:00:00Z'
	}

	it('renders report with all metadata', () => {
		render(<SeoReport report={mockReport} />)

		expect(screen.getByText('SEO Analysis Report')).toBeInTheDocument()
		expect(screen.getByText('https://example.com')).toBeInTheDocument()
		expect(screen.getByText('Example Website')).toBeInTheDocument()
		expect(screen.getByText('This is an example website')).toBeInTheDocument()
		expect(screen.getByText('Main Heading')).toBeInTheDocument()
		expect(screen.getByText('Secondary Heading')).toBeInTheDocument()
		expect(screen.getByText('This is AI feedback about the website.')).toBeInTheDocument()
	})

	it('displays missing metadata appropriately', () => {
		const reportWithMissingData = {
			...mockReport,
			metadata: {
				...mockReport.metadata,
				pageTitle: null,
				metaDescription: null,
				h1Tags: []
			}
		}

		render(<SeoReport report={reportWithMissingData} />)

		expect(screen.getByText('No title found')).toBeInTheDocument()
		expect(screen.getByText('No description found')).toBeInTheDocument()
		expect(screen.getByText('No H1 tags found')).toBeInTheDocument()
	})

	it('calls onExport when export button is clicked', async () => {
		const mockOnExport = jest.fn()
		const user = userEvent.setup()

		render(<SeoReport report={mockReport} onExport={mockOnExport} />)

		const exportButton = screen.getByRole('button', { name: /export report/i })
		await user.click(exportButton)

		expect(mockOnExport).toHaveBeenCalled()
	})
})

describe('ReportHistory', () => {
	const mockReports = [
		{
			id: 1,
			url: 'https://example1.com',
			pageTitle: 'Example 1',
			metaDescription: 'Description 1',
			createdAt: '2024-01-01T00:00:00Z',
			hasIssues: false
		},
		{
			id: 2,
			url: 'https://example2.com',
			pageTitle: 'Example 2',
			metaDescription: null,
			createdAt: '2024-01-02T00:00:00Z',
			hasIssues: true
		}
	]

	it('renders list of reports', () => {
		const mockOnSelect = jest.fn()
		const mockOnDelete = jest.fn()

		render(
			<ReportHistory
				reports={mockReports}
				onSelectReport={mockOnSelect}
				onDeleteReport={mockOnDelete}
			/>
		)

		expect(screen.getByText('Example 1')).toBeInTheDocument()
		expect(screen.getByText('Example 2')).toBeInTheDocument()
		expect(screen.getByText(/2 reports/i)).toBeInTheDocument()
	})

	it('shows issues badge for reports with issues', () => {
		const mockOnSelect = jest.fn()
		const mockOnDelete = jest.fn()

		render(
			<ReportHistory
				reports={mockReports}
				onSelectReport={mockOnSelect}
				onDeleteReport={mockOnDelete}
			/>
		)

		expect(screen.getByText('Issues Found')).toBeInTheDocument()
	})

	it('calls onSelectReport when report is clicked', async () => {
		const mockOnSelect = jest.fn()
		const mockOnDelete = jest.fn()
		const user = userEvent.setup()

		render(
			<ReportHistory
				reports={mockReports}
				onSelectReport={mockOnSelect}
				onDeleteReport={mockOnDelete}
			/>
		)

		await user.click(screen.getByText('Example 1'))
		expect(mockOnSelect).toHaveBeenCalledWith(1)
	})

	it('shows empty state when no reports', () => {
		const mockOnSelect = jest.fn()
		const mockOnDelete = jest.fn()

		render(
			<ReportHistory reports={[]} onSelectReport={mockOnSelect} onDeleteReport={mockOnDelete} />
		)

		expect(screen.getByText('No reports yet')).toBeInTheDocument()
	})

	it('shows loading state', () => {
		const mockOnSelect = jest.fn()
		const mockOnDelete = jest.fn()

		render(
			<ReportHistory
				reports={[]}
				onSelectReport={mockOnSelect}
				onDeleteReport={mockOnDelete}
				loading={true}
			/>
		)

		expect(screen.getByText('Report History')).toBeInTheDocument()
	})
})

describe('ErrorAlert', () => {
	it('renders error message', () => {
		render(<ErrorAlert message="Test error message" />)

		expect(screen.getByText('Error')).toBeInTheDocument()
		expect(screen.getByText('Test error message')).toBeInTheDocument()
	})

	it('calls onDismiss when close button is clicked', async () => {
		const mockOnDismiss = jest.fn()
		const user = userEvent.setup()

		render(<ErrorAlert message="Test error" onDismiss={mockOnDismiss} />)

		const closeButtons = screen.getAllByRole('button')
		await user.click(closeButtons[0])

		expect(mockOnDismiss).toHaveBeenCalled()
	})
})
