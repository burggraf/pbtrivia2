# project-structure Specification

## Purpose
TBD - created by archiving change scaffold-react-frontend. Update Purpose after archive.
## Requirements
### Requirement: Standard React Project Structure
The system SHALL organize files following React and Vite conventions as defined in `openspec/project.md`.

#### Scenario: Root directory structure is correct
- **GIVEN** the project is scaffolded
- **WHEN** the developer views the root directory
- **THEN** the following directories and files exist:
  - `src/` - source code
  - `public/` - static assets
  - `dist/` - build output (gitignored)
  - `node_modules/` - dependencies (gitignored)
  - `package.json` - project manifest
  - `package-lock.json` - lockfile
  - `vite.config.ts` - Vite configuration
  - `tsconfig.json` - TypeScript configuration
  - `tailwind.config.js` - Tailwind configuration
  - `postcss.config.js` - PostCSS configuration
  - `index.html` - HTML entry point
  - `.gitignore` - Git ignore rules
  - `README.md` - project documentation

#### Scenario: src directory is organized
- **GIVEN** the `src/` directory exists
- **WHEN** the developer views its contents
- **THEN** the following structure is present:
  - `src/main.tsx` - application entry point
  - `src/App.tsx` - root component
  - `src/index.css` - global styles with Tailwind directives
  - `src/components/` - React components
  - `src/components/ui/` - shadcn/ui components
  - `src/lib/` - utility functions and helpers
  - `src/lib/utils.ts` - cn utility and other helpers
  - `src/assets/` - images, fonts, etc.

#### Scenario: Component files follow naming conventions
- **GIVEN** components are created
- **WHEN** the developer views component files
- **THEN** components use PascalCase naming (e.g., `Button.tsx`, `GameBoard.tsx`)
- **AND** test files are co-located (e.g., `Button.test.tsx`)
- **AND** utility files use camelCase (e.g., `formatScore.ts`)

### Requirement: Configuration Files
The system SHALL include properly configured files with inline comments.

#### Scenario: Vite config explains key settings
- **GIVEN** `vite.config.ts` exists
- **WHEN** the developer opens the file
- **THEN** comments explain the React plugin configuration
- **AND** comments explain any custom build settings
- **AND** the configuration is production-ready

#### Scenario: TypeScript config is strict
- **GIVEN** `tsconfig.json` exists
- **WHEN** the developer views the configuration
- **THEN** strict mode is enabled
- **AND** path aliases are configured (e.g., `@/` for `src/`)
- **AND** React JSX transformation is configured
- **AND** comments explain key compiler options

#### Scenario: Tailwind config is customizable
- **GIVEN** `tailwind.config.js` exists
- **WHEN** the developer views the configuration
- **THEN** content paths are correctly set for purging
- **AND** theme extensions are clearly documented
- **AND** plugin configuration is explained

### Requirement: Git Configuration
The system SHALL include appropriate .gitignore rules.

#### Scenario: Build artifacts are ignored
- **GIVEN** `.gitignore` is configured
- **WHEN** the developer commits changes
- **THEN** `node_modules/`, `dist/`, and build artifacts are not tracked
- **AND** editor-specific files are ignored (e.g., `.vscode/`, `.idea/`)
- **AND** OS-specific files are ignored (e.g., `.DS_Store`)

### Requirement: HTML Entry Point
The system SHALL provide a properly configured index.html file.

#### Scenario: HTML is production-ready
- **GIVEN** `index.html` exists at the project root
- **WHEN** the developer views the file
- **THEN** it includes proper meta tags (viewport, charset)
- **AND** it includes a descriptive title
- **AND** it references the main entry point (`src/main.tsx`)
- **AND** it includes a root div with id="root"

#### Scenario: HTML supports meta tag customization
- **GIVEN** the application is built for production
- **WHEN** the HTML is deployed
- **THEN** meta tags can be customized for SEO
- **AND** Open Graph tags can be added for social sharing
- **AND** favicon references work correctly

