import React from 'react'

interface ExternalLinkProps {
	href: string
	children: React.ReactNode
	className?: string
	target?: '_blank' | '_self' | '_parent' | '_top'
	rel?: string
}

export default function ExternalLink({ href, children, className = '', ...rest }: ExternalLinkProps) {
	return (
		<a
			href={href}
			target={rest.target}
			rel="noopener noreferrer"
			className={className}
		>
			{children}
		</a>
	)
}