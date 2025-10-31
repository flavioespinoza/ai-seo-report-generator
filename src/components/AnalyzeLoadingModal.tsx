'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'

interface AnalyzeLoadingModalProps {
	open: boolean
}

/**
 * A modal component that displays a loading spinner and message during SEO analysis.
 * It uses Radix UI's Dialog to create an accessible and unstyled modal foundation.
 *
 * @param {AnalyzeLoadingModalProps} props - The props for the component.
 * @param {boolean} props.open - A boolean that controls whether the modal is visible.
 * @returns {JSX.Element} The rendered modal component.
 */
export default function AnalyzeLoadingModal({ open }: AnalyzeLoadingModalProps) {
	return (
		<Dialog.Root open={open}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 text-center shadow-lg dark:bg-zinc-900">
					<div className="flex flex-col items-center justify-center space-y-4">
						<Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
						<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
							Analyzing SEO Report
						</h2>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							This can take up to a minute. Please wait while we analyze your page...
						</p>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
