import { AuthLanding } from '@/components/auth/AuthLanding'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

function App() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div
          role="status"
          aria-live="polite"
          className="rounded-full border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 shadow-sm"
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
    <div className="flex min-h-screen flex-col bg-slate-950 text-gray-50">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">pbTrivia</h1>
            <p className="text-sm text-slate-300">
              Plan games, track scores, and keep your audience engaged.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span>
              Signed in as{' '}
              <span className="font-medium text-white">{user?.email ?? 'Player'}</span>
            </span>
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => logout()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white">Welcome to pbTrivia</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Launch new trivia events, manage rounds, and collaborate with your co-hosts in real
            time. Start by creating a lobby or review tonight&apos;s question sets.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Create new event</Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View question bank
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <h3 className="text-lg font-medium text-white">Upcoming shows</h3>
            <p className="mt-2 text-sm text-slate-300">
              You don&rsquo;t have any scheduled events yet. Create one to invite players and keep
              scorecards in sync.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-5">
            <h3 className="text-lg font-medium text-white">Recent activity</h3>
            <p className="mt-2 text-sm text-slate-300">
              Activity from your team will show up here after your first game session.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
