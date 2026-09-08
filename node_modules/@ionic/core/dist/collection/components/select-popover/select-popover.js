/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h, forceUpdate } from "@stencil/core";
import { getOverlayLabelJustify, getOverlayLabelPlacement } from "../../utils/overlay-control-label";
import { safeCall } from "../../utils/overlays";
import { renderOptionLabel } from "../../utils/select-option-render";
import { getClassMap } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @internal
 */
export class SelectPopover {
    constructor() {
        // Tracks the option that received Enter-keydown so keyup only
        // dismisses when the press started on the same option. Prevents
        // Enter on the triggering ion-select from auto-dismissing.
        this.pendingEnterTarget = null;
        /**
         * An array of options for the popover
         */
        this.options = [];
    }
    findOptionFromEvent(ev) {
        const { options } = this;
        return options.find((o) => o.value === ev.target.value);
    }
    /**
     * When an option is selected we need to get the value(s)
     * of the selected option(s) and return it in the option
     * handler
     */
    callOptionHandler(ev) {
        const option = this.findOptionFromEvent(ev);
        const values = this.getValues(ev);
        if (option?.handler) {
            safeCall(option.handler, values);
        }
    }
    /**
     * Dismisses the host popover that the `ion-select-popover`
     * is rendered within.
     */
    dismissParentPopover() {
        const popover = this.el.closest('ion-popover');
        if (popover) {
            popover.dismiss();
        }
    }
    setChecked(ev) {
        const { multiple } = this;
        const option = this.findOptionFromEvent(ev);
        // this is a popover with checkboxes (multiple value select)
        // we need to set the checked value for this option
        if (multiple && option) {
            option.checked = ev.detail.checked;
        }
    }
    getValues(ev) {
        const { multiple, options } = this;
        if (multiple) {
            // this is a popover with checkboxes (multiple value select)
            // return an array of all the checked values
            return options.filter((o) => o.checked).map((o) => o.value);
        }
        // this is a popover with radio buttons (single value select)
        // return the value that was clicked, otherwise undefined
        const option = this.findOptionFromEvent(ev);
        return option ? option.value : undefined;
    }
    renderOptions(options) {
        const { multiple } = this;
        switch (multiple) {
            case true:
                return this.renderCheckboxOptions(options);
            default:
                return this.renderRadioOptions(options);
        }
    }
    renderCheckboxOptions(options) {
        const mode = getIonMode(this);
        return options.map((option, index) => {
            /**
             * Cast to `SelectOverlayOption` to access rich content
             * fields (`startContent`, `endContent`, `description`)
             * that are passed through from `ion-select` but not
             * part of the public `SelectPopoverOption` interface.
             */
            const richOption = option;
            const hasRichContent = !!richOption.startContent || !!richOption.endContent || !!richOption.description;
            const optionLabelOptions = {
                id: `popover-option-${index}`,
                label: richOption.text,
                startContent: richOption.startContent,
                endContent: richOption.endContent,
                description: richOption.description,
            };
            const defaultLabelPlacement = getOverlayLabelPlacement(mode, 'checkbox');
            const defaultJustify = getOverlayLabelJustify(mode, 'checkbox');
            return (h("ion-item", {
                // TODO FW-4784
                disabled: option.disabled, class: {
                    // TODO FW-4784
                    'item-checkbox-checked': option.checked,
                    ...getClassMap(option.cssClass),
                }
            }, h("ion-checkbox", { class: {
                    'select-option-has-rich-content': hasRichContent,
                }, value: option.value, disabled: option.disabled, checked: option.checked, justify: richOption.justify ?? defaultJustify, labelPlacement: richOption.labelPlacement ?? defaultLabelPlacement, onIonChange: (ev) => {
                    this.setChecked(ev);
                    this.callOptionHandler(ev);
                    // TODO FW-4784
                    forceUpdate(this);
                } }, renderOptionLabel(optionLabelOptions, 'select-option-label'))));
        });
    }
    renderRadioOptions(options) {
        const mode = getIonMode(this);
        const checked = options.filter((o) => o.checked).map((o) => o.value)[0];
        return (h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, options.map((option, index) => {
            /**
             * Cast to `SelectOverlayOption` to access rich content
             * fields (`startContent`, `endContent`, `description`)
             * that are passed through from `ion-select` but not
             * part of the public `SelectPopoverOption` interface.
             */
            const richOption = option;
            const hasRichContent = !!richOption.startContent || !!richOption.endContent || !!richOption.description;
            const optionLabelOptions = {
                id: `popover-option-${index}`,
                label: richOption.text,
                startContent: richOption.startContent,
                endContent: richOption.endContent,
                description: richOption.description,
            };
            return (h("ion-item", {
                // TODO FW-4784
                disabled: option.disabled, class: {
                    // TODO FW-4784
                    'item-radio-checked': option.value === checked,
                    ...getClassMap(option.cssClass),
                }
            }, h("ion-radio", { class: {
                    'select-option-has-rich-content': hasRichContent,
                }, value: option.value, disabled: option.disabled, justify: richOption.justify ?? getOverlayLabelJustify(mode, 'radio'), labelPlacement: richOption.labelPlacement ?? getOverlayLabelPlacement(mode, 'radio'), onClick: () => this.dismissParentPopover(), onKeyDown: (ev) => {
                    if (ev.key === 'Enter' && !ev.repeat) {
                        this.pendingEnterTarget = ev.currentTarget;
                    }
                }, onKeyUp: (ev) => {
                    if (ev.key === ' ') {
                        // Space selects and dismisses in one press.
                        this.dismissParentPopover();
                    }
                    else if (ev.key === 'Enter') {
                        const shouldDismiss = this.pendingEnterTarget === ev.currentTarget;
                        this.pendingEnterTarget = null;
                        if (shouldDismiss) {
                            this.dismissParentPopover();
                        }
                    }
                } }, renderOptionLabel(optionLabelOptions, 'select-option-label'))));
        })));
    }
    render() {
        const { header, message, options, subHeader } = this;
        const hasSubHeaderOrMessage = subHeader !== undefined || message !== undefined;
        return (h(Host, { key: '4b4ac4a4b6523147e7c1f5e29dd8043867f2baea', class: getIonMode(this) }, h("ion-list", { key: 'f700d3dc3ce68c20a4d981164b29262564097fb4' }, header !== undefined && h("ion-list-header", { key: '196bcd7963f13ef8bc46231545eee4cb8d526f5e' }, header), hasSubHeaderOrMessage && (h("ion-item", { key: 'bb108e0aa2409997df35f52cb67e58e55e0fd630' }, h("ion-label", { key: '59e8d9196ff976f3835766662654c0f085e58ec3', class: "ion-text-wrap" }, subHeader !== undefined && h("h3", { key: '532f75d7c129ffadca4e6cbb619a4427aaede65c' }, subHeader), message !== undefined && h("p", { key: 'fc42c91594b9001e983cb5e4176fc4c9bff0f708' }, message)))), this.renderOptions(options))));
    }
    static get is() { return "ion-select-popover"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() {
        return {
            "ios": ["select-popover.ios.scss"],
            "md": ["select-popover.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["select-popover.ios.css"],
            "md": ["select-popover.md.css"]
        };
    }
    static get properties() {
        return {
            "header": {
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
                    "text": "The header text of the popover"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "header"
            },
            "subHeader": {
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
                    "text": "The subheader text of the popover"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "sub-header"
            },
            "message": {
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
                    "text": "The text content of the popover body"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "message"
            },
            "multiple": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "If true, the select accepts multiple values"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "multiple"
            },
            "options": {
                "type": "unknown",
                "mutable": false,
                "complexType": {
                    "original": "SelectPopoverOption[]",
                    "resolved": "SelectPopoverOption[]",
                    "references": {
                        "SelectPopoverOption": {
                            "location": "import",
                            "path": "./select-popover-interface",
                            "id": "src/components/select-popover/select-popover-interface.ts::SelectPopoverOption",
                            "referenceLocation": "SelectPopoverOption"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "An array of options for the popover"
                },
                "getter": false,
                "setter": false,
                "defaultValue": "[]"
            }
        };
    }
    static get elementRef() { return "el"; }
}
