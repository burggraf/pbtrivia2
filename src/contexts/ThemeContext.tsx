import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from 'react'

const STORAGE_KEY = 'pbtrivia:theme'
const PERSISTENCE_WARNING =
  'Theme preference will reset after this session because browser storage is unavailable.'

type ThemeMode = 'light' | 'dark' | 'system'
type ThemeName = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  theme: ThemeName
  setMode: (mode: ThemeMode) => void
  reset: () => void
  storageAvailable: boolean
  persistenceWarning?: string
}

type MediaQueryListener = (event: MediaQueryListEvent) => void

let inMemoryPreference: ThemeMode | null = null

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const isValidPreference = (value: string | null): value is ThemeMode => {
  return value === 'light' || value === 'dark' || value === 'system'
}

const readPreference = (storage: Storage | null): ThemeMode | null => {
  if (storage) {
    const stored = storage.getItem(STORAGE_KEY)
    if (isValidPreference(stored)) {
      return stored
    }
    return null
  }

  return inMemoryPreference
}

const getSystemTheme = (): ThemeName => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const resolveTheme = (mode: ThemeMode, systemTheme: ThemeName): ThemeName => {
  return mode === 'system' ? systemTheme : mode
}

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storage = window.localStorage
    const probeKey = '__pbtrivia-theme__'
    storage.setItem(probeKey, '1')
    storage.removeItem(probeKey)
    return storage
  } catch {
    return null
  }
}

const applyDocumentTheme = (theme: ThemeName) => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

const computeInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      storage: null as Storage | null,
      storageAvailable: false,
      mode: 'system' as ThemeMode,
      theme: 'light' as ThemeName,
      warning: undefined as string | undefined
    }
  }

  const storage = getStorage()
  const storageAvailable = Boolean(storage)
  const storedPreference = readPreference(storage)
  const mode = storedPreference ?? 'system'
  const theme = resolveTheme(mode, getSystemTheme())
  const warning = storageAvailable ? undefined : PERSISTENCE_WARNING

  if (!storage && storedPreference) {
    inMemoryPreference = storedPreference
  }

  return { storage, storageAvailable, mode, theme, warning }
}

export const ThemeProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { storage, storageAvailable: initialStorageAvailable, mode: initialMode, theme: initialTheme, warning } =
    useMemo(computeInitialState, [])

  const storageRef = useRef<Storage | null>(storage)
  const [mode, setModeState] = useState<ThemeMode>(initialMode)
  const [theme, setTheme] = useState<ThemeName>(initialTheme)
  const [storageAvailable, setStorageAvailable] = useState(initialStorageAvailable)
  const [persistenceWarning, setPersistenceWarning] = useState<string | undefined>(warning)

  useEffect(() => {
    applyDocumentTheme(theme)
  }, [theme])

  useEffect(() => {
    const nextTheme = resolveTheme(mode, getSystemTheme())
    setTheme(nextTheme)

    if (mode !== 'system') {
      return
    }

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener: MediaQueryListener = event => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }

    mediaQuery.addListener(listener)
    return () => mediaQuery.removeListener(listener)
  }, [mode])

  useEffect(() => {
    const storage = storageRef.current

    if (!storage) {
      inMemoryPreference = mode
      return
    }

    try {
      storage.setItem(STORAGE_KEY, mode)
      inMemoryPreference = null

      if (!storageAvailable) {
        setStorageAvailable(true)
      }

      if (persistenceWarning) {
        setPersistenceWarning(undefined)
      }
    } catch {
      inMemoryPreference = mode

      if (storageAvailable) {
        setStorageAvailable(false)
      }

      if (!persistenceWarning) {
        setPersistenceWarning(PERSISTENCE_WARNING)
      }
    }
  }, [mode, storageAvailable, persistenceWarning])

  const setMode = useCallback((nextMode: ThemeMode) => {
    if (!['light', 'dark', 'system'].includes(nextMode)) {
      return
    }
    setModeState(nextMode)
  }, [])

  const reset = useCallback(() => {
    setModeState('system')
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      setMode,
      reset,
      storageAvailable,
      persistenceWarning,
    }),
    [mode, theme, setMode, reset, storageAvailable, persistenceWarning]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
