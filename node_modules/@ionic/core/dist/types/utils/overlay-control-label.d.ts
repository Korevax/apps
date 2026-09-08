import type { Mode } from '../interface';
/**
 * Returns the default `labelPlacement` for a radio or checkbox option
 * rendered inside an overlay. Defaults follow each mode's established
 * option-row layout:
 * - `ios`: `"start"` for radio in `alert` and `popover`. The `modal`
 *   interface flips iOS radio back to `"end"`. Checkbox is always
 *   `"end"` on iOS.
 * - everything else (e.g. `md`): `"end"`.
 *
 * `interfaceType` is optional; only `"modal"` changes the result, so
 * callers that aren't a modal can omit it.
 *
 * Used by `select-popover` and `select-modal` as the fallback when an
 * option doesn't explicitly set `labelPlacement`.
 */
export declare const getOverlayLabelPlacement: (mode: Mode, control: "radio" | "checkbox", interfaceType?: "alert" | "popover" | "modal") => "start" | "end";
/**
 * Returns the default `justify` for a radio or checkbox option rendered
 * inside an overlay. Defaults follow each mode's option-row layout:
 * - `ios`: `"space-between"` for radio in `alert` and `popover`. The
 *   `modal` interface falls back to `"start"`. Checkbox is always `"start"`
 *   on iOS.
 * - everything else (e.g. `md`): `"start"`.
 *
 * `interfaceType` is optional; only `"modal"` changes the result, so
 * callers that aren't a modal can omit it.
 *
 * Used by `select-popover` and `select-modal` as the fallback when an
 * option doesn't explicitly set `justify`.
 */
export declare const getOverlayLabelJustify: (mode: Mode, control: "radio" | "checkbox", interfaceType?: "alert" | "popover" | "modal") => "start" | "end" | "space-between";
