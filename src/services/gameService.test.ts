import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listGames, createGame, updateGame, deleteGame } from './gameService'
import type { PocketBaseClient } from '@/lib/pocketbase'

// Mock PocketBase client
const createMockPB = () => {
  const mockCollection = {
    getFullList: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }

  return {
    collection: vi.fn(() => mockCollection),
    authStore: {
      record: { id: 'test-user-id' }
    },
    _mockCollection: mockCollection
  } as unknown as PocketBaseClient & { _mockCollection: typeof mockCollection }
}

describe('gameService', () => {
  let mockPB: ReturnType<typeof createMockPB>

  beforeEach(() => {
    mockPB = createMockPB()
    vi.clearAllMocks()
  })

  describe('listGames', () => {
    it('should fetch all games for the authenticated host', async () => {
      const mockGames = [
        {
          id: '1',
          collectionName: 'games',
          host: 'test-user-id',
          name: 'Trivia Night',
          code: 'ABC123',
          status: 'not_started',
          currentRound: 0,
          created: '2025-01-01T00:00:00.000Z',
          updated: '2025-01-01T00:00:00.000Z'
        }
      ]

      mockPB._mockCollection.getFullList.mockResolvedValue(mockGames)

      const games = await listGames(mockPB)

      expect(mockPB.collection).toHaveBeenCalledWith('games')
      expect(mockPB._mockCollection.getFullList).toHaveBeenCalledWith({
        sort: '-id'
      })
      expect(games).toEqual(mockGames)
    })

    it('should return empty array when no games exist', async () => {
      mockPB._mockCollection.getFullList.mockResolvedValue([])

      const games = await listGames(mockPB)

      expect(games).toEqual([])
    })

    it('should throw error when not authenticated', async () => {
      const unauthPB = {
        ...mockPB,
        authStore: { record: null }
      } as unknown as PocketBaseClient

      await expect(listGames(unauthPB)).rejects.toThrow('User must be authenticated')
    })
  })

  describe('createGame', () => {
    it('should create a new game with valid inputs', async () => {
      const mockGame = {
        id: '1',
        collectionName: 'games',
        host: 'test-user-id',
        name: 'Trivia Night',
        code: 'ABC123',
        status: 'not_started',
        currentRound: 0,
        created: '2025-01-01T00:00:00.000Z',
        updated: '2025-01-01T00:00:00.000Z'
      }

      mockPB._mockCollection.create.mockResolvedValue(mockGame)

      const game = await createGame(mockPB, 'Trivia Night', 'ABC123')

      expect(mockPB.collection).toHaveBeenCalledWith('games')
      expect(mockPB._mockCollection.create).toHaveBeenCalledWith({
        host: 'test-user-id',
        name: 'Trivia Night',
        code: 'ABC123',
        status: 'not_started',
        currentRound: 0
      })
      expect(game).toEqual(mockGame)
    })

    it('should throw error for invalid code format', async () => {
      await expect(createGame(mockPB, 'Game', 'abc')).rejects.toThrow(
        'Game code must be 4-12 uppercase letters and numbers only'
      )

      await expect(createGame(mockPB, 'Game', 'abc123')).rejects.toThrow(
        'Game code must be 4-12 uppercase letters and numbers only'
      )

      await expect(createGame(mockPB, 'Game', 'ABC-123')).rejects.toThrow(
        'Game code must be 4-12 uppercase letters and numbers only'
      )

      await expect(createGame(mockPB, 'Game', 'ABC')).rejects.toThrow(
        'Game code must be 4-12 uppercase letters and numbers only'
      )

      await expect(createGame(mockPB, 'Game', 'ABCDEFGHIJKLM')).rejects.toThrow(
        'Game code must be 4-12 uppercase letters and numbers only'
      )
    })

    it('should throw error when name is empty', async () => {
      await expect(createGame(mockPB, '', 'ABC123')).rejects.toThrow('Game name is required')
    })

    it('should throw error when not authenticated', async () => {
      const unauthPB = {
        ...mockPB,
        authStore: { record: null }
      } as unknown as PocketBaseClient

      await expect(createGame(unauthPB, 'Game', 'ABC123')).rejects.toThrow(
        'User must be authenticated'
      )
    })

    it('should handle duplicate code error from PocketBase', async () => {
      const error = new Error('Failed to create record')
      mockPB._mockCollection.create.mockRejectedValue(error)

      await expect(createGame(mockPB, 'Game', 'ABC123')).rejects.toThrow(error)
    })
  })

  describe('updateGame', () => {
    it('should update game name and code', async () => {
      const mockGame = {
        id: '1',
        collectionName: 'games',
        host: 'test-user-id',
        name: 'Friday Trivia',
        code: 'XYZ789',
        status: 'not_started',
        currentRound: 0,
        created: '2025-01-01T00:00:00.000Z',
        updated: '2025-01-01T00:01:00.000Z'
      }

      mockPB._mockCollection.update.mockResolvedValue(mockGame)

      const game = await updateGame(mockPB, '1', { name: 'Friday Trivia', code: 'XYZ789' })

      expect(mockPB.collection).toHaveBeenCalledWith('games')
      expect(mockPB._mockCollection.update).toHaveBeenCalledWith('1', {
        name: 'Friday Trivia',
        code: 'XYZ789'
      })
      expect(game).toEqual(mockGame)
    })

    it('should validate code format when updating', async () => {
      await expect(updateGame(mockPB, '1', { code: 'abc123' })).rejects.toThrow(
        'Game code must be 4-12 uppercase letters and numbers only'
      )
    })

    it('should allow updating only name', async () => {
      const mockGame = {
        id: '1',
        collectionName: 'games',
        host: 'test-user-id',
        name: 'Updated Name',
        code: 'ABC123',
        status: 'not_started',
        currentRound: 0,
        created: '2025-01-01T00:00:00.000Z',
        updated: '2025-01-01T00:01:00.000Z'
      }

      mockPB._mockCollection.update.mockResolvedValue(mockGame)

      const game = await updateGame(mockPB, '1', { name: 'Updated Name' })

      expect(mockPB._mockCollection.update).toHaveBeenCalledWith('1', { name: 'Updated Name' })
      expect(game).toEqual(mockGame)
    })

    it('should throw error when name is empty string', async () => {
      await expect(updateGame(mockPB, '1', { name: '' })).rejects.toThrow('Game name is required')
    })
  })

  describe('deleteGame', () => {
    it('should delete a game by id', async () => {
      mockPB._mockCollection.delete.mockResolvedValue(true)

      await deleteGame(mockPB, '1')

      expect(mockPB.collection).toHaveBeenCalledWith('games')
      expect(mockPB._mockCollection.delete).toHaveBeenCalledWith('1')
    })

    it('should handle deletion of non-existent game', async () => {
      const error = new Error('Record not found')
      mockPB._mockCollection.delete.mockRejectedValue(error)

      await expect(deleteGame(mockPB, 'non-existent')).rejects.toThrow(error)
    })
  })
})
