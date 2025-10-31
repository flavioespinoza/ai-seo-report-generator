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

/**
 * A form component for inputting a URL to be analyzed.
 * It includes a text input for the URL and a submit button. The form handles
 * URL normalization (adding "https://" if missing) and provides methods to focus
 * and clear the input field via a ref.
 *
 * @param {UrlInputFormProps} props - The props for the component.
 * @param {(url: string) => void} props.onAnalyze - The function to call when the form is submitted with a valid URL.
 * @param {boolean} [props.loading=false] - A boolean to indicate if an analysis is currently in progress, which disables the form.
 * @param {React.Ref<UrlInputFormRef>} ref - A ref that exposes methods to interact with the component.
 * @returns {JSX.Element} The rendered URL input form.
 */
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

			if (!/^https?:\/\//i.test(normalizedUrl)) {
				normalizedUrl = `https://${normalizedUrl}`
			}

			onAnalyze(normalizedUrl)
		}

		return (
			<form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6">
				<div>
					<label
						htmlFor="url-input"
						className="mb-2 block text-base font-semibold text-[var(--foreground)]"
					>
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
								className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] placeholder-gray-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] dark:bg-zinc-800 dark:placeholder-gray-500"
								disabled={loading}
								required
							/>
						</div>

						<div className="mt-3 flex-shrink-0 sm:mt-0">
							<button
								type="submit"
								disabled={loading}
								className={`btn-primary w-full sm:w-auto ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
							>
								{loading ? 'Analyzing...' : 'Analyze SEO'}
							</button>
						</div>
					</div>

					<p className="mt-3 text-sm text-[var(--muted-foreground)]">
						Enter any website URL to receive a comprehensive SEO analysis powered by AI.
					</p>
				</div>
			</form>
		)
	}
)

UrlInputForm.displayName = 'UrlInputForm'
export default UrlInputForm
