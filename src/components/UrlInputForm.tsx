'use client'

import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react'

export interface UrlInputFormRef {
  focusInput: () => void
  clearInput: () => void
}

interface UrlInputFormProps {
  onAnalyze: (url: string) => void
  loading?: boolean
}

const UrlInputForm = forwardRef<UrlInputFormRef, UrlInputFormProps>(
  ({ onAnalyze, loading = false }, ref) => {
    const [url, setUrl] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus()
      },
      clearInput: () => {
        setUrl('')
      }
    }))

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      let normalizedUrl = url.trim()
      if (!normalizedUrl || loading) return

      // Automatically add https:// if missing
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`
      }

      onAnalyze(normalizedUrl)
    }

    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="url-input"
            className="block text-lg font-semibold text-gray-900 mb-2"
          >
            Website URL
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="flex-1 min-w-0">
              <input
                ref={inputRef}
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com or example.com"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
                required
              />
            </div>

            <div className="flex-shrink-0 mt-3 sm:mt-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 text-white font-medium px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze SEO'}
              </button>
            </div>
          </div>

          <p className="text-gray-600 mt-2 text-sm">
            Enter any website URL to receive a comprehensive SEO analysis powered by AI
          </p>
        </div>
      </form>
    )
  }
)

UrlInputForm.displayName = 'UrlInputForm'
export default UrlInputForm
