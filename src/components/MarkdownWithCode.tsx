'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighterBase } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'

interface MarkdownWithCodeProps {
	markdown: string
}

/**
 * A component that renders Markdown content with syntax highlighting for code blocks.
 * It uses `react-markdown` to parse the Markdown and `react-syntax-highlighter` for code blocks,
 * and adds a "Copy" button to each code block.
 *
 * @param {MarkdownWithCodeProps} props - The props for the component.
 * @param {string} props.markdown - The Markdown string to render.
 * @returns {JSX.Element} The rendered Markdown content.
 */
const MarkdownWithCode: React.FC<MarkdownWithCodeProps> = ({ markdown }) => {
	const CodeBlock = ({ node, inline, className, children, ...props }: any): JSX.Element => {
		const match = /language-(\w+)/.exec(className || '')
		const language = match ? match[1] : null
		const [copied, setCopied] = useState(false)

		const handleCopy = () => {
			navigator.clipboard.writeText(String(children)).then(() => {
				setCopied(true)
				setTimeout(() => setCopied(false), 4000)
			})
		}

		const SyntaxHighlighter = SyntaxHighlighterBase as unknown as React.ComponentType<any>

		if (!inline && language) {
			return (
				<div className="overflow-hidden rounded-md border border-zinc-200">
					<div className="flex items-center justify-between bg-sage-600 px-3 font-mono text-[10px] text-white">
						<span>{language}</span>
						<button className="btn-secondary" onClick={handleCopy}>
							{copied ? (
								<div className="flex">
									<Check className="h-3.5 w-3 text-white" />
									<div className="ml-1 text-[10px] text-white">Copied</div>
								</div>
							) : (
								<div className="flex">
									<Copy className="h-3.5 w-3 text-white" />
									<div className="ml-1 text-[10px] text-white">Copy</div>
								</div>
							)}
						</button>
					</div>
					<SyntaxHighlighter
						style={vscDarkPlus}
						language={language}
						PreTag="div"
						customStyle={{
							margin: 0,
							padding: '1rem',
							fontSize: '0.875rem'
						}}
						{...props}
					>
						<div id="parent">{String(children).replace(/\n$/, '')}</div>
					</SyntaxHighlighter>
				</div>
			)
		}

		return (
			<code className={className} {...props}>
				{children}
			</code>
		)
	}

	return (
		<div className="markdown-parent-element">
			<ReactMarkdown
				components={{
					code: CodeBlock
				}}
			>
				{markdown}
			</ReactMarkdown>
		</div>
	)
}

export default MarkdownWithCode
