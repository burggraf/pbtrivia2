# Proposal: Implement Authentication Landing Page

## Change ID
`implement-auth-landing`

## Status
Proposed

## Overview
Create a landing page with authentication screens that integrate with PocketBase authentication. This enables users to register with email/password, login to existing accounts, and recover lost passwords before accessing the trivia application.

## Motivation
The application requires all users (hosts and players) to authenticate before creating or joining games. Currently, there is no authentication UI or PocketBase SDK integration in the frontend. This change establishes the authentication foundation needed for the multi-user trivia experience.

## Scope
This change adds:
- PocketBase JavaScript SDK integration
- Landing page with auth screen UI
- User registration form (email, password, display name)
- Login form (email, password)
- Password recovery flow
- Authentication state management
- Error handling for auth operations

Out of scope:
- Email verification (not required per project specs)
- Social authentication (OAuth)
- Role-based access control beyond basic authentication
- Host vs. player role differentiation (handled later in game flow)

## Impact
- **Frontend**: New authentication pages and PocketBase SDK integration
- **Dependencies**: Adds pocketbase npm package
- **User Experience**: Users must register/login before accessing the app
- **Testing**: New unit tests for auth utilities, component tests for forms, E2E tests for auth flows

## Dependencies
- Requires PocketBase backend to be running (already set up)
- Requires backend spec (already exists at `openspec/specs/backend/spec.md`)
- Builds on component-library and styling-system specs

## Related Changes
None (first authentication implementation)

## Open Questions
None - requirements are clear from project.md specifications

## Approval Status
Awaiting review
