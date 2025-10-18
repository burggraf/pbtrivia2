import { AuthLanding } from '@/components/auth/AuthLanding'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ThemePersistenceNotice } from '@/components/theme/ThemePersistenceNotice'
import { Toaster } from '@/components/ui/sonner'
import { GameManagement } from '@/pages/GameManagement'

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div
          role="status"
          aria-live="polite"
          className="rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground shadow-sm"
        >
          Checking your account...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthLanding />
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
        <header className="border-b border-border/60 bg-card/70 backdrop-blur">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">pbTrivia</h1>
              <p className="text-sm text-muted-foreground">
                Plan games, track scores, and keep your audience engaged.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <ThemeToggle />
              <span className="flex items-center gap-1">
                Signed in as{' '}
                <span className="font-medium text-foreground">{user?.email ?? 'Player'}</span>
              </span>
              <Button type="button" variant="outline" onClick={() => logout()}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <ThemePersistenceNotice />
          <GameManagement />
        </main>
      </div>
      <Toaster />
    </>
  )
}

export default App
