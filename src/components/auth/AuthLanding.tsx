import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { PasswordResetForm } from './PasswordResetForm'
import type { AuthView } from './types'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ThemePersistenceNotice } from '@/components/theme/ThemePersistenceNotice'

const hashToView = (hash: string): AuthView => {
  const normalized = hash.toLowerCase().replace('#', '')
  if (normalized === 'register') return 'register'
  if (normalized === 'recover') return 'recover'
  return 'login'
}

const viewToHash = (view: AuthView) => `#${view}`

const viewTitles: Record<AuthView, string> = {
  login: 'Sign in',
  register: 'Create an account',
  recover: 'Reset password'
}

export function AuthLanding() {
  const [view, setView] = useState<AuthView>(() => hashToView(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setView(hashToView(window.location.hash))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const targetHash = viewToHash(view)
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash
    }
  }, [view])

  const handleNavigate = useCallback(
    (target: AuthView) => {
      setView(target)
    },
    [setView]
  )

  const form = useMemo(() => {
    switch (view) {
      case 'register':
        return <RegisterForm onNavigate={target => handleNavigate(target)} />
      case 'recover':
        return <PasswordResetForm onNavigate={target => handleNavigate(target)} />
      default:
        return <LoginForm onNavigate={target => handleNavigate(target)} />
    }
  }, [handleNavigate, view])

  return (
    <div className="min-h-screen bg-background px-4 py-12 text-foreground transition-colors">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <ThemePersistenceNotice />

        <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
          <div className="max-w-md space-y-4 text-center md:text-left">
            <h1 className="text-4xl font-bold">pbTrivia</h1>
            <p className="text-base text-muted-foreground">
              Run unforgettable trivia nights. Manage hosts, players, and live scoring with a single
              app powered by PocketBase.
            </p>
          </div>

          <Card className="w-full max-w-md border border-border shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold">{viewTitles[view]}</CardTitle>
              <CardDescription>
                {view === 'login' && 'Welcome back! Sign in to create or join trivia games.'}
                {view === 'register' &&
                  'Get started with a new account to host and play trivia matches.'}
                {view === 'recover' &&
                  'We will email you a secure link to set a new password.'}
              </CardDescription>
            </CardHeader>
            <CardContent>{form}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
