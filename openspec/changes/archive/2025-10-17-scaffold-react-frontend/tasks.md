# Tasks: scaffold-react-frontend

## Implementation Order

### 1. Initialize Vite + React Project
**Capability**: `build-system`
**Description**: Create a new Vite project with React and TypeScript templates

**Steps**:
- Run `npm create vite@latest frontend -- --template react-ts` in project root
- Move generated files from `frontend/` subdirectory to appropriate locations
- Update `package.json` with project name and description
- Install base dependencies: `npm install`
- Verify dev server runs: `npm run dev`
- Verify build works: `npm run build`

**Validation**:
- Dev server starts at http://localhost:5173
- Browser shows default Vite + React page
- Production build creates `dist/` directory with optimized assets

---

### 2. Configure TypeScript with Path Aliases
**Capability**: `build-system`
**Description**: Set up strict TypeScript configuration with `@/` path alias

**Steps**:
- Update `tsconfig.json` with strict mode and path aliases
- Configure Vite to resolve `@/` alias in `vite.config.ts`
- Add inline comments explaining key configuration options
- Test import using `@/` alias in a component

**Validation**:
- TypeScript compilation passes without errors
- `import { foo } from "@/lib/utils"` works correctly
- IDE provides autocomplete for aliased paths

---

### 3. Install and Configure Tailwind CSS
**Capability**: `styling-system`
**Description**: Set up Tailwind CSS with PostCSS

**Steps**:
- Install Tailwind: `npm install -D tailwindcss postcss autoprefixer`
- Initialize Tailwind: `npx tailwindcss init -p`
- Configure `tailwind.config.js` with content paths and theme extensions
- Create `src/index.css` with Tailwind directives (`@tailwind base`, etc.)
- Import `index.css` in `src/main.tsx`
- Add inline comments explaining Tailwind configuration
- Test Tailwind utilities in `App.tsx`

**Validation**:
- Tailwind utilities render correctly in browser
- Responsive utilities work (test `sm:`, `md:`, `lg:` breakpoints)
- Production build purges unused CSS

---

### 4. Configure ESLint and Prettier
**Capability**: `build-system`
**Description**: Set up code quality and formatting tools

**Steps**:
- Install ESLint plugins: `npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y`
- Install Prettier: `npm install -D prettier eslint-config-prettier eslint-plugin-prettier`
- Create `.eslintrc.cjs` with React and a11y rules
- Create `.prettierrc` with formatting config (match `openspec/project.md` conventions)
- Add `lint` and `format` scripts to `package.json`
- Add `.prettierignore` and update `.gitignore`

**Validation**:
- `npm run lint` catches code issues
- `npm run format` formats code consistently
- Prettier doesn't conflict with ESLint

---

### 5. Initialize shadcn/ui
**Capability**: `component-library`
**Description**: Set up shadcn/ui component library

**Steps**:
- Run `npx shadcn@latest init`
- Choose options: TypeScript (yes), style (default), base color (slate), CSS variables (yes)
- Verify `components.json` is created
- Verify `src/lib/utils.ts` is created with `cn` function
- Add inline comments to explain `cn` utility
- Update `tsconfig.json` if needed for component paths

**Validation**:
- `components.json` exists with correct configuration
- `src/lib/utils.ts` contains working `cn` function
- Path aliases work for `@/components/ui`

---

### 6. Install Example shadcn/ui Component
**Capability**: `component-library`
**Description**: Install and test a Button component

**Steps**:
- Install Button: `npx shadcn@latest add button`
- Verify component created at `src/components/ui/button.tsx`
- Install Lucide icons: `npm install lucide-react`
- Import and use Button in `App.tsx` with an icon
- Test different button variants (default, outline, ghost, etc.)
- Test button sizes and states

**Validation**:
- Button renders with correct Tailwind styling
- Variants work as expected
- Button is keyboard accessible (test with Tab and Enter)
- Icon displays correctly within button

---

### 7. Set Up Project Directory Structure
**Capability**: `project-structure`
**Description**: Create standard folder structure

**Steps**:
- Create `src/components/` directory
- Create `src/lib/` directory (if not exists from shadcn)
- Create `src/assets/` directory
- Create `src/hooks/` directory (for future custom hooks)
- Create placeholder `README.md` in `src/components/` explaining structure
- Update root `README.md` with project overview and setup instructions
- Ensure `.gitignore` covers all build artifacts

**Validation**:
- Directory structure matches `openspec/project.md` conventions
- `README.md` explains how to run the project
- Git ignores `node_modules/`, `dist/`, and editor files

---

### 8. Configure Vitest for Unit Testing
**Capability**: `testing-infrastructure`
**Description**: Set up Vitest and React Testing Library

**Steps**:
- Install Vitest: `npm install -D vitest @vitest/ui`
- Install React Testing Library: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- Install jsdom: `npm install -D jsdom`
- Create `vitest.config.ts` with React and jsdom configuration
- Create `src/test/setup.ts` to import `@testing-library/jest-dom`
- Add test scripts to `package.json`: `test`, `test:watch`, `test:coverage`
- Create example test: `src/App.test.tsx`

**Validation**:
- `npm run test` executes tests successfully
- `npm run test:watch` enters watch mode
- `npm run test:coverage` generates coverage report
- Example test passes

---

### 9. Create Test Utilities
**Capability**: `testing-infrastructure`
**Description**: Set up custom render function and test helpers

**Steps**:
- Create `src/test/utils.tsx` with custom `render` function
- Export all React Testing Library utilities from custom utils
- Create example mock data factory (optional for now)
- Document test utilities in comments
- Update example test to use custom render

**Validation**:
- Custom render function works in tests
- Tests can import utilities from `@/test/utils`
- Test code is cleaner and more maintainable

---

### 10. Configure Playwright for E2E Testing
**Capability**: `testing-infrastructure`
**Description**: Set up Playwright for end-to-end tests

**Steps**:
- Install Playwright: `npm install -D @playwright/test`
- Initialize Playwright: `npx playwright install`
- Create `playwright.config.ts` with browser configurations
- Create `e2e/` directory for E2E tests
- Create example E2E test: `e2e/app.spec.ts` (tests homepage loads)
- Add E2E test script to `package.json`: `test:e2e`
- Update `.gitignore` to ignore Playwright artifacts

**Validation**:
- `npm run test:e2e` runs E2E tests successfully
- Tests run in Chromium, Firefox, and WebKit
- Screenshots are captured on failures

---

### 11. Update HTML Entry Point
**Capability**: `project-structure`
**Description**: Configure production-ready index.html

**Steps**:
- Update `index.html` with proper meta tags (viewport, charset, description)
- Set descriptive page title: "PB Trivia - Multi-User Trivia Game"
- Add comment explaining where to customize meta tags for deployment
- Ensure root div exists with `id="root"`
- Add placeholder for favicon (add basic favicon.ico to public/)

**Validation**:
- `index.html` includes all required meta tags
- Page title is descriptive
- Favicon loads in browser

---

### 12. Create Basic App Shell
**Capability**: `project-structure`
**Description**: Build a minimal responsive app shell

**Steps**:
- Update `App.tsx` with basic responsive layout using Tailwind
- Use shadcn Button component from previous task
- Add navigation placeholder (header with app name)
- Add main content area with centered content
- Add footer placeholder
- Ensure mobile-responsive (test in browser dev tools)

**Validation**:
- App displays responsive layout
- Layout works on mobile, tablet, and desktop viewports
- Tailwind utilities apply correctly
- shadcn Button is integrated and functional

---

### 13. Write Comprehensive Tests for App Shell
**Capability**: `testing-infrastructure`
**Description**: Create unit and E2E tests for app shell following TDD

**Steps**:
- Write unit tests for `App.tsx` using React Testing Library
- Test that header renders with app name
- Test that button is accessible and clickable
- Write E2E test that verifies app loads and is interactive
- Ensure all tests pass before proceeding

**Validation**:
- Unit tests pass: `npm run test`
- E2E tests pass: `npm run test:e2e`
- Coverage report shows high percentage for tested components
- Tests follow accessibility-first approach

---

### 14. Document Setup and Usage
**Capability**: `project-structure`
**Description**: Create comprehensive README and inline documentation

**Steps**:
- Update root `README.md` with:
  - Project overview
  - Prerequisites (Node.js version, npm)
  - Installation steps
  - Development commands (`dev`, `build`, `test`, etc.)
  - Project structure explanation
  - How to add shadcn/ui components
  - Testing conventions
  - Deployment instructions (static hosting)
- Add inline comments to all configuration files
- Create `CONTRIBUTING.md` with development guidelines (optional)

**Validation**:
- New developer can follow README to get started
- All commands are documented and work as described
- Configuration files are self-explanatory

---

### 15. Final Validation and Cleanup
**Capability**: All capabilities
**Description**: Ensure everything works together

**Steps**:
- Run full test suite: `npm run test && npm run test:e2e`
- Run linting: `npm run lint`
- Run production build: `npm run build`
- Test production build locally: `npm run preview`
- Verify all configuration files have comments
- Check that `.gitignore` is complete
- Remove any unused files or dependencies
- Verify no console errors in browser

**Validation**:
- All tests pass
- No linting errors
- Production build succeeds
- Preview server works correctly
- No console warnings or errors
- Repository is clean (only necessary files tracked)

---

## Dependencies Between Tasks

**Sequential Dependencies**:
- Task 2 depends on Task 1 (need Vite project before configuring TypeScript)
- Task 3 depends on Task 2 (Tailwind needs TS config)
- Task 5 depends on Tasks 3 and 4 (shadcn needs Tailwind and TS)
- Task 6 depends on Task 5 (need shadcn initialized before installing components)
- Task 9 depends on Task 8 (test utilities need Vitest)
- Task 13 depends on Tasks 8, 10, 12 (tests need frameworks and app shell)
- Task 15 depends on all previous tasks

**Parallelizable Tasks**:
- Tasks 4 and 7 can run in parallel after Task 3
- Tasks 8 and 10 can be worked on in parallel
- Task 11 can be done anytime after Task 1

## Estimated Timeline

- **Tasks 1-6**: Core scaffolding (~2-3 hours)
- **Tasks 7-11**: Project structure and testing setup (~2-3 hours)
- **Tasks 12-13**: App shell and tests (~1-2 hours)
- **Tasks 14-15**: Documentation and validation (~1 hour)

**Total**: 6-9 hours for a single developer
