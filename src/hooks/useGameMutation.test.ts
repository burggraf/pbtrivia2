import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useGameMutation } from './useGameMutation'
import * as gameService from '@/services/gameService'
import type { GameRecord } from '@/lib/pocketbase'

vi.mock('@/services/gameService')

describe('useGameMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockGame: GameRecord = {
    id: '1',
    collectionId: 'pbc_4009211000',
    collectionName: 'games',
    host: 'user1',
    name: 'Test Game',
    code: 'ABC123',
    status: 'not_started',
    currentRound: 0
  }

  describe('createGame', () => {
    it('should create a game successfully', async () => {
      vi.mocked(gameService.createGame).mockResolvedValue(mockGame)

      const { result } = renderHook(() => useGameMutation())

      expect(result.current.isLoading).toBe(false)

      let createdGame: GameRecord | undefined

      await act(async () => {
        createdGame = await result.current.createGame('Test Game', 'ABC123')
      })

      expect(result.current.isLoading).toBe(false)
      expect(createdGame).toEqual(mockGame)
      expect(result.current.error).toBeNull()
    })

    it('should handle create errors', async () => {
      const error = new Error('Failed to create game')
      vi.mocked(gameService.createGame).mockRejectedValue(error)

      const { result } = renderHook(() => useGameMutation())

      await act(async () => {
        try {
          await result.current.createGame('Test Game', 'ABC123')
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBe(error)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('updateGame', () => {
    it('should update a game successfully', async () => {
      const updatedGame = { ...mockGame, name: 'Updated Game' }
      vi.mocked(gameService.updateGame).mockResolvedValue(updatedGame)

      const { result } = renderHook(() => useGameMutation())

      let updated: GameRecord | undefined

      await act(async () => {
        updated = await result.current.updateGame('1', { name: 'Updated Game' })
      })

      expect(result.current.isLoading).toBe(false)
      expect(updated).toEqual(updatedGame)
      expect(result.current.error).toBeNull()
    })

    it('should handle update errors', async () => {
      const error = new Error('Failed to update game')
      vi.mocked(gameService.updateGame).mockRejectedValue(error)

      const { result } = renderHook(() => useGameMutation())

      await act(async () => {
        try {
          await result.current.updateGame('1', { name: 'Updated Game' })
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBe(error)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('deleteGame', () => {
    it('should delete a game successfully', async () => {
      vi.mocked(gameService.deleteGame).mockResolvedValue(undefined)

      const { result } = renderHook(() => useGameMutation())

      await act(async () => {
        await result.current.deleteGame('1')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should handle delete errors', async () => {
      const error = new Error('Failed to delete game')
      vi.mocked(gameService.deleteGame).mockRejectedValue(error)

      const { result } = renderHook(() => useGameMutation())

      await act(async () => {
        try {
          await result.current.deleteGame('1')
        } catch (e) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.error).toBe(error)
      })

      expect(result.current.isLoading).toBe(false)
    })
  })
})
