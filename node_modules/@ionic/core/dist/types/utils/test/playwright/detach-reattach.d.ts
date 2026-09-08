import type { Locator } from '@playwright/test';
/**
 * Detaches an element and puts it back in a later task, the way a framework
 * binding relocates a subtree it owns.
 *
 * A single `appendChild` won't do it. Custom element reactions run at the end
 * of the same task, so `disconnectedCallback` fires with the element already
 * back and nothing tears down. The detach has to survive a task before the
 * disconnect is observable.
 *
 * Pass `containerSelector` to hold the element somewhere other than the body.
 */
export declare const detachAndReattach: (locator: Locator, containerSelector?: string) => Promise<void>;
