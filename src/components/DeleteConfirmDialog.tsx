'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'

interface DeleteConfirmDialogProps {
  onConfirm: () => void
  triggerLabel?: string
  title?: string
  description?: string
}

export default function DeleteConfirmDialog({
  onConfirm,
  triggerLabel = 'Delete',
  title = 'Delete Report?',
  description = 'Are you sure you want to delete this report? This action cannot be undone.'
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className="text-red-600 hover:text-red-800 font-medium text-sm transition"
        >
          {triggerLabel}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 data-[state=open]:animate-fadeIn" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-fadeIn"
        >
          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-6">
            {description}
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
