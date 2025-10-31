import React from 'react'

interface ExternalLinkProps {
	href: string
	children: React.ReactNode
	className?: string
	target?: '_blank' | '_self' | '_parent' | '_top'
	rel?: string
}

/**
 * A reusable anchor tag component for external links.
 * It automatically sets `rel="noopener noreferrer"` for security and allows
 * customization of the target attribute.
 *
 * @param {ExternalLinkProps} props - The props for the component.
 * @param {string} props.href - The URL the link should point to.
 * @param {React.ReactNode} props.children - The content to be displayed inside the link.
 * @param {string} [props.className=''] - Optional CSS classes to apply to the link.
 * @param {'_blank' | '_self' | '_parent' | '_top'} [props.target='_blank'] - The target attribute for the link.
 * @returns {JSX.Element} The rendered external link component.
 */
export default function ExternalLink({
	href,
	children,
	className = '',
	...rest
}: ExternalLinkProps) {
	return (
		<a href={href} target={rest.target} rel="noopener noreferrer" className={className}>
			{children}
		</a>
	)
}
