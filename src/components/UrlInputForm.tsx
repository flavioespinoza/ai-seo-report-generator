'use client'

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

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
				className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-md"
			>
				<div>
					<label htmlFor="url-input" className="text-gray-900 mb-2 block text-lg font-semibold">
						Website URL
					</label>

					<div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
						<div className="min-w-0 flex-1">
							<input
								ref={inputRef}
								id="url-input"
								type="text"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								placeholder="https://example.com or example.com"
								className="text-gray-800 inset-shadow-sm inset-shadow-blue-500 w-full rounded-md border border-[#bdbdbd] bg-blue-100 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								disabled={loading}
								required
							/>
						</div>

						<div className="mt-3 flex-shrink-0 sm:mt-0">
							<button
								type="submit"
								disabled={loading}
								className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
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
