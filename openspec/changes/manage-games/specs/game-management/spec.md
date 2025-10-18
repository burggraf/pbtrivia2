# game-management Specification

## Purpose
Provides a complete interface for hosts to create, edit, and delete games with proper validation, confirmation, and cascading deletes.

## ADDED Requirements

### Requirement: Game List Display
The system SHALL display a list of all games created by the authenticated host.

#### Scenario: Empty game list
- **WHEN** a host has not created any games
- **THEN** the interface displays a message "No games yet. Create your first game to get started."
- **AND** a "Create Game" button is prominently displayed

#### Scenario: Display existing games
- **WHEN** a host has created one or more games
- **THEN** the interface displays a list of games with the following information:
  - Game name
  - Game code
  - Game status (not started, in progress, completed)
  - Created date
  - Actions (Edit, Delete)
- **AND** the list is sorted by created date (newest first)

#### Scenario: Real-time updates
- **WHEN** a game is created, edited, or deleted
- **THEN** the game list updates automatically within 2 seconds
- **AND** no manual page refresh is required

### Requirement: Game Creation
The system SHALL allow hosts to create new games with a unique name and code.

#### Scenario: Create game with valid inputs
- **WHEN** a host enters a game name "Trivia Night" and code "ABC123"
- **AND** submits the create game form
- **THEN** a new game record is created in the `games` collection
- **AND** the `host` field is set to the authenticated user's ID
- **AND** the `status` field is set to "not_started"
- **AND** the game appears in the game list
- **AND** a success message "Game created successfully" is displayed

#### Scenario: Duplicate game code
- **WHEN** a host attempts to create a game with a code that already exists
- **THEN** the creation fails with a clear error message "Game code already exists. Please choose a different code."
- **AND** the form remains populated with the entered values
- **AND** the user can edit and resubmit

#### Scenario: Invalid game code format
- **WHEN** a host enters a code with lowercase letters or special characters
- **THEN** the form validation displays "Game code must be 4-12 uppercase letters and numbers only"
- **AND** the submit button is disabled until the code is valid

#### Scenario: Missing required fields
- **WHEN** a host submits the form without entering a name or code
- **THEN** validation errors appear on the empty fields
- **AND** the form is not submitted until all required fields are filled

### Requirement: Game Editing
The system SHALL allow hosts to edit game properties before or during gameplay.

#### Scenario: Edit game name
- **WHEN** a host edits a game name from "Trivia Night" to "Friday Trivia"
- **AND** saves the changes
- **THEN** the game record is updated in the database
- **AND** the updated name appears in the game list
- **AND** a success message "Game updated successfully" is displayed

#### Scenario: Edit game code
- **WHEN** a host changes a game code from "ABC123" to "XYZ789"
- **AND** the new code is unique
- **THEN** the game code is updated
- **AND** the updated code appears in the game list

#### Scenario: Edit with duplicate code
- **WHEN** a host attempts to change a game code to one that already exists for a different game
- **THEN** the update fails with error "Game code already exists"
- **AND** the game retains its original code
- **AND** the user can edit and resubmit

#### Scenario: Cancel editing
- **WHEN** a host opens the edit form and makes changes
- **AND** clicks Cancel
- **THEN** no changes are saved to the database
- **AND** the original game data is displayed

### Requirement: Game Deletion with Confirmation
The system SHALL allow hosts to delete games with explicit confirmation and automatic cascading deletes.

#### Scenario: Request game deletion
- **WHEN** a host clicks the Delete button for a game named "Trivia Night"
- **THEN** a confirmation dialog appears with the message:
  - "Are you sure you want to delete 'Trivia Night'?"
  - "This will permanently delete the game and all related data including rounds, teams, players, and answers."
  - "This action cannot be undone."
- **AND** the dialog shows Cancel and Delete buttons

#### Scenario: Confirm deletion
- **WHEN** a host confirms the deletion by clicking Delete in the confirmation dialog
- **THEN** the game record is deleted from the `games` collection
- **AND** all related records are automatically deleted by cascade:
  - All `rounds` for the game
  - All `round_questions` for those rounds
  - All `teams` for the game
  - All `team_members` for those teams
  - All `team_answers` for those teams
- **AND** the game is removed from the game list
- **AND** a success message "Game deleted successfully" is displayed

#### Scenario: Cancel deletion
- **WHEN** a host clicks Cancel in the confirmation dialog
- **THEN** no deletion occurs
- **AND** the dialog closes
- **AND** the game remains in the game list

#### Scenario: Delete non-existent game
- **WHEN** a host attempts to delete a game that has already been deleted (e.g., by another session)
- **THEN** the system handles the error gracefully
- **AND** displays "Game not found. It may have already been deleted."
- **AND** refreshes the game list to remove the stale entry

### Requirement: Data Isolation and Authorization
The system SHALL enforce that hosts can only create, edit, and delete their own games.

#### Scenario: List only own games
- **WHEN** a host views the game list
- **THEN** only games where `host` equals the authenticated user's ID are displayed
- **AND** games created by other hosts are not visible

#### Scenario: Prevent unauthorized edit
- **WHEN** a host attempts to edit a game owned by a different host (e.g., via direct API call)
- **THEN** the request is rejected with a 403 Forbidden error
- **AND** no changes are made to the game

#### Scenario: Prevent unauthorized delete
- **WHEN** a host attempts to delete a game owned by a different host
- **THEN** the request is rejected with a 403 Forbidden error
- **AND** the game is not deleted

### Requirement: Error Handling and User Feedback
The system SHALL provide clear error messages and feedback for all game management operations.

#### Scenario: Network error during creation
- **WHEN** a network error occurs while creating a game
- **THEN** an error message "Unable to create game. Please check your connection and try again." is displayed
- **AND** the user can retry the operation

#### Scenario: Network error during deletion
- **WHEN** a network error occurs while deleting a game
- **THEN** an error message "Unable to delete game. Please check your connection and try again." is displayed
- **AND** the game remains in the list
- **AND** the user can retry the deletion

#### Scenario: Loading states
- **WHEN** a game operation is in progress (create, edit, delete)
- **THEN** a loading indicator is displayed
- **AND** the submit/delete button is disabled to prevent duplicate submissions
- **AND** the button text changes to indicate progress (e.g., "Creating...", "Deleting...")
