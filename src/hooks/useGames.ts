import { useState, useEffect, useCallback } from 'react'
import { pocketBase } from '@/lib/pocketbase'
import { listGames } from '@/services/gameService'
import type { GameRecord } from '@/lib/pocketbase'

/**
 * Hook for fetching and managing the game list.
 * Automatically fetches games on mount and provides a manual refresh function.
 */
export const useGames = () => {
  const [games, setGames] = useState<GameRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchGames = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedGames = await listGames(pocketBase)
      setGames(fetchedGames)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch games'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  return {
    games,
    isLoading,
    error,
    refresh: fetchGames
  }
}
