/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { getIonMode } from "../../global/ionic-global";
import { Host, forceUpdate, h } from "@stencil/core";
import { getOverlayLabelJustify, getOverlayLabelPlacement } from "../../utils/overlay-control-label";
import { safeCall } from "../../utils/overlays";
import { renderOptionLabel } from "../../utils/select-option-render";
import { getClassMap } from "../../utils/theme";
export class SelectModal {
    constructor() {
        // Tracks the option that received Enter-keydown so keyup only
        // dismisses when the press started on the same option. Prevents
        // Enter on the triggering ion-select from auto-dismissing.
        this.pendingEnterTarget = null;
        /**
         * The text to display on the cancel button.
         */
        this.cancelText = 'Close';
        this.options = [];
    }
    closeModal() {
        const modal = this.el.closest('ion-modal');
        if (modal) {
            modal.dismiss();
        }
    }
    findOptionFromEvent(ev) {
        const { options } = this;
        return options.find((o) => o.value === ev.target.value);
    }
    getValues(ev) {
        const { multiple, options } = this;
        if (multiple) {
            // this is a modal with checkboxes (multiple value select)
            // return an array of all the checked values
            return options.filter((o) => o.checked).map((o) => o.value);
        }
        // this is a modal with radio buttons (single value select)
        // return the value that was clicked, otherwise undefined
        const option = ev ? this.findOptionFromEvent(ev) : null;
        return option ? option.value : undefined;
    }
    callOptionHandler(ev) {
        const option = this.findOptionFromEvent(ev);
        const values = this.getValues(ev);
        if (option?.handler) {
            safeCall(option.handler, values);
        }
    }
    setChecked(ev) {
        const { multiple } = this;
        const option = this.findOptionFromEvent(ev);
        // this is a modal with checkboxes (multiple value select)
        // we need to set the checked value for this option
        if (multiple && option) {
            option.checked = ev.detail.checked;
        }
    }
    renderRadioOptions() {
        const mode = getIonMode(this);
        const checked = this.options.filter((o) => o.checked).map((o) => o.value)[0];
        return (h("ion-radio-group", { value: checked, onIonChange: (ev) => this.callOptionHandler(ev) }, this.options.map((option, index) => {
            /**
             * Cast to `SelectOverlayOption` to access rich content
             * fields (`startContent`, `endContent`, `description`)
             * that are passed through from `ion-select` but not
             * part of the public `SelectModalOption` interface.
             */
            const richOption = option;
            const hasRichContent = !!richOption.startContent || !!richOption.endContent || !!richOption.description;
            const optionLabelOptions = {
                id: `modal-option-${index}`,
                label: richOption.text,
                startContent: richOption.startContent,
                endContent: richOption.endContent,
                description: richOption.description,
            };
            const defaultLabelPlacement = getOverlayLabelPlacement(mode, 'radio', 'modal');
            const defaultJustify = getOverlayLabelJustify(mode, 'radio', 'modal');
            return (h("ion-item", { lines: "none",
                // TODO FW-4784
                disabled: option.disabled, class: {
                    // TODO FW-4784
                    'item-radio-checked': option.value === checked,
                    ...getClassMap(option.cssClass),
                } }, h("ion-radio", { class: {
                    'select-option-has-rich-content': hasRichContent,
                }, value: option.value, disabled: option.disabled, justify: richOption.justify ?? defaultJustify, labelPlacement: richOption.labelPlacement ?? defaultLabelPlacement, onClick: () => this.closeModal(), onKeyDown: (ev) => {
                    if (ev.key === 'Enter' && !ev.repeat) {
                        this.pendingEnterTarget = ev.currentTarget;
                    }
                }, onKeyUp: (ev) => {
                    if (ev.key === ' ') {
                        // Space selects and dismisses in one press.
                        this.closeModal();
                    }
                    else if (ev.key === 'Enter') {
                        const shouldClose = this.pendingEnterTarget === ev.currentTarget;
                        this.pendingEnterTarget = null;
                        if (shouldClose) {
                            this.closeModal();
                        }
                    }
                } }, renderOptionLabel(optionLabelOptions, 'select-option-label'))));
        })));
    }
    renderCheckboxOptions() {
        const mode = getIonMode(this);
        return this.options.map((option, index) => {
            /**
             * Cast to `SelectOverlayOption` to access rich content
             * fields (`startContent`, `endContent`, `description`)
             * that are passed through from `ion-select` but not
             * part of the public `SelectModalOption` interface.
             */
            const richOption = option;
            const hasRichContent = !!richOption.startContent || !!richOption.endContent || !!richOption.description;
            const optionLabelOptions = {
                id: `modal-option-${index}`,
                label: richOption.text,
                startContent: richOption.startContent,
                endContent: richOption.endContent,
                description: richOption.description,
            };
            const defaultLabelPlacement = getOverlayLabelPlacement(mode, 'checkbox', 'modal');
            const defaultJustify = getOverlayLabelJustify(mode, 'checkbox', 'modal');
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
    render() {
        return (h(Host, { key: '791e95b985dd4b135db17a25fc678e9f8b73c597', class: getIonMode(this) }, h("ion-header", { key: '697d18eef394c4c11c73afe69b9eadd1bad97d38' }, h("ion-toolbar", { key: '036968824ad8771020fe2b7604a6e72b73efc8ae' }, this.header !== undefined && h("ion-title", { key: '102e0346be83e879e733f9b410437b26216156aa' }, this.header), h("ion-buttons", { key: '436b997e990ce2f5e12e1651f8afc31ae231f7b0', slot: "end" }, h("ion-button", { key: 'ee4ddfd0612d33583aa0b93ebdb5257b10d4fda5', onClick: () => this.closeModal() }, this.cancelText)))), h("ion-content", { key: '38ea098f85ac69226e614e0a09f668e9209f7ea1' }, h("ion-list", { key: '20becc2537a1a027915fe0598203039ceb8ba4f3' }, this.multiple === true ? this.renderCheckboxOptions() : this.renderRadioOptions()))));
    }
    static get is() { return "ion-select-modal"; }
    static get encapsulation() { return "scoped"; }
    static get originalStyleUrls() {
        return {
            "ios": ["select-modal.ios.scss"],
            "md": ["select-modal.md.scss"],
            "ionic": ["select-modal.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["select-modal.ios.css"],
            "md": ["select-modal.md.css"],
            "ionic": ["select-modal.md.css"]
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
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "header"
            },
            "cancelText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "The text to display on the cancel button."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "cancel-text",
                "defaultValue": "'Close'"
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
                    "text": ""
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
                    "original": "SelectModalOption[]",
                    "resolved": "SelectModalOption[]",
                    "references": {
                        "SelectModalOption": {
                            "location": "import",
                            "path": "./select-modal-interface",
                            "id": "src/components/select-modal/select-modal-interface.ts::SelectModalOption",
                            "referenceLocation": "SelectModalOption"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "getter": false,
                "setter": false,
                "defaultValue": "[]"
            }
        };
    }
    static get elementRef() { return "el"; }
}
