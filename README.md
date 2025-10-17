# PB Trivia - Multi-User Trivia Game

Real-time multi-user trivia application designed for pubs, restaurants, and private events. Players use mobile phones while questions and scores display on TV screens, with hosts controlling the game flow.

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Type Safety**: TypeScript with strict mode
- **Testing**: Vitest (unit/component) + Playwright (E2E)
- **Backend**: PocketBase (configured separately)

## Prerequisites

- Node.js 18+ and npm
- Git

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

Creates optimized static assets in `dist/` directory ready for deployment.

### 4. Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit/component tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:e2e` | Run end-to-end tests with Playwright |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
pbtrivia2/
├── src/
│   ├── components/          # React components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # cn() utility for class merging
│   ├── hooks/              # Custom React hooks
│   ├── test/               # Test utilities and setup
│   │   ├── setup.ts        # Vitest setup
│   │   └── utils.tsx       # Custom render function
│   ├── assets/             # Static assets (images, fonts)
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── e2e/                    # Playwright E2E tests
├── public/                 # Static files (favicon, etc.)
├── dist/                   # Production build output (gitignored)
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── playwright.config.ts    # Playwright configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── components.json         # shadcn/ui configuration
```

## Adding shadcn/ui Components

This project uses shadcn/ui for accessible, customizable UI components.

### Install a Component

```bash
npx shadcn@latest add [component-name]
```

Examples:
```bash
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add form
```

Components will be added to `src/components/ui/` and can be customized directly.

### Using Components

```tsx
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

function MyComponent() {
  return (
    <Button variant="outline" size="lg">
      <Plus className="h-4 w-4" />
      Click me
    </Button>
  )
}
```

## Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```tsx
// Instead of: import { cn } from '../../lib/utils'
import { cn } from '@/lib/utils'

// Instead of: import { Button } from '../../components/ui/button'
import { Button } from '@/components/ui/button'
```

## Testing

### Unit/Component Tests

Tests are co-located with source files:

```typescript
// src/App.test.tsx
import { render, screen } from '@/test/utils'
import App from './App'

describe('App', () => {
  it('renders correctly', () => {
    render(<App />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

Run tests:
```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

### End-to-End Tests

E2E tests live in the `e2e/` directory:

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/PB Trivia/)
})
```

Run E2E tests:
```bash
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI mode
```

## Code Quality

### Linting

```bash
npm run lint
```

ESLint is configured with React, TypeScript, and accessibility (a11y) rules.

### Formatting

```bash
npm run format
```

Prettier ensures consistent code formatting across the project.

## Deployment

### Static Hosting

The app is a static site that can be deployed to any static hosting service:

- **Netlify**: Drag and drop `dist/` folder or connect Git repo
- **Vercel**: Connect Git repo, auto-detects Vite
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **AWS S3 + CloudFront**: Upload `dist/` contents
- **Cloudflare Pages**: Connect Git repo

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

### Environment Variables

Create `.env` files for environment-specific configuration:

```
# .env.local (gitignored)
VITE_API_URL=http://localhost:8090
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Follow the project conventions in `openspec/project.md`
2. Write tests for new features (TDD approach)
3. Ensure `npm run lint` and `npm run test` pass
4. Format code with `npm run format` before committing

## License

[Add your license here]

## Support

For issues and questions, please open an issue on the GitHub repository.
