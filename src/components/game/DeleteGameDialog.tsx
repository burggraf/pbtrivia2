import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { GameRecord } from '@/lib/pocketbase'

type DeleteGameDialogProps = {
  game: GameRecord | null
  isOpen: boolean
  onConfirm: (game: GameRecord) => Promise<void>
  onCancel: () => void
}

export const DeleteGameDialog = ({ game, isOpen, onConfirm, onCancel }: DeleteGameDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!game) return

    setIsLoading(true)
    try {
      await onConfirm(game)
    } finally {
      setIsLoading(false)
    }
  }

  if (!game) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Game</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete '{game.name}'?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm">
          <p>
            This will permanently delete the game and all related data including rounds, teams,
            players, and answers.
          </p>
          <p className="font-semibold text-destructive">This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
