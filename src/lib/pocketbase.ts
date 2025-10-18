import PocketBase, { type RecordModel } from 'pocketbase'

const DEFAULT_POCKETBASE_URL = 'http://127.0.0.1:8090'

/**
 * Record shape for the PocketBase `questions` collection.
 * Matches the schema defined in `openspec/specs/backend/spec.md`.
 */
export type QuestionRecord = RecordModel & {
  collectionName: 'questions'
  category: string
  subcategory: string
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  a: string
  b: string
  c: string
  d: string
  metadata: Record<string, unknown> | null
  created: string
  updated: string
}

/**
 * Record shape for the PocketBase `games` collection.
 */
export type GameRecord = RecordModel & {
  collectionName: 'games'
  host: string
  name: string
  code: string
  status: string
  currentRound: number
  startedAt?: string
  completedAt?: string
}

/**
 * Narrowed list of collections we interact with from the frontend.
 * Extend this type as new collections become accessible from the UI.
 */
export type Collections = {
  questions: QuestionRecord
  games: GameRecord
}

const resolveBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_POCKETBASE_URL
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl
  }

  return DEFAULT_POCKETBASE_URL
}

const pocketBaseClient = new PocketBase(resolveBaseUrl())

export const getPocketBaseClient = () => pocketBaseClient

export const pocketBase = pocketBaseClient

export type PocketBaseClient = typeof pocketBaseClient
