import { useState } from 'react'
import { toast } from 'sonner'
import { useGames } from '@/hooks/useGames'
import { useGameMutation } from '@/hooks/useGameMutation'
import { GameList } from '@/components/game/GameList'
import { GameForm } from '@/components/game/GameForm'
import { DeleteGameDialog } from '@/components/game/DeleteGameDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { GameRecord } from '@/lib/pocketbase'

export const GameManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingGame, setEditingGame] = useState<GameRecord | null>(null)
  const [deletingGame, setDeletingGame] = useState<GameRecord | null>(null)

  const { games, isLoading, error, refresh } = useGames()
  const { createGame, updateGame, deleteGame } = useGameMutation()

  const handleCreate = () => {
    setEditingGame(null)
    setShowForm(true)
  }

  const handleEdit = (game: GameRecord) => {
    setEditingGame(game)
    setShowForm(true)
  }

  const handleDelete = (game: GameRecord) => {
    setDeletingGame(game)
  }

  const handleFormSubmit = async (data: { name: string; code: string }) => {
    try {
      if (editingGame) {
        await updateGame(editingGame.id, data)
        toast.success('Game updated successfully')
      } else {
        await createGame(data.name, data.code)
        toast.success('Game created successfully')
      }
      setShowForm(false)
      setEditingGame(null)
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'

      if (message.includes('code')) {
        toast.error('Game code already exists. Please choose a different code.')
      } else {
        toast.error(message)
      }
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingGame(null)
  }

  const handleDeleteConfirm = async (game: GameRecord) => {
    try {
      await deleteGame(game.id)
      toast.success('Game deleted successfully')
      setDeletingGame(null)
      refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'

      if (message.includes('not found')) {
        toast.error('Game not found. It may have already been deleted.')
        refresh()
      } else {
        toast.error('Unable to delete game. Please check your connection and try again.')
      }
      setDeletingGame(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeletingGame(null)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading games...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-destructive">Failed to load games. Please try again.</p>
          <Button onClick={refresh} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Game Management</h1>
        {!showForm && (
          <Button onClick={handleCreate}>Create Game</Button>
        )}
      </div>

      {showForm ? (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingGame ? 'Edit Game' : 'Create New Game'}
          </h2>
          <GameForm game={editingGame || undefined} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </Card>
      ) : (
        <GameList games={games} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <DeleteGameDialog
        game={deletingGame}
        isOpen={!!deletingGame}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}
