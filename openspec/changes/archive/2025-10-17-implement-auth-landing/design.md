# Design: Implement Authentication Landing Page

## Architecture Overview

This change introduces the authentication foundation for the trivia application by integrating the PocketBase JavaScript SDK and creating a landing page with registration, login, and password recovery flows.

### System Components

```
┌─────────────────────────────────────────────────────┐
│                   React Application                  │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │          AuthProvider (Context)                 │ │
│  │  - Manages global auth state                    │ │
│  │  - Provides useAuth() hook                      │ │
│  │  - Syncs with localStorage                      │ │
│  └────────────────────────────────────────────────┘ │
│                         │                             │
│       ┌─────────────────┼─────────────────┐          │
│       │                 │                 │          │
│  ┌────▼────┐      ┌────▼────┐      ┌────▼────┐     │
│  │ Login   │      │Register │      │Password │     │
│  │ Form    │      │ Form    │      │Recovery │     │
│  └────┬────┘      └────┬────┘      └────┬────┘     │
│       │                │                 │          │
│       └────────────────┼─────────────────┘          │
│                        │                             │
│              ┌─────────▼──────────┐                 │
│              │  PocketBase Client │                 │
│              │  (Singleton)       │                 │
│              └─────────┬──────────┘                 │
└────────────────────────┼──────────────────────────┘
                         │
                         │ HTTP/REST API
                         │
                ┌────────▼─────────┐
                │   PocketBase     │
                │   Backend        │
                │   (Port 8090)    │
                └──────────────────┘
```

## Design Decisions

### 1. PocketBase SDK Integration

**Decision:** Use the official PocketBase JavaScript SDK as a singleton client.

**Rationale:**
- Official SDK provides type-safe API access and authentication methods
- Singleton pattern prevents multiple instances and ensures consistent state
- Built-in auth token management with localStorage persistence
- Automatic token refresh and request authentication

**Implementation:**
- Create `src/lib/pocketbase.ts` exporting configured singleton
- Support environment variable configuration (VITE_POCKETBASE_URL)
- Default to `http://127.0.0.1:8090` for local development

**Trade-offs:**
- ✅ Simplifies auth and API calls throughout app
- ✅ Leverages battle-tested library
- ❌ Adds dependency (~50KB gzipped)
- ❌ Couples app to PocketBase API patterns

### 2. React Context for Auth State

**Decision:** Use React Context API for global authentication state management.

**Rationale:**
- Aligns with project conventions (no external state management libraries)
- Context API sufficient for auth state (user object, loading state)
- Avoids prop drilling for auth data needed throughout app
- Standard React pattern, well-understood by developers

**Implementation:**
- Create `src/contexts/AuthContext.tsx` with provider and hook
- Expose `useAuth()` hook returning `{ user, isAuthenticated, isLoading, login, register, logout, requestPasswordReset }`
- Wrap root component in `<AuthProvider>`

**Trade-offs:**
- ✅ No additional dependencies
- ✅ Simple mental model
- ✅ Easy to test and mock
- ❌ All consumers re-render on any auth state change (acceptable for this use case)

### 3. Form Validation Strategy

**Decision:** Implement client-side validation with HTML5 constraints and custom logic.

**Rationale:**
- HTML5 validation provides baseline UX (required, email format, minLength)
- Custom validation needed for password matching and strength
- Server-side validation still occurs (PocketBase validates email uniqueness, etc.)
- No need for heavy form libraries (Formik, React Hook Form) for simple forms

**Implementation:**
- Use HTML5 `required`, `type="email"`, `minLength` attributes
- Add custom validation functions for password match and strength
- Display validation errors using shadcn/ui form patterns
- Disable submit button while validation errors exist

**Trade-offs:**
- ✅ Lightweight, no dependencies
- ✅ Leverages browser capabilities
- ✅ Good UX with immediate feedback
- ❌ More manual validation code vs. form libraries
- ❌ Must sync validation logic with backend constraints

### 4. Routing Strategy

**Decision:** Conditionally render auth screens vs. main app based on authentication state.

**Rationale:**
- Simple initial routing (auth vs. main app)
- Defer full routing solution (React Router) until app has multiple authenticated views
- Keeps change scope minimal and focused

**Implementation:**
- In `App.tsx`, check `isAuthenticated` from `useAuth()`
- Render `<AuthLanding />` when not authenticated
- Render main app content when authenticated
- Support URL hash-based form switching within auth landing (`#register`, `#login`, `#recover`)

**Trade-offs:**
- ✅ Minimal dependencies and complexity
- ✅ Works for current two-state app (auth vs. main)
- ❌ Will need proper router when adding host dashboard, game screens, player views
- ❌ Hash-based routing less elegant than path-based

**Future Evolution:**
- Add React Router when implementing game flows (host, player, TV views)
- Migrate auth landing to dedicated routes (`/login`, `/register`, `/recover`)
- Implement proper protected route components

### 5. Password Reset Flow

**Decision:** Request password reset via PocketBase, display generic success message.

**Rationale:**
- PocketBase handles email sending and reset token generation
- Generic success message prevents email enumeration attacks
- Reset token validation and new password submission happen via PocketBase's built-in flow (user clicks email link, sets new password in PocketBase UI or custom page)

**Implementation:**
- Password recovery form calls `pb.collection('users').requestPasswordReset(email)`
- Always show success message regardless of whether email exists
- Log actual errors for debugging without exposing to user

**Trade-offs:**
- ✅ Secure (no email enumeration)
- ✅ Leverages PocketBase built-in functionality
- ❌ Less control over reset email content and styling
- ❌ Users complete reset in PocketBase's default UI (acceptable for MVP)

**Future Enhancement:**
- Create custom password reset confirmation page in React app
- Customize email templates in PocketBase settings

### 6. Component Library Usage

**Decision:** Build auth forms using shadcn/ui components (Button, Input, Label, Card).

**Rationale:**
- Already integrated shadcn/ui in component-library capability
- Consistent styling with rest of application
- Accessible components out of the box
- Customizable via Tailwind CSS

**Implementation:**
- Add shadcn/ui form components: `npx shadcn@latest add input label card form`
- Create `<LoginForm>`, `<RegisterForm>`, `<PasswordRecoveryForm>` components
- Use Card for form container, Input for fields, Button for actions

**Trade-offs:**
- ✅ Consistent design system
- ✅ Accessibility built-in
- ✅ Mobile-responsive
- ❌ Need to install additional shadcn components

### 7. Error Handling

**Decision:** Display user-friendly error messages with fallback for unknown errors.

**Rationale:**
- PocketBase API errors may contain technical details not suitable for users
- Generic messages for auth failures prevent information leakage
- Specific messages for validation errors improve UX

**Implementation:**
- Map PocketBase error codes to user-friendly messages
- Use generic "Invalid email or password" for login failures
- Show specific validation errors (email format, password strength)
- Log full error details to console for debugging

**Error Message Mapping:**
```typescript
const errorMessages: Record<string, string> = {
  'Failed to authenticate.': 'Invalid email or password',
  'The email is already in use.': 'An account with this email already exists',
  // ... additional mappings
  default: 'Something went wrong. Please try again.'
}
```

## Data Flow

### Registration Flow
1. User fills registration form (email, password, confirm password, display name)
2. Client-side validation checks all fields
3. On submit, `register()` method called from `useAuth()`
4. PocketBase SDK creates user record
5. PocketBase automatically authenticates new user
6. Auth token stored in localStorage via SDK
7. AuthContext updates state with user object
8. App re-renders, showing main application

### Login Flow
1. User fills login form (email, password)
2. On submit, `login()` method called from `useAuth()`
3. PocketBase SDK calls `authWithPassword()`
4. On success, auth token stored in localStorage
5. AuthContext updates state with user object
6. App re-renders, showing main application

### Password Recovery Flow
1. User clicks "Forgot password" link
2. Password recovery form displayed
3. User enters email
4. `requestPasswordReset()` called from `useAuth()`
5. PocketBase sends password reset email
6. Generic success message shown to user
7. User clicks link in email (handled by PocketBase)
8. User sets new password via PocketBase's reset UI

### Logout Flow
1. User clicks logout button (in main app)
2. `logout()` method called from `useAuth()`
3. PocketBase SDK clears auth store
4. Auth token removed from localStorage
5. AuthContext clears user state
6. App re-renders, showing auth landing page

## Testing Strategy

### Unit Tests
- **Auth utilities**: Test PocketBase client initialization, environment variable handling
- **Auth context**: Test state management, login/register/logout methods
- **Form validation**: Test validation functions for email, password, display name

### Component Tests
- **Auth forms**: Test form rendering, input handling, validation display, submission
- **useAuth hook**: Test hook returns correct values and methods
- **Error display**: Test error messages render correctly

### E2E Tests (Playwright)
- **Full registration flow**: Register new user, verify redirect to app
- **Full login flow**: Login existing user, verify redirect to app
- **Logout flow**: Logout, verify redirect to auth landing
- **Password recovery**: Request password reset, verify success message
- **Validation errors**: Test form validation prevents invalid submissions
- **Session persistence**: Login, reload page, verify still logged in

## Security Considerations

1. **Password Storage**: Handled by PocketBase (bcrypt hashing)
2. **Token Security**: Auth tokens stored in localStorage (acceptable for MVP, httpOnly cookies preferred for production)
3. **Email Enumeration**: Password reset always shows success message
4. **Password Strength**: Client enforces minimum 8 characters, recommend adding strength meter in future
5. **Rate Limiting**: Defer to PocketBase's built-in rate limiting
6. **HTTPS**: Require HTTPS in production (configured at hosting/proxy level)

## Accessibility Considerations

1. **Form Labels**: All inputs have associated labels via htmlFor/id
2. **Error Announcement**: Errors use aria-describedby for screen reader support
3. **Keyboard Navigation**: All forms fully keyboard navigable
4. **Focus Management**: Focus indicators visible, logical tab order
5. **Loading States**: Submit buttons show loading state, forms disabled during submission
6. **ARIA Attributes**: Use aria-live regions for dynamic error messages

## Performance Considerations

1. **Code Splitting**: Auth components in separate chunks (future optimization)
2. **Bundle Size**: PocketBase SDK adds ~50KB gzipped (acceptable)
3. **API Calls**: Minimize calls during auth flow (only necessary operations)
4. **localStorage**: Sync access is fast enough for auth token reads
5. **Re-renders**: Context updates only trigger re-renders in consumers (acceptable for auth)

## Future Enhancements

1. **Social Authentication**: Add OAuth providers (Google, GitHub)
2. **Email Verification**: Require email verification before access (if needed)
3. **Two-Factor Authentication**: Add 2FA support via PocketBase
4. **Password Strength Meter**: Visual indicator of password strength
5. **Custom Password Reset Page**: In-app password reset confirmation
6. **Remember Me**: Optional extended session duration
7. **Account Management**: Profile editing, password change, account deletion
8. **httpOnly Cookies**: Move auth tokens to httpOnly cookies (requires backend changes)
