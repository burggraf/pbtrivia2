# Setup PocketBase Backend

## Why
The application requires a self-hosted backend to store and serve trivia questions, manage user authentication, track game state, and provide a REST API for client synchronization. PocketBase provides all required functionality as a single executable with no custom server-side code needed.

## What Changes
- Initialize PocketBase with proper directory structure (pb_data, pb_migrations, pb_hooks)
- Create `questions` collection with schema matching the 61,000+ questions from questions.tsv
- Develop data migration script to load all questions from questions.tsv into PocketBase
- Configure collection API rules for proper access control
- Set up admin superuser for collection management

**Schema Clarification Needed:**
The questions.tsv file contains additional fields beyond the schema documented in project.md:
- `subcategory` (e.g., "Ancient Civilizations", "World Capitals")
- `difficulty` (e.g., "easy", "medium", "hard")
- `level` (appears to be empty in the TSV)

Should these fields be included in the PocketBase collection schema? This impacts question filtering, UI display, and game configuration options.

## Impact
- **New capability**: Backend infrastructure (specs/backend/spec.md)
- **Affected code**: None yet (new project setup)
- **Data**: Creates questions collection with 61,000+ records
- **Dependencies**: Requires PocketBase executable (already present at ./pocketbase)
- **Environment**: Creates pb_data directory for database storage
