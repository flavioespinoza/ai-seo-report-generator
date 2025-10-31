import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RecoilProvider from '@/components/providers/RecoilProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'SEO Report Generator - AI-Powered Website Analysis',
	description: 'Generate comprehensive SEO reports for any website using AI-powered analysis'
}

/**
 * The root layout for the application.
 * It sets up the basic HTML structure, applies the Inter font, and wraps the
 * application content in a RecoilProvider for state management.
 *
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<RecoilProvider>{children}</RecoilProvider>
			</body>
		</html>
	)
}
