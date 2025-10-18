# appearance-theming Specification

## Purpose
Provide consistent light and dark appearance modes across the trivia experience with a user-controlled toggle and system preference integration.

## ADDED Requirements

### Requirement: Theme Modes and Default Behavior
The system SHALL support `light`, `dark`, and `system` appearance modes with a sensible default.

#### Scenario: Default follows system preference
- **WHEN** a first-time visitor loads the application
- **THEN** the UI initializes using the operating system's preferred color scheme
- **AND** the stored preference is set to `system`

#### Scenario: System preference changes in real time
- **WHEN** the user's operating system switches between light and dark while the app is open
- **AND** the stored preference is `system`
- **THEN** the application updates its theme within one animation frame
- **AND** UI components re-render using the new tokens without reload

#### Scenario: Explicit mode overrides system
- **WHEN** a user selects `light` or `dark` manually
- **THEN** the UI switches immediately to that mode
- **AND** further operating system changes do not affect the selected mode until the user returns to `system`

### Requirement: Theme Persistence and Hydration
The system SHALL remember the last selected appearance mode per device and hydrate before first paint.

#### Scenario: Preference persists across reloads
- **WHEN** a user selects a theme and reloads the page later
- **THEN** the previously selected mode is restored before React mounts
- **AND** there is no visible flash of the wrong theme during load

#### Scenario: Storage fallback works without localStorage
- **GIVEN** browser storage is unavailable (e.g., private mode restrictions)
- **WHEN** the user selects a theme
- **THEN** the preference remains active for the session using an in-memory fallback
- **AND** the UI displays a non-blocking warning if persistence is not possible

#### Scenario: Preference can be reset
- **WHEN** the user chooses an option to reset or selects `system`
- **THEN** stored overrides are cleared
- **AND** future loads follow OS preference again

### Requirement: Theme Toggle Component Accessibility
The system SHALL provide an accessible control that lets users choose appearance mode from anywhere in the app.

#### Scenario: Toggle is keyboard and screen reader friendly
- **WHEN** navigating with keyboard or assistive technology
- **THEN** the toggle control is focusable in a logical order
- **AND** the current selection is announced via ARIA attributes
- **AND** users can switch modes using keyboard input alone

#### Scenario: Toggle available across app surfaces
- **WHEN** viewing host controls, player UI, TV display, or authentication screens
- **THEN** the appearance toggle is visible or reachable via a consistent affordance
- **AND** its placement does not obstruct critical gameplay controls

#### Scenario: Toggle reflects current mode with icons/text
- **WHEN** a mode is active
- **THEN** the toggle visually indicates the active selection with icons and/or labels
- **AND** hovering or focusing explains each option (e.g., tooltip or sr-only text)

### Requirement: Theming Tokens and Contrast
The system SHALL define color tokens and CSS variables ensuring both themes meet accessibility contrast requirements.

#### Scenario: Tokens cover core UI elements
- **WHEN** referencing theme variables for background, surface, text, accent, and danger states
- **THEN** both light and dark palettes provide values for each token
- **AND** components use tokens instead of hardcoded colors

#### Scenario: Contrast meets WCAG AA
- **WHEN** evaluating primary text against its background in either theme
- **THEN** contrast ratios meet or exceed 4.5:1 for body text and 3:1 for large text/icons
- **AND** focus indicators remain visible in both modes

#### Scenario: Tailwind utilities map to tokens
- **WHEN** applying Tailwind classes that reference the tokens (e.g., via `bg-background`)
- **THEN** both themes render the correct colors by switching a root data attribute or class
- **AND** no rebuild is required to change themes at runtime
