import React, { useState } from 'react'

interface UrlInputFormProps {
	onAnalyze: (url: string) => void
	loading: boolean
}

export default function UrlInputForm({ onAnalyze, loading }: UrlInputFormProps) {
	const [url, setUrl] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (!url.trim()) {
			setError('Please enter a URL')
			return
		}

		try {
			new URL(url.startsWith('http') ? url : `https://${url}`)
			onAnalyze(url)
		} catch {
			setError('Please enter a valid URL')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
			<div className="rounded-lg bg-white p-6 shadow-md">
				<label htmlFor="url-input" className="text-gray-700 mb-2 block text-sm font-medium">
					Website URL
				</label>
				<div className="flex gap-3">
					<input
						id="url-input"
						type="text"
						value={url}
						onChange={(e) => {
							setUrl(e.target.value)
							setError('')
						}}
						placeholder="https://example.com or example.com"
						className="border-gray-300 flex-1 rounded-lg border px-4 py-3 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Analyzing...
							</span>
						) : (
							'Analyze SEO'
						)}
					</button>
				</div>
				{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
				<p className="text-gray-500 mt-3 text-sm">
					Enter any website URL to receive a comprehensive SEO analysis powered by AI
				</p>
			</div>
		</form>
	)
}
