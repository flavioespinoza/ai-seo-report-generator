import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@flavioespinoza/salsa-ui'
import { AlertCircle, X } from 'lucide-react'

interface ErrorAlertProps {
	message: string
	onDismiss?: () => void
}

export default function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
	const [open, setOpen] = React.useState(true)

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen)
		if (!isOpen && onDismiss) {
			onDismiss()
		}
	}

	return (
		<Dialog.Root open={open} onOpenChange={handleOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black/50" />
				<Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
					<div className="bg-red-100 p-6">
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3">
								<AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
								<Dialog.Title className="text-lg font-semibold text-red-600">Error</Dialog.Title>
							</div>
							<Dialog.Close className="flex-shrink-0 text-gray-400 transition hover:text-red-600">
								<X className="h-5 w-5 text-red-600" />
							</Dialog.Close>
						</div>

						{/* Wrapped message in scrollable div */}
						<Dialog.Description className="mt-4 text-sm text-red-600">
							<div className="overflow-hidden">{message}</div>
						</Dialog.Description>

						<div className="mt-6 flex justify-end">
							<Dialog.Close asChild>
								<Button variant="default" className="btn-danger">
									Close
								</Button>
							</Dialog.Close>
						</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
