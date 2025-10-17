# auth-landing-page Specification

## Purpose
Provide a landing page with authentication screens (register, login, password recovery) that users interact with before accessing the trivia application.

## ADDED Requirements

### Requirement: Landing Page Layout
The system SHALL display a landing page with authentication options as the application entry point.

#### Scenario: Unauthenticated users see auth screen
- **WHEN** an unauthenticated user visits the application
- **THEN** they see the landing page with authentication options
- **AND** they cannot access game features until authenticated

#### Scenario: Authenticated users bypass auth screen
- **WHEN** an authenticated user visits the application
- **THEN** they are redirected to the main application view
- **AND** they do not see the authentication screens

#### Scenario: Landing page is mobile-responsive
- **WHEN** viewing the landing page on mobile devices
- **THEN** all auth forms are fully functional and readable
- **AND** touch targets meet minimum size requirements (44x44px)

### Requirement: User Registration Form
The system SHALL provide a registration form for new users to create accounts.

#### Scenario: Registration form collects required fields
- **WHEN** the registration form is displayed
- **THEN** it includes fields for email, password, confirm password, and display name
- **AND** all fields are marked as required

#### Scenario: Registration form validates input
- **WHEN** a user submits the registration form
- **THEN** email format is validated (must be valid email)
- **AND** password strength is validated (minimum 8 characters)
- **AND** passwords match validation is performed
- **AND** display name is validated (not empty, max 50 characters)

#### Scenario: Successful registration creates account and logs in
- **WHEN** a user submits valid registration data
- **THEN** a new user account is created in PocketBase
- **AND** the user is automatically logged in
- **AND** the user is redirected to the main application

#### Scenario: Registration errors are displayed
- **WHEN** registration fails (e.g., email already exists)
- **THEN** a user-friendly error message is displayed
- **AND** the form remains populated with entered data (except passwords)
- **AND** the user can retry registration

### Requirement: User Login Form
The system SHALL provide a login form for existing users to authenticate.

#### Scenario: Login form collects credentials
- **WHEN** the login form is displayed
- **THEN** it includes fields for email and password
- **AND** both fields are marked as required

#### Scenario: Successful login authenticates user
- **WHEN** a user submits valid credentials
- **THEN** the user is authenticated via PocketBase
- **AND** the auth token is stored in browser storage
- **AND** the user is redirected to the main application

#### Scenario: Login errors are displayed
- **WHEN** login fails (e.g., invalid credentials)
- **THEN** a generic error message is displayed (e.g., "Invalid email or password")
- **AND** the email field remains populated
- **AND** the password field is cleared
- **AND** the user can retry login

#### Scenario: Password visibility toggle
- **WHEN** the user clicks the password visibility toggle
- **THEN** the password input switches between text and password type
- **AND** an appropriate icon indicates the current state

### Requirement: Password Recovery Flow
The system SHALL provide a password recovery mechanism for users who forgot their passwords.

#### Scenario: Password recovery form collects email
- **WHEN** the user clicks "Forgot password" link
- **THEN** they see a password recovery form with an email field
- **AND** the form explains the recovery process

#### Scenario: Password recovery request is sent
- **WHEN** a user submits a valid email for recovery
- **THEN** PocketBase sends a password reset email
- **AND** a confirmation message is displayed (regardless of whether email exists)
- **AND** the user can return to the login form

#### Scenario: Password recovery errors are handled
- **WHEN** the password recovery request fails
- **THEN** a generic success message is still displayed (security best practice)
- **AND** actual errors are logged for debugging

### Requirement: Auth Form Navigation
The system SHALL allow users to switch between registration, login, and password recovery forms.

#### Scenario: Switch from login to registration
- **WHEN** a user clicks "Create account" link on login form
- **THEN** the registration form is displayed
- **AND** the URL updates to reflect the current form

#### Scenario: Switch from registration to login
- **WHEN** a user clicks "Sign in" link on registration form
- **THEN** the login form is displayed
- **AND** the URL updates to reflect the current form

#### Scenario: Navigate to password recovery
- **WHEN** a user clicks "Forgot password" on login form
- **THEN** the password recovery form is displayed
- **AND** the user can navigate back to login

### Requirement: Form Accessibility
The system SHALL ensure authentication forms are accessible to users with disabilities.

#### Scenario: Form fields have proper labels
- **WHEN** inspecting form fields
- **THEN** each input has an associated label element
- **AND** labels are properly connected via htmlFor/id attributes

#### Scenario: Error messages are announced
- **WHEN** form validation errors occur
- **THEN** error messages are associated with their fields via aria-describedby
- **AND** screen readers announce the errors

#### Scenario: Forms are keyboard navigable
- **WHEN** a user navigates with keyboard only
- **THEN** they can tab through all form fields and buttons
- **AND** they can submit forms with Enter key
- **AND** focus indicators are clearly visible

### Requirement: Loading and Disabled States
The system SHALL provide visual feedback during authentication operations.

#### Scenario: Form is disabled during submission
- **WHEN** an auth form is submitted
- **THEN** all form inputs are disabled
- **AND** the submit button shows a loading indicator
- **AND** the submit button text changes to indicate processing (e.g., "Signing in...")

#### Scenario: Form is re-enabled after response
- **WHEN** the authentication request completes (success or error)
- **THEN** form inputs are re-enabled
- **AND** the submit button returns to normal state
- **AND** users can interact with the form again
