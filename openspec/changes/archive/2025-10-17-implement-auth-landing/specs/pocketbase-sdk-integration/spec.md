# pocketbase-sdk-integration Specification

## Purpose
Integrate the PocketBase JavaScript SDK to enable REST API communication with the PocketBase backend for authentication and data operations.

## ADDED Requirements

### Requirement: PocketBase SDK Installation
The system SHALL include the PocketBase JavaScript SDK as a production dependency.

#### Scenario: SDK is available for import
- **WHEN** importing PocketBase in any source file
- **THEN** the module resolves without errors
- **AND** TypeScript types are available for the PocketBase client

### Requirement: PocketBase Client Singleton
The system SHALL provide a configured PocketBase client instance that can be imported throughout the application.

#### Scenario: Client is initialized with backend URL
- **WHEN** the PocketBase client is created
- **THEN** it is configured with the PocketBase backend URL (e.g., http://127.0.0.1:8090)
- **AND** the client is exported as a singleton for reuse across modules

#### Scenario: Client configuration supports environment variables
- **WHEN** a VITE_POCKETBASE_URL environment variable is defined
- **THEN** the client uses that URL instead of the default
- **AND** falls back to http://127.0.0.1:8090 if the variable is not set

### Requirement: Authentication Token Persistence
The system SHALL persist authentication tokens in browser storage for session continuity.

#### Scenario: Auth state persists across page refreshes
- **WHEN** a user logs in successfully
- **THEN** the auth token is stored in localStorage
- **AND** when the page is refreshed, the user remains logged in

#### Scenario: Auth state is cleared on logout
- **WHEN** a user logs out
- **THEN** the auth token is removed from localStorage
- **AND** subsequent API requests are unauthenticated

### Requirement: Type Safety
The system SHALL provide TypeScript types for all PocketBase collections and responses.

#### Scenario: Collection types are defined
- **WHEN** accessing PocketBase collections via the SDK
- **THEN** TypeScript provides autocompletion for collection names
- **AND** response types match the collection schema

#### Scenario: Auth user types are defined
- **WHEN** accessing the authenticated user record
- **THEN** TypeScript provides type information for user fields (id, email, name, etc.)
