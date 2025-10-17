import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from 'react'
import type { RecordModel } from 'pocketbase'
import { pocketBase } from '@/lib/pocketbase'

export type AuthRecord = (RecordModel & { collectionName: 'users' }) | null

export type LoginCredentials = {
  email: string
  password: string
}

export type RegistrationData = {
  email: string
  password: string
  passwordConfirm: string
  displayName: string
}

type AuthContextValue = {
  user: AuthRecord
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegistrationData) => Promise<void>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<void>
}

/**
 * React context that exposes PocketBase authentication state and helpers.
 * Consumers must call {@link useAuth} inside a component rendered under {@link AuthProvider}.
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [user, setUser] = useState<AuthRecord>(() => pocketBase.authStore.record as AuthRecord)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = pocketBase.authStore.onChange((_token, record) => {
      setUser(record as AuthRecord)
    }, true)

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    setIsLoading(true)
    try {
      const { token, record } = await pocketBase.collection('users').authWithPassword(email, password)
      pocketBase.authStore.save(token, record)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegistrationData) => {
    setIsLoading(true)
    try {
      await pocketBase.collection('users').create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        displayName: data.displayName
      })

      const { token, record } = await pocketBase.collection('users').authWithPassword(
        data.email,
        data.password
      )
      pocketBase.authStore.save(token, record)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    pocketBase.authStore.clear()
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true)
    try {
      await pocketBase.collection('users').requestPasswordReset(email)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      requestPasswordReset
    }),
    [user, isLoading, login, register, logout, requestPasswordReset]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Convenience hook for accessing authentication state and actions.
 * Throws if used outside of {@link AuthProvider}.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
