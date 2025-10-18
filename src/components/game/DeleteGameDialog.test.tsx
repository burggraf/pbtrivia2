import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { DeleteGameDialog } from './DeleteGameDialog'
import type { GameRecord } from '@/lib/pocketbase'

describe('DeleteGameDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  const mockGame: GameRecord = {
    id: '1',
    collectionId: 'pbc_4009211000',
    collectionName: 'games',
    host: 'user1',
    name: 'Trivia Night',
    code: 'ABC123',
    status: 'not_started',
    currentRound: 0
  }

  it('should not render when closed', () => {
    render(
      <DeleteGameDialog
        game={null}
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument()
  })

  it('should display game name in confirmation message', () => {
    render(
      <DeleteGameDialog
        game={mockGame}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/delete 'Trivia Night'/i)).toBeInTheDocument()
  })

  it('should display warning about cascading deletes', () => {
    render(
      <DeleteGameDialog
        game={mockGame}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(
      screen.getByText(/permanently delete the game and all related data/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
  })

  it('should call onConfirm when Delete button clicked', async () => {
    const user = userEvent.setup()
    mockOnConfirm.mockResolvedValue(undefined)

    render(
      <DeleteGameDialog
        game={mockGame}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /^delete$/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith(mockGame)
    })
  })

  it('should call onCancel when Cancel button clicked', async () => {
    const user = userEvent.setup()
    render(
      <DeleteGameDialog
        game={mockGame}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should disable buttons while loading', async () => {
    const user = userEvent.setup()
    mockOnConfirm.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    render(
      <DeleteGameDialog
        game={mockGame}
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /^delete$/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deleteButton).toBeDisabled()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
    })
  })
})
