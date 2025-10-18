import type { PocketBaseClient, GameRecord } from '@/lib/pocketbase'

/**
 * Game update payload.
 */
export type GameUpdate = {
  name?: string
  code?: string
}

const CODE_PATTERN = /^[A-Z0-9]{4,12}$/

/**
 * Validates that the user is authenticated.
 */
const requireAuth = (pb: PocketBaseClient): string => {
  const userId = pb.authStore.record?.id
  if (!userId) {
    throw new Error('User must be authenticated')
  }
  return userId
}

/**
 * Validates game code format.
 */
const validateCode = (code: string): void => {
  if (!CODE_PATTERN.test(code)) {
    throw new Error('Game code must be 4-12 uppercase letters and numbers only')
  }
}

/**
 * Validates game name.
 */
const validateName = (name: string): void => {
  if (!name || name.trim().length === 0) {
    throw new Error('Game name is required')
  }
}

/**
 * Fetches all games for the authenticated host.
 * Note: PocketBase automatically filters by host via the collection's listRule.
 * Sorts by ID descending (IDs contain timestamps).
 */
export const listGames = async (pb: PocketBaseClient): Promise<GameRecord[]> => {
  requireAuth(pb) // Ensure user is authenticated

  const games = await pb.collection('games').getFullList<GameRecord>({
    sort: '-id'
  })

  return games
}

/**
 * Creates a new game.
 */
export const createGame = async (
  pb: PocketBaseClient,
  name: string,
  code: string
): Promise<GameRecord> => {
  const userId = requireAuth(pb)

  validateName(name)
  validateCode(code)

  const game = await pb.collection('games').create<GameRecord>({
    host: userId,
    name,
    code,
    status: 'not_started',
    currentRound: 0
  })

  return game
}

/**
 * Updates an existing game.
 */
export const updateGame = async (
  pb: PocketBaseClient,
  id: string,
  updates: GameUpdate
): Promise<GameRecord> => {
  if (updates.name !== undefined) {
    validateName(updates.name)
  }

  if (updates.code !== undefined) {
    validateCode(updates.code)
  }

  const game = await pb.collection('games').update<GameRecord>(id, updates)

  return game
}

/**
 * Deletes a game by ID. Cascade deletes are handled by the database.
 */
export const deleteGame = async (pb: PocketBaseClient, id: string): Promise<void> => {
  await pb.collection('games').delete(id)
}
