/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { doc } from "../../utils/browser/index";
import { raf } from "../../utils/helpers";
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from "../../utils/native/haptic";
import { isPlatform } from "../../utils/platform";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot prefix - Content to show on the left side of the picker options.
 * @slot suffix - Content to show on the right side of the picker options.
 */
export class PickerColumn {
    constructor() {
        this.isScrolling = false;
        this.isColumnVisible = false;
        this.canExitInputMode = true;
        this.updateValueTextOnScroll = false;
        this.isUserScroll = false;
        /**
         * The haptics for the wheel picker are an iOS-only feature. As a result,
         * they should be disabled on Android.
         */
        this.enableHaptics = false;
        this.ariaLabel = null;
        this.isActive = false;
        /**
         * If `true`, the user cannot interact with the picker.
         */
        this.disabled = false;
        /**
         * If `true`, tapping the picker will
         * reveal a number input keyboard that lets
         * the user type in values for each picker
         * column. This is useful when working
         * with time pickers.
         *
         * @internal
         */
        this.numericInput = false;
        this.centerPickerItemInView = (target, smooth = true, canExitInputMode = true) => {
            const { isColumnVisible, scrollEl } = this;
            if (isColumnVisible && scrollEl) {
                // (Vertical offset from parent) - (three empty picker rows) + (half the height of the target to ensure the scroll triggers)
                const top = target.offsetTop - 3 * target.clientHeight + target.clientHeight / 2;
                if (scrollEl.scrollTop !== top) {
                    /**
                     * Setting this flag prevents input
                     * mode from exiting in the picker column's
                     * scroll callback. This is useful when the user manually
                     * taps an item or types on the keyboard as both
                     * of these can cause a scroll to occur.
                     */
                    this.canExitInputMode = canExitInputMode;
                    this.updateValueTextOnScroll = false;
                    /**
                     * This scroll takes over from whatever the user was doing, so an outside
                     * press must not commit an option the column is only passing through.
                     */
                    this.isUserScroll = false;
                    this.stopWatchingForOutsidePress();
                    scrollEl.scroll({
                        top,
                        left: 0,
                        behavior: smooth ? 'smooth' : undefined,
                    });
                }
            }
        };
        this.setPickerItemActiveState = (item, isActive) => {
            if (isActive) {
                item.classList.add(PICKER_ITEM_ACTIVE_CLASS);
            }
            else {
                item.classList.remove(PICKER_ITEM_ACTIVE_CLASS);
            }
        };
        /**
         * When ionInputModeChange is emitted, each column
         * needs to check if it is the one being made available
         * for text entry.
         */
        this.inputModeChange = (ev) => {
            if (!this.numericInput) {
                return;
            }
            const { useInputMode, inputModeColumn } = ev.detail;
            /**
             * If inputModeColumn is undefined then this means
             * all numericInput columns are being selected.
             */
            const isColumnActive = inputModeColumn === undefined || inputModeColumn === this.el;
            if (!useInputMode || !isColumnActive) {
                this.setInputModeActive(false);
                return;
            }
            this.setInputModeActive(true);
        };
        /**
         * Setting isActive will cause a re-render.
         * As a result, we do not want to cause the
         * re-render mid scroll as this will cause
         * the picker column to jump back to
         * whatever value was selected at the
         * start of the scroll interaction.
         */
        this.setInputModeActive = (state) => {
            if (this.isScrolling) {
                this.scrollEndCallback = () => {
                    this.isActive = state;
                };
                return;
            }
            this.isActive = state;
        };
        this.clearScrollEndTimeout = () => {
            if (this.scrollEndTimeout) {
                clearTimeout(this.scrollEndTimeout);
                this.scrollEndTimeout = undefined;
            }
        };
        /**
         * Resets the idle timer that commits the centered option.
         */
        this.resetScrollEndTimeout = () => {
            this.clearScrollEndTimeout();
            this.scrollEndTimeout = setTimeout(this.settle, SCROLL_END_DELAY);
        };
        /**
         * Capture so the column still commits if an application's own pointerdown
         * handler stops the event before it reaches the document.
         */
        this.watchForOutsidePress = () => {
            doc?.addEventListener('pointerdown', this.onPointerDownOutside, { capture: true });
        };
        this.stopWatchingForOutsidePress = () => {
            doc?.removeEventListener('pointerdown', this.onPointerDownOutside, { capture: true });
        };
        /**
         * Resets everything the current scroll interaction is holding, so nothing
         * pending on it can commit later.
         */
        this.discardScroll = () => {
            this.stopWatchingForOutsidePress();
            this.clearScrollEndTimeout();
            this.scrollEndCallback = undefined;
            this.centeredOption = undefined;
            this.haltedAtScrollTop = undefined;
            this.isScrolling = false;
            this.isUserScroll = false;
            this.canExitInputMode = true;
        };
        /**
         * Commits the option that is currently centered under the highlight and ends
         * the scroll interaction.
         */
        this.settle = () => {
            const { centeredOption } = this;
            this.clearScrollEndTimeout();
            this.stopWatchingForOutsidePress();
            this.isUserScroll = false;
            this.isScrolling = false;
            this.updateValueTextOnScroll = true;
            this.enableHaptics && hapticSelectionEnd();
            /**
             * Certain tasks (such as those that
             * cause re-renders) should only be done
             * once scrolling has finished, otherwise
             * flickering may occur.
             */
            const { scrollEndCallback } = this;
            if (scrollEndCallback) {
                scrollEndCallback();
                this.scrollEndCallback = undefined;
            }
            /**
             * Reset this flag as the
             * next scroll interaction could
             * be a scroll from the user. In this
             * case, we should exit input mode.
             */
            this.canExitInputMode = true;
            if (centeredOption !== undefined) {
                // Cleared here so a later scroll that centers nothing cannot fall back on it.
                this.centeredOption = undefined;
                if (centeredOption.isConnected) {
                    this.setValue(centeredOption.value);
                }
            }
        };
        /**
         * Commits the option the user can see when they press anything outside of the
         * column during a scroll they started. This runs on pointerdown rather than
         * click so the value is up to date by the time an application's own click
         * handler (a Save button, for example) reads it.
         */
        this.onPointerDownOutside = (ev) => {
            const { centeredOption, parentEl, scrollEl } = this;
            if (!this.isScrolling) {
                return;
            }
            /**
             * The column can live in another component's Shadow DOM, where a document
             * listener sees the target retargeted to the outer host. The composed path
             * is the only reliable way to tell a press on the column apart.
             */
            const path = ev.composedPath();
            /**
             * A press anywhere in the parent picker counts as inside, so reaching for a
             * sibling wheel leaves this column coasting.
             */
            if (path.includes(this.el) || (parentEl != null && path.includes(parentEl))) {
                return;
            }
            /**
             * Landing on the centered option halts the in-flight momentum scroll, so the
             * committed value and the option the user is left looking at agree. The
             * option list can be replaced mid-scroll, and a detached option has no
             * offset to center on.
             */
            if (centeredOption !== undefined && centeredOption.isConnected) {
                this.centerPickerItemInView(centeredOption, false, false);
                this.haltedAtScrollTop = scrollEl?.scrollTop;
            }
            this.settle();
        };
        /**
         * When the column scrolls, the component
         * needs to determine which item is centered
         * in the view and will emit an ionChange with
         * the item object.
         */
        this.initializeScrollListener = () => {
            this.enableHaptics = isPlatform('ios');
            const { el, scrollEl } = this;
            let activeEl = this.activeItem;
            const scrollCallback = () => {
                raf(() => {
                    /**
                     * This frame cannot be cancelled, and moving the column disconnects it
                     * without the observer reporting a change, so this checks live state.
                     */
                    if (!this.el.isConnected || !this.isColumnVisible || !scrollEl)
                        return;
                    const { haltedAtScrollTop } = this;
                    if (haltedAtScrollTop !== undefined) {
                        /**
                         * Still at the halted position, so this frame is the halt landing
                         * rather than the wheel moving, and re-arming would start a second
                         * commit cycle.
                         */
                        if (Math.abs(scrollEl.scrollTop - haltedAtScrollTop) <= HALT_TOLERANCE)
                            return;
                        this.haltedAtScrollTop = undefined;
                    }
                    // Armed before the early returns below, so a scroll never ends uncommitted.
                    this.resetScrollEndTimeout();
                    if (!this.isScrolling) {
                        this.enableHaptics && hapticSelectionStart();
                        this.isScrolling = true;
                    }
                    /**
                     * Only a user-driven scroll holds an uncommitted selection. Checked every
                     * frame because the user can take hold of the wheel mid-scroll, and
                     * re-adding the same listener is a no-op.
                     */
                    if (this.isUserScroll) {
                        this.watchForOutsidePress();
                    }
                    /**
                     * Select item in the center of the column
                     * which is the month/year that we want to select
                     */
                    const bbox = scrollEl.getBoundingClientRect();
                    const centerX = bbox.x + bbox.width / 2;
                    const centerY = bbox.y + bbox.height / 2;
                    /**
                     * elementFromPoint returns the top-most element.
                     * This means that if an ion-backdrop is overlaying the
                     * picker then the appropriate picker column option will
                     * not be selected. To account for this, we use elementsFromPoint
                     * and use an Array.find to find the appropriate column option
                     * at that point.
                     *
                     * Additionally, the picker column could be used in the
                     * Shadow DOM (i.e. in ion-datetime) so we need to make
                     * sure we are choosing the correct host otherwise
                     * the elements returns by elementsFromPoint will be
                     * retargeted. To account for this, we check to see
                     * if the picker column has a parent shadow root. If
                     * so, we use that shadow root when doing elementsFromPoint.
                     * Otherwise, we just use the document.
                     */
                    const rootNode = el.getRootNode();
                    const hasParentShadow = rootNode instanceof ShadowRoot;
                    const referenceNode = hasParentShadow ? rootNode : doc;
                    /**
                     * If the reference node is undefined
                     * then it's likely that doc is undefined
                     * due to being in an SSR environment.
                     */
                    if (referenceNode === undefined) {
                        return;
                    }
                    const elementsAtPoint = referenceNode.elementsFromPoint(centerX, centerY);
                    /**
                     * elementsFromPoint can returns multiple elements
                     * so find the relevant picker column option if one exists.
                     */
                    let newActiveElement = elementsAtPoint.find((el) => el.tagName === 'ION-PICKER-COLUMN-OPTION');
                    /**
                     * TODO(FW-6594): Remove this workaround when iOS 16 is no longer
                     * supported.
                     *
                     * If `elementsFromPoint` failed to find the active element (a known
                     * issue on iOS 16 when elements are in a Shadow DOM and the
                     * referenceNode is the document), a fallback to `elementFromPoint`
                     * is used. While `elementsFromPoint` returns all elements,
                     * `elementFromPoint` returns only the top-most, which is sufficient
                     * for this use case and appears to handle Shadow DOM retargeting
                     * more reliably in this specific iOS bug.
                     */
                    if (newActiveElement === undefined) {
                        const fallbackActiveElement = referenceNode.elementFromPoint(centerX, centerY);
                        if (fallbackActiveElement?.tagName === 'ION-PICKER-COLUMN-OPTION') {
                            newActiveElement = fallbackActiveElement;
                        }
                    }
                    /**
                     * A scroll can land with no selectable option centered, such as an
                     * overscroll bounce briefly centering the empty padding rows. Keep the
                     * current selection until an option is centered again.
                     */
                    if (newActiveElement === undefined || newActiveElement.disabled) {
                        return;
                    }
                    if (activeEl !== undefined) {
                        this.setPickerItemActiveState(activeEl, false);
                    }
                    /**
                     * If we are selecting a new value,
                     * we need to run haptics again.
                     */
                    if (newActiveElement !== activeEl) {
                        this.enableHaptics && hapticSelectionChanged();
                        if (this.canExitInputMode) {
                            /**
                             * The native iOS wheel picker
                             * only dismisses the keyboard
                             * once the selected item has changed
                             * as a result of a swipe
                             * from the user. If `canExitInputMode` is
                             * `false` then this means that the
                             * scroll is happening as a result of
                             * the `value` property programmatically changing
                             * either by an application or by the user via the keyboard.
                             */
                            this.exitInputMode();
                        }
                    }
                    activeEl = newActiveElement;
                    this.setPickerItemActiveState(newActiveElement, true);
                    /**
                     * Set the aria-valuetext even though the value prop has not been updated yet.
                     * This enables some screen readers to announce the value as the users drag
                     * as opposed to when their release their pointer from the screen.
                     *
                     * When the value is programmatically updated, we will smoothly scroll
                     * to the new option. However, we do not want to update aria-valuetext mid-scroll
                     * as that can cause the old value to be briefly set before being set to the
                     * correct option. This will cause some screen readers to announce the old value
                     * again before announcing the new value. The correct valuetext will be set on render.
                     */
                    if (this.updateValueTextOnScroll) {
                        this.assistiveFocusable?.setAttribute('aria-valuetext', this.getOptionValueText(newActiveElement));
                    }
                    this.centeredOption = newActiveElement;
                });
            };
            const userScrollCallback = () => {
                this.isUserScroll = true;
                // Taking hold of the wheel ends the halt even if it has not moved yet.
                this.haltedAtScrollTop = undefined;
            };
            /**
             * Wrap this in an raf so that the scroll callback
             * does not fire when component is initially shown.
             */
            raf(() => {
                if (!scrollEl)
                    return;
                scrollEl.addEventListener('scroll', scrollCallback);
                scrollEl.addEventListener('pointerdown', userScrollCallback);
                scrollEl.addEventListener('wheel', userScrollCallback, { passive: true });
                /**
                 * A `pointerdown` fires once per touch, so a drag that pauses long enough
                 * to commit would look like a scroll the column started. A `touchmove`
                 * keeps arriving while the finger moves.
                 */
                scrollEl.addEventListener('touchmove', userScrollCallback, { passive: true });
                this.destroyScrollListener = () => {
                    scrollEl.removeEventListener('scroll', scrollCallback);
                    scrollEl.removeEventListener('pointerdown', userScrollCallback);
                    scrollEl.removeEventListener('wheel', userScrollCallback);
                    scrollEl.removeEventListener('touchmove', userScrollCallback);
                };
            });
        };
        /**
         * Tells the parent picker to
         * exit text entry mode. This is only called
         * when the selected item changes during scroll, so
         * we know that the user likely wants to scroll
         * instead of type.
         */
        this.exitInputMode = () => {
            const { parentEl } = this;
            if (parentEl == null)
                return;
            parentEl.exitInputMode();
            /**
             * setInputModeActive only takes
             * effect once scrolling stops to avoid
             * a component re-render while scrolling.
             * However, we want the visual active
             * indicator to go away immediately, so
             * we call classList.remove here.
             */
            this.el.classList.remove('picker-column-active');
        };
        /**
         * Find the next enabled option after the active option.
         * @param stride - How many options to "jump" over in order to select the next option.
         * This can be used to implement PageUp/PageDown behaviors where pressing these keys
         * scrolls the picker by more than 1 option. For example, a stride of 5 means select
         * the enabled option 5 options after the active one. Note that the actual option selected
         * may be past the stride if the option at the stride is disabled.
         */
        this.findNextOption = (stride = 1) => {
            const { activeItem } = this;
            if (!activeItem)
                return null;
            let prevNode = activeItem;
            let node = activeItem.nextElementSibling;
            while (node != null) {
                if (stride > 0) {
                    stride--;
                }
                if (node.tagName === 'ION-PICKER-COLUMN-OPTION' && !node.disabled && stride === 0) {
                    return node;
                }
                prevNode = node;
                // Use nextElementSibling instead of nextSibling to avoid text/comment nodes
                node = node.nextElementSibling;
            }
            return prevNode;
        };
        /**
         * Find the next enabled option after the active option.
         * @param stride - How many options to "jump" over in order to select the next option.
         * This can be used to implement PageUp/PageDown behaviors where pressing these keys
         * scrolls the picker by more than 1 option. For example, a stride of 5 means select
         * the enabled option 5 options before the active one. Note that the actual option selected
         *  may be past the stride if the option at the stride is disabled.
         */
        this.findPreviousOption = (stride = 1) => {
            const { activeItem } = this;
            if (!activeItem)
                return null;
            let nextNode = activeItem;
            let node = activeItem.previousElementSibling;
            while (node != null) {
                if (stride > 0) {
                    stride--;
                }
                if (node.tagName === 'ION-PICKER-COLUMN-OPTION' && !node.disabled && stride === 0) {
                    return node;
                }
                nextNode = node;
                // Use previousElementSibling instead of previousSibling to avoid text/comment nodes
                node = node.previousElementSibling;
            }
            return nextNode;
        };
        this.onKeyDown = (ev) => {
            /**
             * The below operations should be inverted when running on a mobile device.
             * For example, swiping up will dispatch an "ArrowUp" event. On desktop,
             * this should cause the previous option to be selected. On mobile, swiping
             * up causes a view to scroll down. As a result, swiping up on mobile should
             * cause the next option to be selected. The Home/End operations remain
             * unchanged because those always represent the first/last options, respectively.
             */
            const mobile = isPlatform('mobile');
            let newOption = null;
            switch (ev.key) {
                case 'ArrowDown':
                    newOption = mobile ? this.findPreviousOption() : this.findNextOption();
                    break;
                case 'ArrowUp':
                    newOption = mobile ? this.findNextOption() : this.findPreviousOption();
                    break;
                case 'PageUp':
                    newOption = mobile ? this.findNextOption(5) : this.findPreviousOption(5);
                    break;
                case 'PageDown':
                    newOption = mobile ? this.findPreviousOption(5) : this.findNextOption(5);
                    break;
                case 'Home':
                    /**
                     * There is no guarantee that the first child will be an ion-picker-column-option,
                     * so we do not use firstElementChild.
                     */
                    newOption = this.el.querySelector('ion-picker-column-option:first-of-type');
                    break;
                case 'End':
                    /**
                     * There is no guarantee that the last child will be an ion-picker-column-option,
                     * so we do not use lastElementChild.
                     */
                    newOption = this.el.querySelector('ion-picker-column-option:last-of-type');
                    break;
                default:
                    break;
            }
            if (newOption !== null) {
                this.setValue(newOption.value);
                // This stops any default browser behavior such as scrolling
                ev.preventDefault();
            }
        };
        /**
         * Utility to generate the correct text for aria-valuetext.
         */
        this.getOptionValueText = (el) => {
            return el ? el.getAttribute('aria-label') ?? el.innerText : '';
        };
    }
    ariaLabelChanged(newValue) {
        this.ariaLabel = newValue;
    }
    valueChange() {
        if (this.isColumnVisible) {
            /**
             * Only scroll the active item into view when the picker column
             * is actively visible to the user.
             */
            this.scrollActiveItemIntoView(true);
        }
    }
    /**
     * Only setup scroll listeners
     * when the picker is visible, otherwise
     * the container will have a scroll
     * height of 0px.
     */
    componentWillLoad() {
        /**
         * We cache parentEl in a local variable
         * so we don't need to keep accessing
         * the class variable (which comes with
         * a small performance hit)
         */
        const parentEl = (this.parentEl = this.el.closest('ion-picker'));
        const visibleCallback = (entries) => {
            /**
             * Browsers will sometimes group multiple IO events into a single callback.
             * As a result, we want to grab the last/most recent event in case there are multiple events.
             */
            const ev = entries[entries.length - 1];
            if (ev.isIntersecting) {
                const { activeItem, el } = this;
                this.isColumnVisible = true;
                /**
                 * Because this initial call to scrollActiveItemIntoView has to fire before
                 * the scroll listener is set up, we need to manage the active class manually.
                 */
                const oldActive = el.querySelector(`.${PICKER_ITEM_ACTIVE_CLASS}`);
                if (oldActive) {
                    this.setPickerItemActiveState(oldActive, false);
                }
                this.scrollActiveItemIntoView();
                if (activeItem) {
                    this.setPickerItemActiveState(activeItem, true);
                }
                this.initializeScrollListener();
            }
            else {
                this.isColumnVisible = false;
                /**
                 * The pending timer still runs so it resets the scroll state, but the
                 * option it would have committed is dropped. A column the user cannot
                 * see should not change its value.
                 */
                this.stopWatchingForOutsidePress();
                this.centeredOption = undefined;
                this.haltedAtScrollTop = undefined;
                if (this.destroyScrollListener) {
                    this.destroyScrollListener();
                    this.destroyScrollListener = undefined;
                }
            }
        };
        /**
         * Set the root to be the parent picker element
         * This causes the IO callback
         * to be fired in WebKit as soon as the element
         * is visible. If we used the default root value
         * then WebKit would only fire the IO callback
         * after any animations (such as a modal transition)
         * finished, and there would potentially be a flicker.
         */
        new IntersectionObserver(visibleCallback, { threshold: 0.001, root: this.parentEl }).observe(this.el);
        if (parentEl !== null) {
            // TODO(FW-2832): type
            parentEl.addEventListener('ionInputModeChange', (ev) => this.inputModeChange(ev));
        }
    }
    componentDidRender() {
        const { el, activeItem, isColumnVisible, value } = this;
        if (isColumnVisible && !activeItem) {
            const firstOption = el.querySelector('ion-picker-column-option');
            /**
             * If the picker column does not have an active item and the current value
             * does not match the first item in the picker column, that means
             * the value is out of bounds. In this case, we assign the value to the
             * first item to match the scroll position of the column.
             *
             */
            if (firstOption !== null && firstOption.value !== value) {
                this.setValue(firstOption.value);
            }
        }
    }
    /** @internal  */
    async scrollActiveItemIntoView(smooth = false) {
        const activeEl = this.activeItem;
        if (activeEl) {
            this.centerPickerItemInView(activeEl, smooth, false);
        }
    }
    /**
     * Sets the value prop and fires the ionChange event.
     * This is used when we need to fire ionChange from
     * user-generated events that cannot be caught with normal
     * input/change event listeners.
     * @internal
     */
    async setValue(value) {
        if (this.disabled === true || this.value === value) {
            return;
        }
        this.value = value;
        this.ionChange.emit({ value });
    }
    /**
     * Sets focus on the scrollable container within the picker column.
     * Use this method instead of the global `pickerColumn.focus()`.
     */
    async setFocus() {
        if (this.assistiveFocusable) {
            this.assistiveFocusable.focus();
        }
    }
    connectedCallback() {
        this.ariaLabel = this.el.getAttribute('aria-label') ?? 'Select a value';
    }
    disconnectedCallback() {
        /**
         * A pending settle would otherwise commit a value on a column that is no
         * longer in the DOM.
         */
        this.discardScroll();
    }
    get activeItem() {
        const { value } = this;
        const options = Array.from(this.el.querySelectorAll('ion-picker-column-option'));
        return options.find((option) => {
            /**
             * If the whole picker column is disabled, the current value should appear active
             * If the current value item is specifically disabled, it should not appear active
             */
            if (!this.disabled && option.disabled) {
                return false;
            }
            return option.value === value;
        });
    }
    render() {
        const { color, disabled, isActive, numericInput } = this;
        const mode = getIonMode(this);
        return (h(Host, { key: '60a893619d0b01fba53fbccef67a10d533a22657', class: createColorClasses(color, {
                [mode]: true,
                ['picker-column-active']: isActive,
                ['picker-column-numeric-input']: numericInput,
                ['picker-column-disabled']: disabled,
            }) }, h("slot", { key: '79f1e047f89c5ec916ed02efaac56ef3f73b8969', name: "prefix" }), h("div", { key: 'c45c86e88353a196ff38159f40f390bc27852c9e', class: "picker-opts", ref: (el) => {
                this.scrollEl = el;
            }, role: "slider", tabindex: this.disabled ? undefined : 0, "aria-label": this.ariaLabel, "aria-valuemin": 0, "aria-valuemax": 0, "aria-valuenow": 0, "aria-valuetext": this.getOptionValueText(this.activeItem), "aria-orientation": "vertical", onKeyDown: (ev) => this.onKeyDown(ev) }, h("div", { key: 'e02d76752f5d3dd4cd2846fbc28645f1508a4b49', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: 'd577bcbadc530970b2781692b050811633625c5a', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: 'c89e78c3a896bc1f55b922d01df16fdbb1259bdd', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("slot", { key: '6c597ff899692597432ee2aa0b42de53b86deed4' }), h("div", { key: '91686ed94f14c47647836ed4d63e54b5c54ee3b9', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '2ff058c6d0e8cef4e143c2d848f9a52684579af1', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: 'bc7386bec6fced36e44084a7a137b3fe6506c996', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0")), h("slot", { key: '8835fd3f4e025bce964e6f05984c9aaadc20d7fb', name: "suffix" })));
    }
    static get is() { return "ion-picker-column"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["picker-column.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["picker-column.css"]
        };
    }
    static get properties() {
        return {
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the user cannot interact with the picker."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "value": {
                "type": "any",
                "mutable": true,
                "complexType": {
                    "original": "string | number",
                    "resolved": "number | string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The selected option in the picker."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "value"
            },
            "color": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Color",
                    "resolved": "\"danger\" | \"dark\" | \"light\" | \"medium\" | \"primary\" | \"secondary\" | \"success\" | \"tertiary\" | \"warning\" | string & Record<never, never> | undefined",
                    "references": {
                        "Color": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::Color",
                            "referenceLocation": "Color"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "color"
            },
            "numericInput": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "If `true`, tapping the picker will\nreveal a number input keyboard that lets\nthe user type in values for each picker\ncolumn. This is useful when working\nwith time pickers."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "numeric-input",
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "ariaLabel": {},
            "isActive": {}
        };
    }
    static get events() {
        return [{
                "method": "ionChange",
                "name": "ionChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the value has changed.\n\nThis event will not emit when programmatically setting the `value` property."
                },
                "complexType": {
                    "original": "PickerColumnChangeEventDetail",
                    "resolved": "PickerColumnChangeEventDetail",
                    "references": {
                        "PickerColumnChangeEventDetail": {
                            "location": "import",
                            "path": "./picker-column-interfaces",
                            "id": "src/components/picker-column/picker-column-interfaces.ts::PickerColumnChangeEventDetail",
                            "referenceLocation": "PickerColumnChangeEventDetail"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "scrollActiveItemIntoView": {
                "complexType": {
                    "signature": "(smooth?: boolean) => Promise<void>",
                    "parameters": [{
                            "name": "smooth",
                            "type": "boolean",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            },
            "setValue": {
                "complexType": {
                    "signature": "(value: PickerColumnValue) => Promise<void>",
                    "parameters": [{
                            "name": "value",
                            "type": "string | number | undefined",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "PickerColumnValue": {
                            "location": "import",
                            "path": "./picker-column-interfaces",
                            "id": "src/components/picker-column/picker-column-interfaces.ts::PickerColumnValue",
                            "referenceLocation": "PickerColumnValue"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Sets the value prop and fires the ionChange event.\nThis is used when we need to fire ionChange from\nuser-generated events that cannot be caught with normal\ninput/change event listeners.",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            },
            "setFocus": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Sets focus on the scrollable container within the picker column.\nUse this method instead of the global `pickerColumn.focus()`.",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "aria-label",
                "methodName": "ariaLabelChanged"
            }, {
                "propName": "value",
                "methodName": "valueChange"
            }];
    }
}
const PICKER_ITEM_ACTIVE_CLASS = 'option-active';
/**
 * How long the column must be idle before the centered option is treated as
 * the user's selection. Replaceable by the `scrollend` event once that is
 * supported everywhere (https://caniuse.com/?search=scrollend).
 */
const SCROLL_END_DELAY = 250;
/**
 * How far, in pixels, the column may report from where it was halted and still
 * count as having stayed there. Centering targets a position between two snap
 * points, so mandatory snapping corrects it by half the column height less
 * three option heights: 2px at the default sizes.
 */
const HALT_TOLERANCE = 2;
