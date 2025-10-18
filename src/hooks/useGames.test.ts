import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGames } from './useGames'
import * as gameService from '@/services/gameService'

vi.mock('@/services/gameService')

describe('useGames', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch games on mount', async () => {
    const mockGames = [
      {
        id: '1',
        collectionId: 'pbc_4009211000',
        collectionName: 'games' as const,
        host: 'user1',
        name: 'Game 1',
        code: 'ABC123',
        status: 'not_started',
        currentRound: 0
      }
    ]

    vi.mocked(gameService.listGames).mockResolvedValue(mockGames)

    const { result } = renderHook(() => useGames())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.games).toEqual([])

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.games).toEqual(mockGames)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors', async () => {
    const error = new Error('Failed to fetch games')
    vi.mocked(gameService.listGames).mockRejectedValue(error)

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.games).toEqual([])
    expect(result.current.error).toBe(error)
  })

  it('should support manual refresh', async () => {
    const mockGames = [
      {
        id: '1',
        collectionId: 'pbc_4009211000',
        collectionName: 'games' as const,
        host: 'user1',
        name: 'Game 1',
        code: 'ABC123',
        status: 'not_started',
        currentRound: 0
      }
    ]

    vi.mocked(gameService.listGames).mockResolvedValue(mockGames)

    const { result } = renderHook(() => useGames())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(gameService.listGames).toHaveBeenCalledTimes(1)

    // Trigger manual refresh
    await waitFor(async () => {
      result.current.refresh()
      expect(gameService.listGames).toHaveBeenCalledTimes(2)
    })
  })
})
