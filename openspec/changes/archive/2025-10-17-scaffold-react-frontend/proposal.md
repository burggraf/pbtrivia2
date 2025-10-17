# Proposal: scaffold-react-frontend

## Overview
Scaffold a client-side React application using Vite, Tailwind CSS, and shadcn/ui to serve as the foundation for the multi-user trivia game. This change establishes the build system, styling infrastructure, component library integration, and project structure necessary for implementing the host, player, and TV display interfaces.

## Why
The project needs a frontend application to enable users to play trivia games. The backend (PocketBase with 61,000+ questions) is ready, but there's no user interface for hosts to create games, players to join and answer questions, or TV displays to show questions and scores. This change establishes the React foundation required for all future UI development.

## Problem Statement
Currently, the project has a fully configured PocketBase backend with 61,000+ trivia questions, but lacks a frontend application. To build the trivia game's three user interfaces (host controls, player mobile view, TV display), we need a modern React development environment with:

1. **Fast development experience**: Hot module replacement and instant feedback
2. **Production-ready build system**: Optimized static assets for deployment
3. **Responsive styling**: Mobile-first approach using Tailwind CSS
4. **Accessible component library**: shadcn/ui for consistent, customizable UI components
5. **Type-safe development**: TypeScript for catching errors early
6. **Testing infrastructure**: Vitest for unit/component tests, Playwright for E2E tests

## Scope
This change focuses exclusively on scaffolding the frontend infrastructure. It does NOT include:

- Authentication implementation (future change)
- Game state management (future change)
- API integration with PocketBase (future change)
- Actual game UI components (future change)

### In Scope
- Vite project initialization with React 18+
- TypeScript configuration
- Tailwind CSS setup and configuration
- shadcn/ui installation and configuration
- Testing framework setup (Vitest + Playwright)
- Project folder structure following conventions in `openspec/project.md`
- Development scripts (dev, build, preview, test)
- Production build optimization
- Basic responsive layout structure

### Out of Scope
- PocketBase SDK integration
- Authentication flows
- Game logic and state management
- Actual UI screens (host, player, TV)
- API polling implementation

## Dependencies
- **Requires**: `backend` spec (PocketBase must be configured)
- **Blocks**: All future frontend changes depend on this foundation

## Success Criteria
1. Developer can run `npm run dev` and see a React app at `http://localhost:5173`
2. `npm run build` produces optimized static assets in `dist/` folder
3. `npm run test` executes Vitest unit tests successfully
4. `npm run test:e2e` runs Playwright E2E tests
5. Tailwind CSS utilities work correctly in components
6. shadcn/ui components can be installed and used (demonstrate with one example component)
7. TypeScript compilation passes with no errors
8. Project structure matches conventions in `openspec/project.md`
9. All configuration files include inline comments explaining key settings

## Related Changes
- Future: `implement-authentication` (will use this scaffold)
- Future: `implement-host-interface` (will use this scaffold)
- Future: `implement-player-interface` (will use this scaffold)
- Future: `implement-tv-display` (will use this scaffold)

## Open Questions
None - this is a straightforward scaffolding task with well-established tooling.

## Risks
- **Low Risk**: Vite, React, Tailwind, and shadcn/ui are mature, well-documented tools
- **Mitigation**: Follow official documentation and project conventions strictly
