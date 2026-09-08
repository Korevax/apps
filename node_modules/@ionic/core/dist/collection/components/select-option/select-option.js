/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the select option text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the select option text in LTR, and to the left in RTL.
 */
export class SelectOption {
    constructor() {
        this.inputId = `ion-selopt-${selectOptionIds++}`;
        /**
         * If `true`, the user cannot interact with the select option.
         */
        this.disabled = false;
    }
    render() {
        return h(Host, { key: '01275b5a613c4b065b24e0d939f611f6ed1fc9ee', role: "option", id: this.inputId, class: getIonMode(this) });
    }
    static get is() { return "ion-select-option"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["select-option.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["select-option.css"]
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
                    "text": "If `true`, the user cannot interact with the select option."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "value": {
                "type": "any",
                "mutable": false,
                "complexType": {
                    "original": "any | null",
                    "resolved": "any",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The text value of the option."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "value"
            },
            "description": {
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
                    "text": "Text that is placed underneath the option text to provide additional details about the option."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "description"
            },
            "labelPlacement": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'end'",
                    "resolved": "\"end\" | \"start\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "Where the label is placed relative to the option's selection control\n(radio circle or checkbox box) when the option is rendered in an\n`alert`, `popover`, or `modal` interface.\n`\"start\"`: The label will appear to the left of the radio in LTR and to the right in RTL.\n`\"end\"`: The label will appear to the right of the radio in LTR and to the left in RTL.\n\nApplies to the `alert`, `popover`, and `modal` interfaces, but has no\nvisible effect on radio options in `popover` or `modal` on `md` (the radio control is hidden there).\n\nWhen unset, the interface picks a default based on mode and control\ntype."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "label-placement"
            },
            "justify": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "'start' | 'end' | 'space-between'",
                    "resolved": "\"end\" | \"space-between\" | \"start\" | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "How to pack the label and the option's selection control within a line.\n`\"start\"`: The label and radio will appear on the left in LTR and\non the right in RTL.\n`\"end\"`: The label and radio will appear on the right in LTR and\non the left in RTL.\n`\"space-between\"`: The label and radio will appear on opposite\nends of the line with space between the two elements.\n\nApplies to the `alert`, `popover`, and `modal` interfaces, but has no\nvisible effect on radio options in `popover` or `modal` on `md` (the radio control is hidden there).\n\nWhen unset, the interface picks a default based on mode and control\ntype."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "justify"
            }
        };
    }
    static get elementRef() { return "el"; }
}
let selectOptionIds = 0;
