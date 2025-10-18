import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import type { GameRecord } from '@/lib/pocketbase'

type GameFormData = {
  name: string
  code: string
}

type GameFormProps = {
  game?: GameRecord
  onSubmit: (data: GameFormData) => Promise<void>
  onCancel: () => void
}

const CODE_PATTERN = /^[A-Z0-9]{4,12}$/

export const GameForm = ({ game, onSubmit, onCancel }: GameFormProps) => {
  const [name, setName] = useState(game?.name || '')
  const [code, setCode] = useState(game?.code || '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name || name.trim().length === 0) {
      newErrors.name = 'Game name is required'
    }

    if (!code || code.trim().length === 0) {
      newErrors.code = 'Game code is required'
    } else if (!CODE_PATTERN.test(code)) {
      newErrors.code = 'Game code must be 4-12 uppercase letters and numbers only'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({ name, code })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Game Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter game name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <Alert variant="destructive" className="py-2">
            {errors.name}
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Game Code</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter 4-12 character code (A-Z, 0-9)"
          maxLength={12}
          aria-invalid={!!errors.code}
        />
        {errors.code && (
          <Alert variant="destructive" className="py-2">
            {errors.code}
          </Alert>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (game ? 'Updating...' : 'Creating...') : game ? 'Update Game' : 'Create Game'}
        </Button>
      </div>
    </form>
  )
}
