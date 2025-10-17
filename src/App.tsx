import { AuthLanding } from '@/components/auth/AuthLanding'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { ThemePersistenceNotice } from '@/components/theme/ThemePersistenceNotice'

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

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <ThemePersistenceNotice />

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors">
          <h2 className="text-2xl font-semibold">Welcome to pbTrivia</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Launch new trivia events, manage rounds, and collaborate with your co-hosts in real
            time. Start by creating a lobby or review tonight&apos;s question sets.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Create new event</Button>
            <Button variant="outline">View question bank</Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm transition-colors">
            <h3 className="text-lg font-medium">Upcoming shows</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don&rsquo;t have any scheduled events yet. Create one to invite players and keep
              scorecards in sync.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm transition-colors">
            <h3 className="text-lg font-medium">Recent activity</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Activity from your team will show up here after your first game session.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
