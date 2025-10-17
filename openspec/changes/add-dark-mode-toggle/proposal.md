# Proposal: Add Dark Mode Toggle

## Change ID
`add-dark-mode-toggle`

## Status
Applied

## Overview
Introduce a first-class appearance preference system so every user can switch between light mode, dark mode, or following the operating system setting. This includes a reusable theme toggle component, global styling primitives for both themes, and persistence so the app remembers the last preference across sessions.

## Motivation
Players and hosts frequently use the trivia app in dim venues (bars, restaurants, private events). A bright interface can cause eye strain and reduce screen legibility on TVs or phones in dark environments. Providing dark mode improves comfort and accessibility while keeping parity with modern user expectations.

## Scope
This change adds:
- Application-wide theme management that supports light, dark, and system modes
- UI control to switch theme preference from any screen (host, player, TV views)
- Persistence of theme choice per device with sane defaults and system sync
- Styling updates to ensure both themes meet contrast and accessibility requirements
- Automated tests for preference persistence and theme application

Out of scope:
- Per-team or per-account remote synchronization of theme preferences
- Custom color customization beyond the two predefined themes
- Animations or advanced transitions between themes (fade, morph, etc.)
- Any redesign of existing layouts beyond necessary contrast adjustments

## Impact
- **Frontend**: New theme provider, toggle component, Tailwind configuration updates for dark mode tokens, and wiring across layouts.
- **Styling**: Additional CSS variables and Tailwind `dark` variants to satisfy contrast requirements.
- **State Management**: Local storage (or equivalent) to remember appearance preference.
- **Testing**: New unit/component tests covering theme context, toggle behavior, and persistence logic.

## Dependencies
- Relies on existing Tailwind configuration from `styling-system` spec.
- Relies on shadcn/ui primitives from `component-library` spec for building the toggle control.

## Related Changes
None.

## Open Questions
- Should the theme toggle appear in onboarding/auth screens or only after authentication? *(Default assumption: available everywhere including auth landing for consistency.)*

## Approval Status
Awaiting review
