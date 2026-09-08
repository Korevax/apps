import type { VNode } from '../stencil-public-runtime';
import type { RichContentOption as RichContentOpt } from '../components/select/select-interface';
interface RichContentOption extends RichContentOpt {
    /** Unique identifier for stable virtual DOM keys across re-renders. */
    id: string;
    /** The main label for the option as a string or an HTMLElement. */
    label?: string | HTMLElement;
}
/**
 * Converts a DOM node into a Stencil VNode (or text string) so the
 * resulting tree is rendered through the component's normal render
 * path. Rendering through Stencil ensures that scoped CSS classes
 * (e.g. `sc-ion-action-sheet-ionic`) are applied to every element.
 *
 * Highly recommended to pre-sanitize the source DOM (see
 * `getOptionContent` in select.tsx). This function performs pure
 * structural conversion — no security filtering.
 *
 * Preserves attributes only — properties set imperatively on the source
 * element (e.g. `input.value` after a user types) won't carry through.
 * In practice this isn't a concern: interactive controls shouldn't
 * appear in select-option rich content since they'd nest inside the
 * overlay's button/radio/checkbox wrapper, which is invalid HTML and
 * an accessibility issue.
 *
 * @param node - The DOM node to convert. Text nodes become strings,
 * element nodes become VNodes, and any other node types are skipped.
 * @param keyPrefix - String prefix used to build a stable VNode key,
 * so Stencil's diff can preserve elements across re-renders.
 * @param index - Position of this node among its siblings. Combined
 * with `keyPrefix` to form the final unique key.
 * @returns The converted VNode, a text string, or `null` if the node
 * type isn't supported.
 *
 * @internal Exported only so it can be unit tested; not part of the
 * public API.
 */
export declare const cloneToVNode: (node: Node, keyPrefix: string, index: number) => VNode | string | null;
/**
 * Renders the label content for a select option within an overlay
 * interface based on the presence of rich content.
 *
 * Span elements should be used when this content renders within buttons,
 * depending on the select interface. Buttons can only have phrasing
 * content to prevent accessibility issues.
 *
 * @param option - The content option data containing label, slots,
 * and description.
 * @param className - The base CSS class for the label element.
 * @param useSpan - Whether to use a span element instead of a div for the label.
 */
export declare const renderOptionLabel: (option: RichContentOption, className: string, useSpan?: boolean) => HTMLElement | string | undefined;
export {};
