import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { GameList } from './GameList'
import type { GameRecord } from '@/lib/pocketbase'

describe('GameList', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const mockGames: GameRecord[] = [
    {
      id: '1',
      collectionId: 'pbc_4009211000',
      collectionName: 'games',
      host: 'user1',
      name: 'Trivia Night',
      code: 'ABC123',
      status: 'not_started',
      currentRound: 0
    },
    {
      id: '2',
      collectionId: 'pbc_4009211000',
      collectionName: 'games',
      host: 'user1',
      name: 'Friday Quiz',
      code: 'XYZ789',
      status: 'in_progress',
      currentRound: 2
    }
  ]

  it('should display empty state when no games exist', () => {
    render(<GameList games={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText(/No games yet/i)).toBeInTheDocument()
    expect(screen.getByText(/Create your first game/i)).toBeInTheDocument()
  })

  it('should display list of games', () => {
    render(<GameList games={mockGames} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('Trivia Night')).toBeInTheDocument()
    expect(screen.getByText(/ABC123/)).toBeInTheDocument()
    expect(screen.getByText('Friday Quiz')).toBeInTheDocument()
    expect(screen.getByText(/XYZ789/)).toBeInTheDocument()
  })

  it('should display game status', () => {
    render(<GameList games={mockGames} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText(/not_started/)).toBeInTheDocument()
    expect(screen.getByText(/in_progress/)).toBeInTheDocument()
  })

  it('should display Edit and Delete buttons for each game', () => {
    render(<GameList games={mockGames} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })

    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('should call onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<GameList games={mockGames} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    await user.click(editButtons[0])

    expect(mockOnEdit).toHaveBeenCalledWith(mockGames[0])
  })

  it('should call onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<GameList games={mockGames} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(mockOnDelete).toHaveBeenCalledWith(mockGames[0])
  })
})
