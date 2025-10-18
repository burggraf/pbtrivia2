import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { GameRecord } from '@/lib/pocketbase'

type GameListProps = {
  games: GameRecord[]
  onEdit: (game: GameRecord) => void
  onDelete: (game: GameRecord) => void
}

export const GameList = ({ games, onEdit, onDelete }: GameListProps) => {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-2">No games yet.</p>
        <p className="text-muted-foreground">Create your first game to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Card key={game.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{game.name}</h3>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Code: {game.code}</span>
                <span>Status: {game.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(game)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(game)}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
