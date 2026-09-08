/**
 * Sanitize an untrusted HTML string.
 *
 * Parses the string into a detached DOM, removes blocked tags, strips
 * attributes outside the narrow `domStringAllowedAttributes` list (refer
 * `sanitizeElement`), and scrubs script-scheme URLs. Returns the sanitized
 * HTML string.
 *
 * Use this when you have an HTML string from an unknown source and need to
 * render it via `innerHTML`. Use `sanitizeDOMTree` instead when you already
 * have a DOM tree and want to sanitize it in place without a string round
 * trip. The two apply the same dangerous-vector scrubbing but different
 * attribute allowlists: this path stays narrow so existing consumers
 * (toast, loading, alert message, etc.) are unaffected, while
 * `sanitizeDOMTree` uses the wider rich-content allowlist.
 *
 * @param untrustedString - The HTML string to sanitize. Pass an
 * `IonicSafeString` to bypass sanitization, or `undefined` to short-circuit.
 * @returns The sanitized HTML string, or `undefined` if the input was
 * `undefined`. Returns `''` if sanitization fails or the input appears to
 * carry an inline `onload` handler.
 */
export declare const sanitizeDOMString: (untrustedString: IonicSafeString | string | undefined) => string | undefined;
/**
 * Sanitize an entire trusted DOM tree in place.
 *
 * Removes blocked tags (`script`, `iframe`, etc.) from the subtree and
 * then sanitizes attributes on every remaining element using the wider
 * `richContentAllowedAttributes` allowlist (refer `sanitizeElement`).
 * Component presentational attributes (`size`, `color`, `shape`, inline
 * SVG, `aria-*`, `data-*`) are preserved; `style`, event handlers (`on*`),
 * form/navigation-hijack attributes, script-scheme URLs, and non-image
 * `data:` URLs are stripped.
 *
 * Use this when you have a DOM tree the developer controls (e.g.
 * cloned slot content from a component) and you need to render it
 * elsewhere safely.
 *
 * @param root - The root element whose subtree will be sanitized in
 * place. No-op when the sanitizer is disabled via `Ionic.config`.
 */
export declare const sanitizeDOMTree: (root: HTMLElement) => void;
/**
 * Mirror known custom-element DOM properties onto attributes so they
 * survive `cloneNode`. Call this on a DOM subtree before cloning it for
 * rendering elsewhere (e.g. cloning slotted option content into an
 * overlay).
 *
 * Only sets the attribute when the property holds a non-empty string
 * and the attribute isn't already present, so existing attributes
 * take precedence.
 *
 * @param root - The root element whose subtree (and itself) will be
 * inspected.
 */
export declare const reflectPropertiesToAttributes: (root: Element) => void;
/**
 * Tags removed entirely (with their subtree) before attribute sanitization.
 * Exported so tests can assert the set without hardcoding it.
 */
export declare const blockedTags: string[];
export declare class IonicSafeString {
    value: string;
    constructor(value: string);
}
