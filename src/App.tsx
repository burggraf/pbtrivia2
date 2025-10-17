import { useState } from 'react'
import { Plus, Rocket } from 'lucide-react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:opacity-80 transition-opacity">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:opacity-80 transition-opacity">
          <img src={reactLogo} className="h-24 w-24" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Vite + React + shadcn/ui</h1>
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full space-y-4">
        <Button onClick={() => setCount((count) => count + 1)} className="w-full">
          <Plus className="h-4 w-4" />
          count is {count}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Outline</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
          <Button variant="destructive" size="sm">
            <Rocket className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-600 text-center text-sm">
          Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-gray-500 text-sm">
        shadcn/ui Button component with Lucide icons working!
      </p>
    </div>
  )
}

export default App
