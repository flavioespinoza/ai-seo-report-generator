import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UrlInputForm from '@/components/UrlInputForm'
import ExportButtons from '@/components/ExportButtons'

describe('UrlInputForm', () => {
  it('renders input and button correctly', () => {
    const mockOnAnalyze = jest.fn()
    render(<UrlInputForm onAnalyze={mockOnAnalyze} />)
    expect(screen.getByLabelText(/Website URL/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Analyze SEO/i })).toBeInTheDocument()
  })

  it('calls onAnalyze with normalized URL (adds https if missing)', async () => {
    const mockOnAnalyze = jest.fn()
    render(<UrlInputForm onAnalyze={mockOnAnalyze} />)

    const input = screen.getByLabelText(/Website URL/i)
    const button = screen.getByRole('button', { name: /Analyze SEO/i })

    // line 42 (updated)
    fireEvent.change(input, { target: { value: 'balls.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      // line 58 (updated)
      expect(mockOnAnalyze).toHaveBeenCalledWith('https://balls.com')
    })
  })

  it('does not call onAnalyze if input is empty', async () => {
    const mockOnAnalyze = jest.fn()
    render(<UrlInputForm onAnalyze={mockOnAnalyze} />)
    const button = screen.getByRole('button', { name: /Analyze SEO/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(mockOnAnalyze).not.toHaveBeenCalled()
    })
  })
})

describe('ExportButtons', () => {
  it('renders export buttons and new search button', () => {
    const mockExportMarkdown = jest.fn()
    const mockExportPDF = jest.fn()
    const mockNewSearch = jest.fn()

    render(
      <ExportButtons
        onExportMarkdown={mockExportMarkdown}
        onExportPDF={mockExportPDF}
        onNewSearch={mockNewSearch}
      />
    )

    expect(screen.getByRole('button', { name: /Export as Markdown/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Export as PDF/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Search/i })).toBeInTheDocument()
  })

  it('calls the correct handlers when buttons are clicked', () => {
    const mockExportMarkdown = jest.fn()
    const mockExportPDF = jest.fn()
    const mockNewSearch = jest.fn()

    render(
      <ExportButtons
        onExportMarkdown={mockExportMarkdown}
        onExportPDF={mockExportPDF}
        onNewSearch={mockNewSearch}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Export as Markdown/i }))
    fireEvent.click(screen.getByRole('button', { name: /Export as PDF/i }))
    fireEvent.click(screen.getByRole('button', { name: /New Search/i }))

    expect(mockExportMarkdown).toHaveBeenCalledTimes(1)
    expect(mockExportPDF).toHaveBeenCalledTimes(1)
    expect(mockNewSearch).toHaveBeenCalledTimes(1)
  })
})
