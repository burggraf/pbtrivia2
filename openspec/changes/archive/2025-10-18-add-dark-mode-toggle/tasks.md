# Tasks: Add Dark Mode Toggle

## Overview
Tasks follow TDD and ensure the appearance preference experience works across the trivia app. Complete them sequentially unless noted otherwise.

## Task List

### [x] 1. Extend Tailwind and CSS Variables for Dual Themes (TDD)
**Description:** Define light and dark design tokens and ensure Tailwind dark mode variants are ready.

**Work Items:**
- Update `tailwind.config.js` to enable `class` + `media` strategy or equivalent for system sync.
- Add CSS variables in `src/styles` (or `index.css`) for light/dark palettes with accessible contrast.
- Write visual regression or snapshot tests (e.g., using `@testing-library/jest-dom` assertions) ensuring dark mode class toggles body attributes correctly.

**Validation:**
- `npm run lint` and `npm run test` pass.
- Running the app shows distinct palettes when toggling body data attribute.
- Contrast ratios meet WCAG AA (manual spot check for primary surfaces/text).

**Estimated Effort:** 45 minutes.

---

### [x] 2. Implement Theme Context with Persistence (TDD)
**Description:** Provide a React context/hook that manages `light`, `dark`, and `system` preferences with local storage fallback.

**Work Items:**
- Write unit tests for a new `useTheme` hook/context verifying default mode, updates, and persistence.
- Implement context provider applying `data-theme` or `class="dark"` on `document.documentElement`.
- Listen to `prefers-color-scheme` changes when in `system` mode and update theme reactively.

**Validation:**
- Tests cover preference switching, system listener, and storage hydration.
- TypeScript builds without errors.
- Theme updates propagate immediately to components.

**Estimated Effort:** 60 minutes.

**Dependencies:** Task 1.

---

### [x] 3. Build Theme Toggle Component (TDD)
**Description:** Create an accessible toggle/dropdown using shadcn/ui primitives that lets users pick Light, Dark, or System.

**Work Items:**
- Add component tests ensuring buttons/segments announce selected state and call context actions.
- Implement UI (likely segmented control or dropdown) with icons/text labels.
- Provide keyboard navigation and screen reader support.

**Validation:**
- Component tests pass covering all interactions.
- Toggle renders correctly against both themes.
- Component can be imported anywhere.

**Estimated Effort:** 45 minutes.

**Dependencies:** Task 2.

---

### [x] 4. Surface Toggle Across Application Shells (TDD)
**Description:** Embed the component in layout/header areas for host, player, TV, and auth screens.

**Work Items:**
- Write integration tests verifying toggle appears and updates theme on key routes.
- Update layout components to include toggle with responsive positioning.
- Ensure TV display mode auto-hides toggle after inactivity (if required) or remains unobtrusive.

**Validation:**
- Screens render without layout regressions in both themes.
- Tests confirm theme changes propagate to page content.
- Manual sanity check in dev server.

**Estimated Effort:** 60 minutes.

**Dependencies:** Task 3.

---

### [x] 5. Document and Polish Appearance Experience
**Description:** Update documentation and QA for accessibility and persistence behavior.

**Work Items:**
- Document theme support in README or dedicated docs.
- Add guidance for adding new theme-aware components.
- Perform manual testing (desktop/mobile) verifying persistence after reload and system preference syncing.

**Validation:**
- Docs merged and reviewed.
- Manual QA checklist completed.
- No accessibility regressions observed.

**Estimated Effort:** 30 minutes.

**Dependencies:** Task 4.

---

## Summary
- **Total Estimated Effort:** ~4 hours.
- **Parallelization:** Tasks 3 and 4 depend on context; otherwise sequential.
- **Key Risk:** Ensuring contrast ratios; coordinate with design stakeholders if adjustments needed.
