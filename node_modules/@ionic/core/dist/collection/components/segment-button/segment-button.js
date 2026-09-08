/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h } from "@stencil/core";
import { addEventListener, removeEventListener, inheritAttributes } from "../../utils/helpers";
import { printIonError, printIonWarning } from "../../utils/logging/index";
import { hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
let ids = 0;
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part indicator - The indicator displayed on the checked segment button.
 * @part indicator-background - The background element for the indicator displayed on the checked segment button.
 */
export class SegmentButton {
    constructor() {
        this.segmentEl = null;
        this.inheritedAttributes = {};
        this.checked = false;
        /**
         * If `true`, the user cannot interact with the segment button.
         */
        this.disabled = false;
        /**
         * Set the layout of the text and icon in the segment.
         */
        this.layout = 'icon-top';
        /**
         * The type of the button.
         */
        this.type = 'button';
        /**
         * The value of the segment button.
         */
        this.value = 'ion-sb-' + ids++;
        this.updateStyle = () => {
            forceUpdate(this);
        };
        this.updateState = () => {
            const { segmentEl } = this;
            if (segmentEl) {
                this.checked = segmentEl.value === this.value;
                if (segmentEl.disabled) {
                    this.disabled = true;
                }
            }
        };
    }
    valueChanged() {
        this.updateState();
    }
    connectedCallback() {
        const segmentEl = (this.segmentEl = this.el.closest('ion-segment'));
        if (segmentEl) {
            this.updateState();
            addEventListener(segmentEl, 'ionSelect', this.updateState);
            addEventListener(segmentEl, 'ionStyle', this.updateStyle);
        }
    }
    disconnectedCallback() {
        const segmentEl = this.segmentEl;
        if (segmentEl) {
            removeEventListener(segmentEl, 'ionSelect', this.updateState);
            removeEventListener(segmentEl, 'ionStyle', this.updateStyle);
            this.segmentEl = null;
        }
    }
    componentWillLoad() {
        this.inheritedAttributes = {
            ...inheritAttributes(this.el, ['aria-label']),
        };
        // Return if there is no contentId defined
        if (!this.contentId)
            return;
        /**
         * Checked here rather than in `connectedCallback` so frameworks that assign element
         * props after inserting the element have set `disabled` by now. A disabled ion-segment
         * pushes that onto its buttons too, which this guard should not undo.
         */
        if (this.disabled && this.segmentEl?.disabled !== true) {
            printIonWarning(`[ion-segment-button] - Segment buttons cannot be disabled when associated with an <ion-segment-content>.`);
            this.disabled = false;
        }
        // Attempt to find the Segment Content by its contentId
        const segmentContent = document.getElementById(this.contentId);
        // If no associated Segment Content exists, log an error and return
        if (!segmentContent) {
            printIonError(`[ion-segment-button] - Unable to find Segment Content with id="${this.contentId}".`);
            return;
        }
        // Ensure the found element is a valid ION-SEGMENT-CONTENT
        if (segmentContent.tagName !== 'ION-SEGMENT-CONTENT') {
            printIonError(`[ion-segment-button] - Element with id="${this.contentId}" is not an <ion-segment-content> element.`);
            return;
        }
    }
    get hasLabel() {
        return !!this.el.querySelector('ion-label');
    }
    get hasIcon() {
        return !!this.el.querySelector('ion-icon');
    }
    /**
     * @internal
     * Focuses the native <button> element
     * inside of ion-segment-button.
     */
    async setFocus() {
        const { nativeEl } = this;
        if (nativeEl !== undefined) {
            nativeEl.focus();
        }
    }
    render() {
        const { checked, type, disabled, hasIcon, hasLabel, layout, segmentEl } = this;
        const mode = getIonMode(this);
        const hasSegmentColor = () => segmentEl?.color !== undefined;
        return (h(Host, { key: 'd8acc71d87e26b32f20b2d0f9a6acc9f0dab0dee', class: {
                [mode]: true,
                'in-toolbar': hostContext('ion-toolbar', this.el),
                'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
                'in-segment': hostContext('ion-segment', this.el),
                'in-segment-color': hasSegmentColor(),
                'segment-button-has-label': hasLabel,
                'segment-button-has-icon': hasIcon,
                'segment-button-has-label-only': hasLabel && !hasIcon,
                'segment-button-has-icon-only': hasIcon && !hasLabel,
                'segment-button-disabled': disabled,
                'segment-button-checked': checked,
                [`segment-button-layout-${layout}`]: true,
                'ion-activatable': true,
                'ion-activatable-instant': true,
                'ion-focusable': true,
            } }, h("button", { key: 'ce65da07b1a012bce353b3c6c24eecfbd4071d54', "aria-selected": checked ? 'true' : 'false', role: "tab", ref: (el) => (this.nativeEl = el), type: type, class: "button-native", part: "native", disabled: disabled, ...this.inheritedAttributes }, h("span", { key: '6c4b4dcd20e407e5dc31674bea23633d8a09187a', class: "button-inner" }, h("slot", { key: '817145ae77a3c5ada88ab95723d881f1bde96b2a' })), mode === 'md' && h("ion-ripple-effect", { key: '054d7e5e2a13013914fac6bbde8efdb28d9b459e' })), h("div", { key: 'c48074881a302510ad4752eeb9383222cd3a54cb', part: "indicator", class: "segment-button-indicator segment-button-indicator-animated" }, h("div", { key: '7672a6b10ee18ad026b798fbd8207dc3cd5683f9', part: "indicator-background", class: "segment-button-indicator-background" }))));
    }
    static get is() { return "ion-segment-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["segment-button.ios.scss"],
            "md": ["segment-button.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["segment-button.ios.css"],
            "md": ["segment-button.md.css"]
        };
    }
    static get properties() {
        return {
            "contentId": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The `id` of the segment content."
                },
                "getter": false,
                "setter": false,
                "reflect": true,
                "attribute": "content-id"
            },
            "disabled": {
                "type": "boolean",
                "mutable": true,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the user cannot interact with the segment button."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "layout": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "SegmentButtonLayout",
                    "resolved": "\"icon-bottom\" | \"icon-end\" | \"icon-hide\" | \"icon-start\" | \"icon-top\" | \"label-hide\" | undefined",
                    "references": {
                        "SegmentButtonLayout": {
                            "location": "import",
                            "path": "./segment-button-interface",
                            "id": "src/components/segment-button/segment-button-interface.ts::SegmentButtonLayout",
                            "referenceLocation": "SegmentButtonLayout"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Set the layout of the text and icon in the segment."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "layout",
                "defaultValue": "'icon-top'"
            },
            "type": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'submit' | 'reset' | 'button'",
                    "resolved": "\"button\" | \"reset\" | \"submit\"",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The type of the button."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "type",
                "defaultValue": "'button'"
            },
            "value": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "SegmentValue",
                    "resolved": "number | string",
                    "references": {
                        "SegmentValue": {
                            "location": "import",
                            "path": "../segment/segment-interface",
                            "id": "src/components/segment/segment-interface.ts::SegmentValue",
                            "referenceLocation": "SegmentValue"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The value of the segment button."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "value",
                "defaultValue": "'ion-sb-' + ids++"
            }
        };
    }
    static get states() {
        return {
            "checked": {}
        };
    }
    static get methods() {
        return {
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
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": "Focuses the native <button> element\ninside of ion-segment-button."
                        }]
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "value",
                "methodName": "valueChanged"
            }];
    }
}
