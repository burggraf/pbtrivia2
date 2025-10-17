import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

type ThemePersistenceNoticeProps = {
  className?: string
}

export function ThemePersistenceNotice({ className }: ThemePersistenceNoticeProps) {
  const { persistenceWarning } = useTheme()

  if (!persistenceWarning) {
    return null
  }

  return (
    <Alert className={cn('border-border/80 bg-accent text-accent-foreground', className)}>
      <AlertTriangle aria-hidden className="h-4 w-4" />
      <AlertTitle>Preference saved for this session</AlertTitle>
      <AlertDescription>{persistenceWarning}</AlertDescription>
    </Alert>
  )
}
