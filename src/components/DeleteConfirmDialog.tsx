'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface DeleteConfirmDialogProps {
	onConfirm: () => void
	triggerLabel?: string
	title?: string
	description?: string
	/** Optional custom trigger (icon/button). If provided, it's rendered asChild. */
	trigger?: React.ReactNode
}

export default function DeleteConfirmDialog({
	onConfirm,
	triggerLabel = 'Delete',
	title = 'Delete Report?',
	description = 'Are you sure you want to delete this report? This action cannot be undone.',
	trigger
}: DeleteConfirmDialogProps) {
	const [open, setOpen] = useState(false)

	const handleConfirm = () => {
		onConfirm()
		setOpen(false)
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			{trigger ? (
				<Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
			) : (
				<Dialog.Trigger asChild>
					<button className="btn-primary">{triggerLabel}</button>
				</Dialog.Trigger>
			)}

			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-fadeIn fixed inset-0 bg-black/40" />
				<Dialog.Content className="data-[state=open]:animate-fadeIn fixed left-1/2 top-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none">
					<Dialog.Title className="mb-2 text-lg font-semibold text-gray-900">{title}</Dialog.Title>
					<Dialog.Description className="mb-6 text-sm text-gray-600">
						{description}
					</Dialog.Description>

					<div className="flex justify-end gap-3">
						<Dialog.Close asChild>
							<button className="btn-primary">Cancel</button>
						</Dialog.Close>
						<button onClick={handleConfirm} className="btn-danger">
							Delete
						</button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
