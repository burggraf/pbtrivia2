# Project Context

## Purpose
A real-time multi-user trivia application designed for pub/restaurant venues and private events where players use mobile phones while questions and scores display on TV screens. The host controls game flow, and teams compete through multiple rounds of trivia questions.

**Key Features:**
- Real-time synchronization across all devices (phones, TV displays, host controls)
- Multi-team gameplay with collaborative answer submission
- Host-controlled game flow (pause, resume, navigate, early end)
- Question randomization and answer shuffling
- Score tracking with tiebreaker support
- Game persistence and history tracking

## Tech Stack
- **Frontend**: React 18+ with Vite
  - Static web app (client-side only, no server-side code)
  - Deployed as static files (e.g., Netlify, Vercel, S3, or any static host)
  - All game logic runs in the host's browser client
- **Backend**: PocketBase (self-hosted, single executable)
  - Used purely as a REST API data store
  - Built-in SQLite database
  - Authentication via auth collections (email/password)
  - Collection API rules for access control
  - **No custom server-side code** - PocketBase used only for CRUD operations
- **Database**: SQLite with 61,000+ trivia questions across 10 categories
- **Client Synchronization**: Polling-based updates
  - Player/TV clients poll PocketBase API for game state changes
  - Host client writes game state to PocketBase
  - No SSE or websockets - pure REST API calls
  - Configurable poll intervals (e.g., every 500ms-1s during active gameplay)
- **Authentication**:
  - All users (hosts and players): Email/password via auth collections (required)
  - No email verification required - users can play immediately after account creation
  - Players can quickly create accounts during game join flow

## Project Conventions

### Code Style
- **Formatting**: Prettier with default configuration
- **Naming Conventions**: Standard JavaScript/React conventions
  - Components: PascalCase (e.g., `GameBoard.jsx`, `PlayerList.jsx`)
  - Files/folders: camelCase or kebab-case (standard practice)
  - Variables/functions: camelCase
  - Constants: UPPER_SNAKE_CASE for true constants
- **Folder Structure**: Standard Vite/React conventions
  - Keep it simple and flat where possible
  - Organize by feature when complexity grows

### Architecture Patterns
**Client-Side State Management:**
- One-way control flow: Host browser is the source of truth for all game actions
- Host client updates game state in PocketBase via REST API
- Player/TV browsers poll PocketBase API for game state changes
- All game logic (question selection, scoring, flow control) runs in host's browser
- No server-side game logic - PocketBase is purely a data store

**Polling-Based Synchronization:**
- Player/TV clients poll game state at regular intervals (e.g., 500ms-1s)
- Polling starts when joining a game, stops when game ends or client leaves
- Optimistic UI updates on host client for instant feedback
- Conditional requests (If-Modified-Since, ETags) to reduce bandwidth

**Multi-User Coordination:**
- First answer submitted per team is final (answer locking)
- Answer conflicts resolved by timestamp in database (first received wins)
- Disconnection handling: clients resume polling on reconnect
- Stale state detection via timestamp comparison

**Data Isolation:**
- Hosts can only access their own games and data
- Collection API rules enforce data access control (e.g., `@request.auth.id = host_id`)
- Only game creator can delete games
- All users must be authenticated to access game data
- Collection rules require valid `@request.auth.id` for all operations

### Testing Strategy
- **Test-Driven Development (TDD)**: Enforced
  - Write tests FIRST before implementation
  - Tests must FAIL first (red)
  - Then implement to make them pass (green)
  - Then refactor (refactor)
  - Red-Green-Refactor cycle is mandatory
- **Unit Tests**: Vitest (required for all code)
  - Test all functions, utilities, and business logic
  - Test all hooks and state management
  - Minimum coverage requirements enforced
  - Co-locate tests with source files (e.g., `utils.js` → `utils.test.js`)
- **Component Tests**: React Testing Library with Vitest
  - Test all React components
  - Focus on user behavior, not implementation details
  - Test accessibility and user interactions
- **End-to-End Tests**: Playwright
  - Test critical user flows (host creates game, players join, gameplay, scoring)
  - Test multi-client scenarios (host + players + TV display)
  - Run against production-like builds

### Git Workflow
- **Branching Strategy**: Direct commits to main branch
  - Keep it simple for now
  - May evolve to feature branches as team grows
- **Commit Message Format**: Conventional Commits
  - `feat: add new feature`
  - `fix: resolve bug`
  - `test: add or update tests`
  - `refactor: code restructuring without behavior change`
  - `docs: documentation changes`
  - `chore: maintenance tasks, dependencies, config`
  - `style: formatting, missing semicolons, etc.`
- **Commit Practices**:
  - Commit frequently with atomic, focused changes
  - Each commit should pass tests (maintain green build)
  - Write clear, descriptive commit messages

## Domain Context

### User Roles
- **Host**: Creates events, configures games, controls all game flow
- **Player**: Joins teams, views questions, submits answers

### Game Structure
- **Game**: Each game has a name (required)
- **Rounds**: Configurable number (e.g., 3 rounds)
  - Host selects one or more categories for each round
  - Can use single category (e.g., Round 1 = Science only)
  - Can use multiple categories (e.g., Round 2 = History + Geography + Pop Culture)
- **Questions**: Configurable per round (e.g., 5 questions)
  - Questions randomly selected from the chosen category/categories for that round
- **Categories**: 10 available categories (Arts & Literature, Entertainment, Food and Drink, General Knowledge, Geography, History, Pop Culture, Science, Sports, Technology)
- **Team Size**: Host configures min/max players per team (1-6 players)

### Scoring System
- All questions worth 1 point (no partial credit, no speed bonuses)
- Tie-breaking: Team with lowest cumulative answer time wins
- Track total time taken per team throughout game

### Team Management
- Solo play allowed (team of 1)
- Team names must be unique per game
- Players cannot switch teams after joining
- Players cannot join once game has started (no late joins allowed)
- First submitted answer per team locks in (cannot change)

### Question Database Schema
PocketBase collection: `questions`
```
- id (text, 15-char autogenerated ID, PK)
- category (text, indexed)
- question (text)
- a (text) -- CORRECT ANSWER
- b (text) -- Wrong answer
- c (text) -- Wrong answer
- d (text) -- Wrong answer
- metadata (json)
- created (datetime, auto)
- updated (datetime, auto)
```

### Player Experience
- Join via game code or QR code
- Mobile-responsive interface
- See teammate online status
- Answer display shows text only (no A/B/C/D labels)
- "Your team has answered" status (doesn't reveal which answer)
- Countdown timer (only if host enables time limits)

### TV Display Experience
- During questions: Show question and answers only
- Show "X of Y teams have answered" counter
- Before game: Team names and initial scores
- End of round: Team names, scores, standings
- End of game: Final scores and winner with charts/graphs

### Host Controls
- Preview selected questions before game
- Reorder questions in the question list
- Remove questions from selection
- Pause/resume game
- Navigate back to previous questions
- Preview next question privately (both pre-game and during gameplay)
- Replace upcoming question with another from same category (both pre-game and during gameplay)
- End game early
- Enable/disable sound effects
- Configure optional time limits per question
- **Note**: Host cannot change answer shuffle order (answers are auto-shuffled and locked)

### Game Persistence
- Games are expected to be completed in a single session
- However, game state persists in PocketBase to support "save and resume later" functionality
- Host can reconnect and resume from where they left off
- Minimal additional complexity due to polling architecture (state already in database)

## Important Constraints

### Critical Data Rules
1. **Column "a" is always the correct answer** in the database
2. **Answers must be shuffled** for display, but shuffle order identical for all users
3. **Never repeat questions** for a host across all their games
4. **Track all questions used** by each host to prevent reuse
5. **Answer locking**: First answer submitted per team is final

### Synchronization Requirements
- All updates via polling PocketBase REST API
- State synchronization across phones, TV screens, host controls via periodic polling
- Configurable poll interval (recommended: 500ms-1s during active play, 2-5s during waiting periods)
- Automatic retry on failed requests with exponential backoff
- Game state includes updated timestamp for detecting changes
- Poll only when game is active; stop polling when game ends or player leaves

### Authentication & Authorization
- All users: Email/password + display name required via auth collection
- Account creation fields: email, password, display name
- No email verification required - immediate access after account creation
- Hosts: Can only access their own games
- Players: Can quickly create accounts during game join flow
- Collection API rules enforce data isolation and require authentication (e.g., `@request.auth.id != ""`)
- Account creation must be simple and fast to avoid friction during game join

### Error Handling
- Player disconnection: Resume polling on reconnect, no penalty for missed questions
- Network failures: Retry requests automatically with exponential backoff
- Answer conflicts: First received (by timestamp) wins, subsequent submissions ignored
- Host disconnection: Game state persists in PocketBase; host can resume from any client
- Failed API calls: Show user-friendly error messages, allow manual retry

### Question Management
- If category lacks unused questions: Auto-supplement from related categories
- Host preview shows same shuffled order that players see
- Skipped/replaced questions don't count toward round totals

## External Dependencies

### Static Hosting
- **Deployment**: Any static file host (Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages, etc.)
- **Build**: Vite builds optimized production bundle
- **Assets**: All frontend code bundled into static HTML/CSS/JS files
- **No server required** on hosting platform - just static file serving

### PocketBase (Self-Hosted Data Store)
- **Single Executable**: Go binary, runs separately from static frontend
- **REST API Only**: Used purely for CRUD operations (no realtime/SSE)
- **Auth Collections**: Email/password authentication
- **Database**: Built-in SQLite with collection API rules
- **File Storage**: Built-in (if needed for future features)
- **Admin Dashboard**: Web UI for managing collections, users, and rules
- **CORS**: Must be configured to allow requests from static site domain

### PocketBase JS SDK
- Client library for REST API calls and authentication
- Auth store for managing authentication state (uses localStorage)
- Automatic token refresh
- **No realtime/SSE features used** - only REST API methods

### Question Database
- 61,000+ pre-loaded questions in PocketBase collection
- Indexed by category for fast filtering
- Tracked per-host to prevent question reuse

### Display Requirements
- Mobile-responsive player interface
- TV-optimized display (large text, high contrast)
- Support for multiple simultaneous polling clients
- Efficient polling to minimize bandwidth usage

### Optional Features
- Sound effects (configurable by host)
- Time limits per question (configurable)
- Charts/graphs for score visualization (client-side rendering with libraries like Chart.js or Recharts)
