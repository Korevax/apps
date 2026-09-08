/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { ENABLE_HTML_CONTENT_DEFAULT } from "../../utils/config";
import { sanitizeDOMString } from "../../utils/sanitization/index";
import { arrowDown, caretBackSharp } from "ionicons/icons";
import { config } from "../../global/config";
import { getIonMode } from "../../global/ionic-global";
import { supportsRubberBandScrolling } from "../refresher/refresher.utils";
import { SPINNERS } from "../spinner/spinner-configs";
export class RefresherContent {
    constructor() {
        this.customHTMLEnabled = config.get('innerHTMLTemplatesEnabled', ENABLE_HTML_CONTENT_DEFAULT);
    }
    componentWillLoad() {
        if (this.pullingIcon === undefined) {
            /**
             * The native iOS refresher uses a spinner instead of
             * an icon, so we need to see if this device supports
             * the native iOS refresher.
             */
            const hasRubberBandScrolling = supportsRubberBandScrolling();
            const mode = getIonMode(this);
            const overflowRefresher = hasRubberBandScrolling ? 'lines' : arrowDown;
            this.pullingIcon = config.get('refreshingIcon', mode === 'ios' && hasRubberBandScrolling ? config.get('spinner', overflowRefresher) : 'circular');
        }
        if (this.refreshingSpinner === undefined) {
            const mode = getIonMode(this);
            this.refreshingSpinner = config.get('refreshingSpinner', config.get('spinner', mode === 'ios' ? 'lines' : 'circular'));
        }
    }
    renderPullingText() {
        const { customHTMLEnabled, pullingText } = this;
        if (customHTMLEnabled) {
            return h("div", { class: "refresher-pulling-text", innerHTML: sanitizeDOMString(pullingText) });
        }
        return h("div", { class: "refresher-pulling-text" }, pullingText);
    }
    renderRefreshingText() {
        const { customHTMLEnabled, refreshingText } = this;
        if (customHTMLEnabled) {
            return h("div", { class: "refresher-refreshing-text", innerHTML: sanitizeDOMString(refreshingText) });
        }
        return h("div", { class: "refresher-refreshing-text" }, refreshingText);
    }
    render() {
        const pullingIcon = this.pullingIcon;
        const hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] !== undefined;
        const mode = getIonMode(this);
        return (h(Host, { key: 'a1546008813bbcfa70f97e9b9025846ee0aed722', class: mode }, h("div", { key: '5422771d67fe201e22d4f9d7db6b685f3db5d99d', class: "refresher-pulling" }, this.pullingIcon && hasSpinner && (h("div", { key: '5c2b6dfc3f01b42586ea83380548d454b220a7ca', class: "refresher-pulling-icon" }, h("div", { key: '2c3799ca3f66960d7081c63c5a0840951f694baf', class: "spinner-arrow-container" }, h("ion-spinner", { key: '03f766a9b9354dcb8f6975757a9b882c2eb5cf4a', name: this.pullingIcon, paused: true }), mode === 'md' && this.pullingIcon === 'circular' && (h("div", { key: 'e5f4ba7c6a70adb71f8985af0e23aca07d7b005a', class: "arrow-container" }, h("ion-icon", { key: 'ddccbd9164ae8daa97178fc53b52f74f1fd298ef', icon: caretBackSharp, "aria-hidden": "true" })))))), this.pullingIcon && !hasSpinner && (h("div", { key: '6fb742f47f9149fa6dc3daefe5aaa77f925da4bd', class: "refresher-pulling-icon" }, h("ion-icon", { key: '907657135eeac4c394be1eae4a659664a7bfacb0', icon: this.pullingIcon, lazy: false, "aria-hidden": "true" }))), this.pullingText !== undefined && this.renderPullingText()), h("div", { key: 'fb3094b3ed7e100ab9641c3221770889088e27f3', class: "refresher-refreshing" }, this.refreshingSpinner && (h("div", { key: 'bc8078f94e7cea3cb6f03a09e98540f0e0b38721', class: "refresher-refreshing-icon" }, h("ion-spinner", { key: '8f39524f073aa828e941bcdd4d48e4d5dfc759c6', name: this.refreshingSpinner }))), this.refreshingText !== undefined && this.renderRefreshingText())));
    }
    static get is() { return "ion-refresher-content"; }
    static get properties() {
        return {
            "pullingIcon": {
                "type": "string",
                "mutable": true,
                "complexType": {
                    "original": "SpinnerTypes | string | null",
                    "resolved": "null | string | undefined",
                    "references": {
                        "SpinnerTypes": {
                            "location": "import",
                            "path": "../spinner/spinner-configs",
                            "id": "src/components/spinner/spinner-configs.ts::SpinnerTypes",
                            "referenceLocation": "SpinnerTypes"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "A static icon or a spinner to display when you begin to pull down.\nA spinner name can be provided to gradually show tick marks\nwhen pulling down on iOS devices."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "pulling-icon"
            },
            "pullingText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string | IonicSafeString",
                    "resolved": "IonicSafeString | string | undefined",
                    "references": {
                        "IonicSafeString": {
                            "location": "import",
                            "path": "../../utils/sanitization",
                            "id": "src/utils/sanitization/index.ts::IonicSafeString",
                            "referenceLocation": "IonicSafeString"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The text you want to display when you begin to pull down.\n`pullingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)\n\nContent is parsed as plaintext by default.\n`innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config\nbefore custom HTML can be used."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "pulling-text"
            },
            "refreshingSpinner": {
                "type": "string",
                "mutable": true,
                "complexType": {
                    "original": "SpinnerTypes | null",
                    "resolved": "\"bubbles\" | \"circles\" | \"circular\" | \"crescent\" | \"dots\" | \"lines\" | \"lines-sharp\" | \"lines-sharp-small\" | \"lines-small\" | null | undefined",
                    "references": {
                        "SpinnerTypes": {
                            "location": "import",
                            "path": "../spinner/spinner-configs",
                            "id": "src/components/spinner/spinner-configs.ts::SpinnerTypes",
                            "referenceLocation": "SpinnerTypes"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "An animated SVG spinner that shows when refreshing begins"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "refreshing-spinner"
            },
            "refreshingText": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "string | IonicSafeString",
                    "resolved": "IonicSafeString | string | undefined",
                    "references": {
                        "IonicSafeString": {
                            "location": "import",
                            "path": "../../utils/sanitization",
                            "id": "src/utils/sanitization/index.ts::IonicSafeString",
                            "referenceLocation": "IonicSafeString"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The text you want to display when performing a refresh.\n`refreshingText` can accept either plaintext or HTML as a string.\nTo display characters normally reserved for HTML, they\nmust be escaped. For example `<Ionic>` would become\n`&lt;Ionic&gt;`\n\nFor more information: [Security Documentation](https://ionicframework.com/docs/faq/security)\n\nContent is parsed as plaintext by default.\n`innerHTMLTemplatesEnabled` must be set to `true` in the Ionic config\nbefore custom HTML can be used."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "refreshing-text"
            }
        };
    }
    static get elementRef() { return "el"; }
}
