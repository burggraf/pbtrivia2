import { Monitor, Moon, Sun } from 'lucide-react'
import { useId, useRef, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

const options = [
  {
    mode: 'light' as const,
    label: 'Light',
    description: 'Use the light appearance',
    Icon: Sun,
  },
  {
    mode: 'dark' as const,
    label: 'Dark',
    description: 'Use the dark appearance',
    Icon: Moon,
  },
  {
    mode: 'system' as const,
    label: 'System',
    description: 'Follow your device preference',
    Icon: Monitor,
  },
]

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, setMode } = useTheme()
  const labelId = useId()
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([])

  const focusAtIndex = (index: number) => {
    const button = buttonsRef.current[index]
    button?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (index + 1) % options.length
      setMode(options[nextIndex].mode)
      focusAtIndex(nextIndex)
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const previousIndex = (index - 1 + options.length) % options.length
      setMode(options[previousIndex].mode)
      focusAtIndex(previousIndex)
    }
  }

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <span id={labelId} className="sr-only">
        Appearance mode
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex items-center overflow-hidden rounded-full border border-border bg-muted/60 p-1 shadow-sm"
      >
        {options.map(({ mode: optionMode, label, description, Icon }, index) => {
          const isActive = optionMode === mode
          return (
            <button
              key={optionMode}
              ref={element => {
                buttonsRef.current[index] = element
              }}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={description}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={event => handleKeyDown(event, index)}
              onClick={() => setMode(optionMode)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'bg-background text-foreground shadow'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon aria-hidden className="h-4 w-4" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
