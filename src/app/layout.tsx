import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RecoilProvider from '@/components/providers/RecoilProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'SEO Report Generator - AI-Powered Website Analysis',
	description: 'Generate comprehensive SEO reports for any website using AI-powered analysis'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<RecoilProvider>{children}</RecoilProvider>
			</body>
		</html>
	)
}
