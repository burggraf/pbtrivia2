import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { GameForm } from './GameForm'
import type { GameRecord } from '@/lib/pocketbase'

describe('GameForm', () => {
  const mockOnSubmit = vi.fn()
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

  it('should render empty form for create mode', () => {
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText(/game name/i)).toHaveValue('')
    expect(screen.getByLabelText(/game code/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create game/i })).toBeInTheDocument()
  })

  it('should render populated form for edit mode', () => {
    render(<GameForm game={mockGame} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText(/game name/i)).toHaveValue('Trivia Night')
    expect(screen.getByLabelText(/game code/i)).toHaveValue('ABC123')
    expect(screen.getByRole('button', { name: /update game/i })).toBeInTheDocument()
  })

  it('should show validation error for empty name', async () => {
    const user = userEvent.setup()
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const submitButton = screen.getByRole('button', { name: /create game/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/game name is required/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid code format', async () => {
    const user = userEvent.setup()
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/game name/i)
    const codeInput = screen.getByLabelText(/game code/i)

    await user.type(nameInput, 'Test Game')
    await user.type(codeInput, 'abc')

    const submitButton = screen.getByRole('button', { name: /create game/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/game code must be 4-12 uppercase letters and numbers only/i)
      ).toBeInTheDocument()
    })
  })

  it('should call onSubmit with valid data', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue(undefined)

    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/game name/i)
    const codeInput = screen.getByLabelText(/game code/i)

    await user.type(nameInput, 'Test Game')
    await user.type(codeInput, 'TEST123')

    const submitButton = screen.getByRole('button', { name: /create game/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Test Game', code: 'TEST123' })
    })
  })

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    render(<GameForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/game name/i)
    const codeInput = screen.getByLabelText(/game code/i)

    await user.type(nameInput, 'Test Game')
    await user.type(codeInput, 'TEST123')

    const submitButton = screen.getByRole('button', { name: /create game/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
