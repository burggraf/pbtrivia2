# auth-state-management Specification

## Purpose
Manage authentication state throughout the application, providing utilities and hooks for checking authentication status, accessing user data, and handling logout.

## ADDED Requirements

### Requirement: Authentication Context Provider
The system SHALL provide a React Context for managing authentication state globally.

#### Scenario: Auth context wraps application
- **WHEN** the application root is rendered
- **THEN** the AuthProvider component wraps all child components
- **AND** authentication state is accessible to all descendants

#### Scenario: Auth context initializes from storage
- **WHEN** the AuthProvider mounts
- **THEN** it checks for existing auth tokens in localStorage
- **AND** restores the authenticated user if a valid token exists
- **AND** clears invalid or expired tokens

### Requirement: useAuth Hook
The system SHALL provide a custom hook for accessing authentication state and methods.

#### Scenario: Hook provides current user
- **WHEN** a component calls useAuth()
- **THEN** it receives the current authenticated user object (or null)
- **AND** user data includes id, email, and display name

#### Scenario: Hook provides authentication status
- **WHEN** a component calls useAuth()
- **THEN** it receives an isAuthenticated boolean
- **AND** the value reflects the current auth state

#### Scenario: Hook provides loading state
- **WHEN** authentication is being initialized or verified
- **THEN** useAuth() provides an isLoading boolean
- **AND** components can show loading UI appropriately

#### Scenario: Hook provides auth methods
- **WHEN** a component calls useAuth()
- **THEN** it receives login, register, logout, and requestPasswordReset methods
- **AND** these methods handle all authentication operations

### Requirement: Login Method
The system SHALL provide a login method that authenticates users via PocketBase.

#### Scenario: Successful login updates state
- **WHEN** login(email, password) is called with valid credentials
- **THEN** the PocketBase authWithPassword method is called
- **AND** the authenticated user is stored in context state
- **AND** the auth token is persisted to localStorage
- **AND** the method returns success

#### Scenario: Failed login throws error
- **WHEN** login(email, password) is called with invalid credentials
- **THEN** the PocketBase API returns an error
- **AND** the error is propagated to the caller
- **AND** authentication state remains unchanged

### Requirement: Register Method
The system SHALL provide a register method that creates new user accounts.

#### Scenario: Successful registration creates account and authenticates
- **WHEN** register(email, password, displayName) is called with valid data
- **THEN** a new user record is created in PocketBase
- **AND** the user is automatically authenticated
- **AND** the authenticated user is stored in context state
- **AND** the method returns success

#### Scenario: Failed registration throws error
- **WHEN** register() is called with invalid data or existing email
- **THEN** the PocketBase API returns an error
- **AND** the error is propagated to the caller
- **AND** no account is created

### Requirement: Logout Method
The system SHALL provide a logout method that clears authentication state.

#### Scenario: Logout clears all auth state
- **WHEN** logout() is called
- **THEN** the PocketBase authStore is cleared
- **AND** the authenticated user is removed from context state
- **AND** the auth token is removed from localStorage
- **AND** the user is considered unauthenticated

### Requirement: Password Reset Method
The system SHALL provide a method to request password reset emails.

#### Scenario: Password reset request is sent
- **WHEN** requestPasswordReset(email) is called
- **THEN** PocketBase sends a password reset email to the address
- **AND** the method returns success (regardless of whether email exists)
- **AND** errors are logged but not exposed to prevent email enumeration

### Requirement: Auth State Persistence
The system SHALL automatically sync authentication state with localStorage.

#### Scenario: Auth state persists across page reloads
- **WHEN** a user is authenticated and the page reloads
- **THEN** the authentication state is restored from localStorage
- **AND** the user remains logged in

#### Scenario: Auth state updates trigger re-renders
- **WHEN** authentication state changes (login, logout, token refresh)
- **THEN** all components using useAuth() re-render
- **AND** UI updates to reflect the new state

### Requirement: Protected Route Logic
The system SHALL provide utilities for protecting routes that require authentication.

#### Scenario: Unauthenticated access to protected content
- **WHEN** an unauthenticated user attempts to access protected content
- **THEN** they are redirected to the login page
- **AND** the intended destination is preserved for post-login redirect

#### Scenario: Authenticated access to protected content
- **WHEN** an authenticated user accesses protected content
- **THEN** the content is rendered normally
- **AND** no redirect occurs
