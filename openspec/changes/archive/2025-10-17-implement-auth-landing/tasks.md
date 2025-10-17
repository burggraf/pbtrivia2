# Tasks: Implement Authentication Landing Page

## Overview
Implementation tasks are ordered to deliver user-visible progress incrementally, following TDD principles. Each task includes validation steps to ensure quality.

## Task List

### [x] 1. Install PocketBase SDK and Add shadcn/ui Components
**Description:** Add PocketBase JavaScript SDK as a dependency and install required shadcn/ui components for auth forms.

**Work Items:**
- Run `npm install pocketbase`
- Run `npx shadcn@latest add input label card alert`
- Verify package.json includes pocketbase dependency
- Verify new shadcn components exist in `src/components/ui/`

**Validation:**
- `npm install` completes without errors
- TypeScript recognizes pocketbase imports
- New component files exist and compile

**Estimated Effort:** 5 minutes

---

### [x] 2. Create PocketBase Client Singleton (TDD)
**Description:** Write tests for PocketBase client initialization, then implement the singleton client.

**Work Items:**
- Write tests in `src/lib/pocketbase.test.ts`:
  - Test client is initialized with default URL
  - Test client uses VITE_POCKETBASE_URL when set
  - Test client is a singleton (same instance returned)
- Implement `src/lib/pocketbase.ts`:
  - Create PocketBase client with environment variable support
  - Export singleton instance
  - Add TypeScript types for collections

**Validation:**
- All tests pass (`npm test`)
- Client initializes with correct URL
- TypeScript types work for PocketBase methods

**Estimated Effort:** 20 minutes

**Dependencies:** Task 1

---

### [x] 3. Create Auth Context and useAuth Hook (TDD)
**Description:** Write tests for auth context, then implement the context provider and hook.

**Work Items:**
- Write tests in `src/contexts/AuthContext.test.tsx`:
  - Test provider initializes with no user
  - Test login method updates state
  - Test logout method clears state
  - Test state persists across mount/unmount
- Implement `src/contexts/AuthContext.tsx`:
  - Create AuthContext with user, isAuthenticated, isLoading state
  - Implement login, register, logout, requestPasswordReset methods
  - Sync auth state with PocketBase authStore
  - Handle localStorage persistence
- Export useAuth hook

**Validation:**
- All tests pass
- Hook provides correct state and methods
- State persists in localStorage

**Estimated Effort:** 45 minutes

**Dependencies:** Task 2

---

### [x] 4. Wrap App in AuthProvider
**Description:** Integrate AuthProvider into the app root and verify auth state initializes correctly.

**Work Items:**
- Update `src/main.tsx`:
  - Import AuthProvider
  - Wrap App component with AuthProvider
- Write test in `src/main.test.tsx`:
  - Test AuthProvider is present in component tree

**Validation:**
- App renders without errors
- useAuth() works in any component
- Auth state initializes on app load

**Estimated Effort:** 10 minutes

**Dependencies:** Task 3

---

### [x] 5. Create Login Form Component (TDD)
**Description:** Write tests for login form, then implement the component.

**Work Items:**
- Write tests in `src/components/auth/LoginForm.test.tsx`:
  - Test form renders with email and password fields
  - Test form validation (required fields, email format)
  - Test successful login calls useAuth().login
  - Test error display on failed login
  - Test loading state during submission
  - Test password visibility toggle
- Implement `src/components/auth/LoginForm.tsx`:
  - Create form with email and password inputs
  - Add client-side validation
  - Handle form submission with login method
  - Show loading state during submission
  - Display errors from login failures
  - Add password visibility toggle
  - Add links to register and password recovery

**Validation:**
- All tests pass
- Form validates input correctly
- Successful login authenticates user
- Errors display properly
- Form is accessible (labels, keyboard nav, ARIA)

**Estimated Effort:** 60 minutes

**Dependencies:** Task 3

---

### [x] 6. Create Registration Form Component (TDD)
**Description:** Write tests for registration form, then implement the component.

**Work Items:**
- Write tests in `src/components/auth/RegisterForm.test.tsx`:
  - Test form renders with email, password, confirm password, display name fields
  - Test form validation (all fields required, email format, password match, password length)
  - Test successful registration calls useAuth().register
  - Test error display on failed registration
  - Test loading state during submission
- Implement `src/components/auth/RegisterForm.tsx`:
  - Create form with all required fields
  - Add client-side validation
  - Handle form submission with register method
  - Show loading state during submission
  - Display errors from registration failures
  - Add link to login form

**Validation:**
- All tests pass
- Form validates input correctly
- Successful registration creates account and authenticates
- Errors display properly
- Form is accessible

**Estimated Effort:** 60 minutes

**Dependencies:** Task 3

---

### [x] 7. Create Password Recovery Form Component (TDD)
**Description:** Write tests for password recovery form, then implement the component.

**Work Items:**
- Write tests in `src/components/auth/PasswordRecoveryForm.test.tsx`:
  - Test form renders with email field
  - Test form validation (required, email format)
  - Test successful submission shows success message
  - Test loading state during submission
- Implement `src/components/auth/PasswordRecoveryForm.tsx`:
  - Create form with email input
  - Add client-side validation
  - Handle form submission with requestPasswordReset method
  - Show generic success message after submission
  - Add link back to login form

**Validation:**
- All tests pass
- Form validates input correctly
- Success message displays after submission
- Form is accessible

**Estimated Effort:** 30 minutes

**Dependencies:** Task 3

---

### [x] 8. Create Auth Landing Page Component (TDD)
**Description:** Write tests for landing page, then implement the component that switches between auth forms.

**Work Items:**
- Write tests in `src/components/auth/AuthLanding.test.tsx`:
  - Test default view shows login form
  - Test navigation to register form
  - Test navigation to password recovery form
  - Test URL hash reflects current form
- Implement `src/components/auth/AuthLanding.tsx`:
  - Create container with branding/title
  - Render current form based on hash (#login, #register, #recover)
  - Handle form navigation
  - Make responsive for mobile

**Validation:**
- All tests pass
- Form navigation works correctly
- Hash updates on navigation
- Mobile-responsive layout

**Estimated Effort:** 40 minutes

**Dependencies:** Tasks 5, 6, 7

---

### [x] 9. Integrate Auth Landing into App (TDD)
**Description:** Update App.tsx to conditionally render auth landing or main app based on authentication state.

**Work Items:**
- Write tests in `src/App.test.tsx`:
  - Test unauthenticated users see AuthLanding
  - Test authenticated users see main app
  - Test loading state shows while auth initializes
- Update `src/App.tsx`:
  - Import useAuth and AuthLanding
  - Show loading indicator while isLoading
  - Show AuthLanding when not authenticated
  - Show main app content when authenticated

**Validation:**
- All tests pass
- Auth landing displays for unauthenticated users
- Main app displays for authenticated users
- Loading state prevents flash of wrong content

**Estimated Effort:** 20 minutes

**Dependencies:** Task 8

---

### [x] 10. Add Logout Functionality to Main App
**Description:** Add logout button to main app for testing auth flow.

**Work Items:**
- Update `src/App.tsx`:
  - Add logout button to main app view
  - Call useAuth().logout on click
- Write test:
  - Test logout button calls logout method

**Validation:**
- Logout button renders when authenticated
- Clicking logout returns to auth landing
- Auth state clears correctly

**Estimated Effort:** 15 minutes

**Dependencies:** Task 9

---

### [ ] 11. Add E2E Tests for Auth Flows *(deferred – user requested skip for now)*
**Description:** Create Playwright tests for complete authentication flows.

**Work Items:**
- Create `tests/auth.spec.ts`:
  - Test registration flow (register → auto-login → main app)
  - Test login flow (login → main app)
  - Test logout flow (logout → auth landing)
  - Test password recovery flow (request reset → success message)
  - Test validation errors prevent submission
  - Test session persistence (login → reload → still logged in)
  - Test form navigation (switch between login/register/recover)
- Run E2E tests: `npm run test:e2e`

**Validation:**
- All E2E tests pass
- Full auth flows work end-to-end
- Session persistence works
- Error handling works

**Estimated Effort:** 60 minutes

**Dependencies:** Task 10

---

### [ ] 12. Manual Testing and Refinement
**Description:** Manually test all auth flows and refine UX.

**Work Items:**
- Start dev server and PocketBase
- Test registration with various inputs
- Test login with valid/invalid credentials
- Test password recovery flow
- Test logout
- Test on mobile viewport
- Test keyboard navigation
- Test with screen reader (VoiceOver/NVSC)
- Verify accessibility (focus indicators, labels, ARIA)
- Check for visual polish (spacing, alignment, colors)
- Verify error messages are helpful

**Validation:**
- All flows work smoothly
- UX is polished and error-free
- Forms are accessible
- Mobile experience is good

**Estimated Effort:** 30 minutes

**Dependencies:** Task 11

---

### [x] 13. Update Documentation
**Description:** Document the authentication system for developers.

**Work Items:**
- Add section to project README (if needed):
  - Environment variables (VITE_POCKETBASE_URL)
  - How to run PocketBase backend
  - Default credentials for development
- Add JSDoc comments to auth context and hooks
- Document auth form components

**Validation:**
- Documentation is clear and accurate
- Other developers can set up auth locally

**Estimated Effort:** 20 minutes

**Dependencies:** Task 12

---

## Summary

**Total Estimated Effort:** ~6 hours

**Parallelizable Work:**
- Tasks 5, 6, 7 (form components) can be worked on in parallel after Task 3

**Critical Path:**
1. Install dependencies (Task 1)
2. PocketBase client (Task 2)
3. Auth context (Task 3)
4. Forms (Tasks 5-7, can parallelize)
5. Landing page (Task 8)
6. App integration (Tasks 9-10)
7. Testing and polish (Tasks 11-12)
8. Documentation (Task 13)

**Key Milestones:**
- ✅ Task 4: Auth state management working
- ✅ Task 8: All auth forms complete
- ✅ Task 10: Full auth flow integrated
- ✅ Task 11: E2E tests passing
- ✅ Task 13: Ready for review/merge
