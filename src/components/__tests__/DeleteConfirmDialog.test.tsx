import { render, screen, fireEvent } from '@testing-library/react'
import DeleteConfirmDialog from '../DeleteConfirmDialog'
import { within } from '@testing-library/dom'

describe('DeleteConfirmDialog', () => {
  it('renders with default props', () => {
    const onConfirm = jest.fn()
    render(<DeleteConfirmDialog onConfirm={onConfirm} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('opens the dialog when the trigger is clicked', () => {
    const onConfirm = jest.fn()
    render(<DeleteConfirmDialog onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Report?')).toBeInTheDocument()
  })

  it('calls onConfirm and closes the dialog when the delete button is clicked', () => {
    const onConfirm = jest.fn()
    render(<DeleteConfirmDialog onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Delete'))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByText('Delete'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the dialog when the cancel button is clicked', () => {
    const onConfirm = jest.fn()
    render(<DeleteConfirmDialog onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByText('Cancel'))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders with custom labels', () => {
    const onConfirm = jest.fn()
    render(
      <DeleteConfirmDialog
        onConfirm={onConfirm}
        triggerLabel="Remove"
        title="Confirm Removal"
        description="Are you sure?"
      />
    )
    fireEvent.click(screen.getByText('Remove'))
    expect(screen.getByText('Confirm Removal')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders with a custom trigger component', () => {
    const onConfirm = jest.fn()
    render(
      <DeleteConfirmDialog
        onConfirm={onConfirm}
        trigger={<button>Custom Trigger</button>}
      />
    )
    fireEvent.click(screen.getByText('Custom Trigger'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
