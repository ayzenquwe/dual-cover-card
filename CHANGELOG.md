# Changelog

## 0.2.5

- Keep pending rail targets visible and use them consistently for drawing, gestures and movement limits.
- Replace the 800ms preview and early stopped-short checks with a 30-second inactivity timeout, extended by position or movement-state changes, plus a two-minute overall limit.
- Preserve pending targets across shared dashboard/popup views; handle arrival, Stop, rejection, replacement and unavailable reports independently per rail.
- Avoid false overlap errors from mixed-age reports while valid targets are pending and extend simulated lifecycle regressions.

## 0.2.4

- Tolerate one percentage point of reported rail overlap caused by rounded motor positions, including inverted covers.
- Accept target arrival within one percentage point during reconciliation, stopped-short checks and the motion timeout.
- Keep outgoing command boundaries strict and add simulated regression tests for tolerance and genuine errors.

## 0.2.2

- Enlarge touch targets around both slider grips without changing their appearance.
- Choose the nearest grip when touch targets overlap; keep the central area available for moving both covers.

## 0.2.1

- Rename the project, HACS listing and card picker entry to Dual Cover Card.

- Allow wider pill-shaped buttons in horizontal Compact layouts.
- Center the Medium slider and preset buttons as one closely spaced group.
- Restore spacing between Layout and Controls in the editor.

## 0.2.0

- Keep Medium sliders at least 38px wide; reduce buttons and spacing on narrow cards.
- Hide the header icon when needed to fit the status.
- Restore the vertical resize cursor on slider grips.
- Show combined inward/outward movement icons for opposing cover directions.
- Avoid immediate stopped-short errors when targets are replaced during movement.
- Display vertical presets as 100%, 75%, 50%, Stop.
- Make layout illustrations fit their mobile selection boxes.
- Add vertical/horizontal Compact orientation, with a narrow-width fallback.
- Add a non-operational setup preview and cover suggestions in the card picker (suggestions require HA 2026.6+).

Validated with simulated states, commands and gestures. Actual mobile rendering and native card picker behavior still need checking after installation.

## 0.1.0

Initial public release.
