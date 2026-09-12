# Top Down Bottom Up Card

A Home Assistant dashboard card for blinds and honeycomb shades with independently controlled top and bottom edges. Built by [kevinconsen](https://github.com/KevinConsen).

- Shows the covered part of the window between two draggable edges.
- Drag the middle to move both covers while keeping the same coverage.
- Tap the track to move an individual edge.
- Compact, small, medium, large and automatic layouts.
- Detailed popup with positions, Stop and coverage presets.
- Visual editor, configurable actions and independent position inversion.
- Dutch interface when your Home Assistant language is Dutch; English otherwise.

## Requirements

Two different `cover` entities that report `current_position` and support `cover.set_cover_position`. Stopping requires `cover.stop_cover` support. The card uses physical height: **0% at the bottom, 100% at the top**. Enable Invert for any entity that reports the opposite direction.

The card is a frontend control. It does not provide a hardware interlock or synchronize the physical speeds of your covers.

## Install with HACS

1. Open HACS, open its menu and select **Custom repositories**.
2. Add `https://github.com/KevinConsen/dual-cover-card` with type **Dashboard**.
3. Find **Top Down Bottom Up Card** and download it.
4. Reload your browser. If HACS has not added a dashboard resource automatically, add `/hacsfiles/dual-cover-card/dual-cover-card.js` as a **JavaScript module** under dashboard resources.
5. Add **Top Down Bottom Up Card** to your dashboard and choose the two covers.

This repository is installed as a custom repository; it is not yet included in the HACS default catalog.

### Manual installation

Copy `dual-cover-card.js` into `/config/www/` and add `/local/dual-cover-card.js` as a JavaScript module resource. Reload the browser.

### Migrating from the development version

Replace the old `/local/plisse-card.js?v=…` resource with the new resource. **Do not load both files.** Existing `type: custom:plisse-card` configurations remain supported as an alias. New cards should use `custom:dual-cover-card`.

## Configuration

```yaml
type: custom:dual-cover-card
top_entity: cover.window_top
bottom_entity: cover.window_bottom
size: medium
open_popup: true
```

| Option | Default | Description |
| --- | --- | --- |
| `top_entity` | Required | Cover controlling the top edge. |
| `bottom_entity` | Required | Cover controlling the bottom edge. |
| `title` | Empty | Custom name. Empty displays “Honeycomb shades” or “Plisségordijn”. |
| `size` | `medium` | `compact`, `small`, `medium`, `large`, or `auto`. |
| `icon` | Top cover icon | Optional icon override. |
| `color` | Theme cover color | Optional CSS color, for example `'#926bc7'`. |
| `show_status` | `true` | Show coverage status. Errors remain visible regardless. |
| `show_position` | `false` | Show individual physical heights. |
| `show_buttons` | `false` | Show Stop and 50%, 75%, 100% coverage presets. |
| `open_popup` | `true` | Open detailed controls on a normal card tap. |
| `invert_top` | `false` | Reverse incoming and outgoing top-cover percentages. |
| `invert_bottom` | `false` | Reverse incoming and outgoing bottom-cover percentages. |
| `tap_action` | Popup | Explicit Home Assistant tap action. |
| `hold_action` | None | Home Assistant hold action. |
| `double_tap_action` | None | Home Assistant double-tap action. |

The visual editor provides these settings. Supported actions include None, More info, Toggle, Navigate, URL and Perform action. An explicit tap action, including None, takes precedence over the normal popup. When an error occurs, tapping always opens the error details instead.

## Layouts and controls

**Compact** shows three icon buttons without a slider: Open brings both edges to the rounded midpoint of their current positions; Stop stops both covers; Close sets the top to 100% and the bottom to 0%. These three buttons are always shown in Compact.

**Small** places the name vertically beside a 24–38px-wide controller. **Medium** uses a 56px maximum controller width, with optional buttons to the right. Small and medium have matching default card heights. **Large** uses a controller up to 130px wide, with buttons below.

**Auto** selects small below 260px card width, medium below 440px, and large at 440px or more. It never automatically selects Compact.

The popup always uses Large with positions and preset buttons visible. It shares known targets with cards using the same cover pair in the same browser page.

The 50%, 75% and 100% presets refer to **window coverage**, not entity position. They set top/bottom to 75/25, 88/13 and 100/0 respectively.

### Dragging and keyboard controls

- Drag either white grip to move its edge.
- Drag from the colored middle to shift both edges equally, bounded by the window ends.
- Tap the upper half of the fabric or the uncovered area above it to move the top edge; tap the lower half or uncovered area below it to move the bottom edge.
- Focus an edge and use arrow keys (1%), Page Up/Down (10%) or Home/End.
- Focus the middle and use Up/Down or Page Up/Down to shift both covers.

Commands are sent on release. The selected position remains visible for 800ms before returning to reported movement.

## Error handling

An error changes the card status to **Error**. Tap the card for details, even if the popup is normally disabled. The popup identifies missing/unavailable entities, invalid positions and failed commands per cover.

If Home Assistant does not acknowledge a command within 15 seconds, the UI becomes available again and shows a warning. The command might still execute; the card never retries automatically. A known target expires after two minutes and may generate a warning if arrival was not confirmed.

Known targets help constrain new edge movements while another cover is moving. Commands from other apps or browser sessions are not known as targets. Reported movement and arrival depend on the cover integration.

## Status and feedback

The implementation has been tested using simulated states and service calls, including inversion, partial failures, timeouts, gestures and shared targets. Development versions have also been used on the author's installation. Compatibility with other cover integrations and Home Assistant versions is not guaranteed; please report issues with your HA version, card configuration and reproduction steps, omitting credentials.

## License

[MIT](LICENSE) — Copyright (c) 2026 kevinconsen.
