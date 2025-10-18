import { useState, useCallback } from 'react'
import { pocketBase } from '@/lib/pocketbase'
import { createGame as createGameService, updateGame as updateGameService, deleteGame as deleteGameService } from '@/services/gameService'
import type { GameRecord } from '@/lib/pocketbase'
import type { GameUpdate } from '@/services/gameService'

/**
 * Hook for game mutations (create, update, delete).
 * Provides loading and error states for each operation.
 */
export const useGameMutation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createGame = useCallback(async (name: string, code: string): Promise<GameRecord> => {
    try {
      setIsLoading(true)
      setError(null)
      const game = await createGameService(pocketBase, name, code)
      return game
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create game')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateGame = useCallback(async (id: string, updates: GameUpdate): Promise<GameRecord> => {
    try {
      setIsLoading(true)
      setError(null)
      const game = await updateGameService(pocketBase, id, updates)
      return game
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update game')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteGame = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      await deleteGameService(pocketBase, id)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete game')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    createGame,
    updateGame,
    deleteGame
  }
}
