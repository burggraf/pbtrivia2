# manage-games

## Overview
Enable hosts to create, edit, and delete games through a dedicated game management interface. Game deletions will cascade to all related data (rounds, teams, team members, team answers, round questions) and require confirmation to prevent accidental data loss.

## Goals
- Provide a user-friendly interface for hosts to manage their games
- Support creating new games with basic configuration (name, code)
- Allow editing game properties before or after game start
- Enable safe game deletion with cascade to all related collections
- Require explicit confirmation before deleting games to prevent accidental data loss
- Maintain data isolation (hosts can only manage their own games)

## Context
The PocketBase backend already has cascading deletes configured at the database level:
- `games` → `rounds` (cascadeDelete: true)
- `games` → `teams` (cascadeDelete: true)
- `rounds` → `round_questions` (cascadeDelete: true)
- `teams` → `team_members` (cascadeDelete: true)
- `teams` → `team_answers` (cascadeDelete: true)

All collections enforce `hostOnlyRule` access control, ensuring hosts can only access their own games.

## Out of Scope
- Advanced game configuration (rounds, categories, question selection) - covered by future changes
- Game cloning or templates
- Bulk operations on multiple games
- Game archiving or soft deletes
- Exporting game data

## Assumptions
- Hosts understand that deleting a game is permanent and irreversible
- Confirmation dialog is sufficient to prevent accidental deletions
- Database cascading deletes are reliable and properly configured
- Game codes must be unique across all games (enforced by database index)

## Risks
- **Data Loss Risk**: Accidental game deletion could lose valuable game history
  - Mitigation: Require explicit confirmation, show warning message with details
- **Orphaned Records Risk**: If cascade deletes fail, could leave orphaned data
  - Mitigation: Rely on database-level cascade constraints, test thoroughly
- **Concurrent Deletion Risk**: Multiple clients could attempt to delete the same game
  - Mitigation: PocketBase handles concurrent deletes gracefully (404 on second attempt)

## Success Criteria
- Hosts can create a new game with name and unique code
- Hosts can edit game name and code (with validation)
- Hosts can delete a game after confirming the action
- All related data is automatically deleted when a game is deleted
- Error messages are clear when operations fail (e.g., duplicate code)
- All operations tested with unit and component tests

## Implementation Summary

### ✅ Completed
All core functionality has been implemented and tested:

**Service Layer** (`src/services/gameService.ts`)
- CRUD operations for games with PocketBase integration
- Client-side validation for game name and code format
- Comprehensive error handling
- 14 unit tests passing

**React Hooks**
- `useGames`: Fetches and manages game list state with auto-refresh
- `useGameMutation`: Handles create, update, delete operations with loading/error states
- 9 hook tests passing

**UI Components**
- `GameList`: Displays games with edit/delete actions, empty state handling
- `GameForm`: Create/edit form with inline validation and loading states
- `DeleteGameDialog`: Confirmation dialog with cascade delete warning
- 19 component tests passing

**Integration**
- `GameManagement` page orchestrates all components
- Toast notifications for success/error feedback
- Integrated into `App.tsx` behind authentication
- Real-time list refresh after mutations

**Total: 42 tests passing**

### ⚠️  Deferred to Future Iterations
- Full routing system with React Router (currently integrated directly into App.tsx)
- Navigation menu (page shown immediately after login)
- End-to-end tests with Playwright (would require PocketBase instance)

### Files Created
- `src/services/gameService.ts` + test
- `src/hooks/useGames.ts` + test
- `src/hooks/useGameMutation.ts` + test
- `src/components/game/GameList.tsx` + test
- `src/components/game/GameForm.tsx` + test
- `src/components/game/DeleteGameDialog.tsx` + test
- `src/components/ui/dialog.tsx`
- `src/components/ui/sonner.tsx`
- `src/pages/GameManagement.tsx`
- Updated `src/lib/pocketbase.ts` with GameRecord type
- Updated `src/App.tsx` with GameManagement integration
