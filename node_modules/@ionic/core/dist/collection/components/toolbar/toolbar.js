/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h } from "@stencil/core";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the toolbar text in LTR, and to the right in RTL.
 * @slot secondary - Content is placed to the left of the toolbar text in `ios` mode, and directly to the right in `md` mode.
 * @slot primary - Content is placed to the right of the toolbar text in `ios` mode, and to the far right in `md` mode.
 * @slot end - Content is placed to the right of the toolbar text in LTR, and to the left in RTL.
 *
 * @part background - The background of the toolbar, covering the entire area behind the toolbar content.
 * @part container - The container that wraps all toolbar content, including the default slot and named slot content.
 * @part content - The container for the default slot, wrapping content provided without a named slot.
 */
export class Toolbar {
    constructor() {
        this.childrenStyles = new Map();
    }
    componentWillLoad() {
        const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));
        const firstButtons = buttons.find((button) => {
            return button.slot === 'start';
        });
        if (firstButtons) {
            firstButtons.classList.add('buttons-first-slot');
        }
        const buttonsReversed = buttons.reverse();
        const lastButtons = buttonsReversed.find((button) => button.slot === 'end') ||
            buttonsReversed.find((button) => button.slot === 'primary') ||
            buttonsReversed.find((button) => button.slot === 'secondary');
        if (lastButtons) {
            lastButtons.classList.add('buttons-last-slot');
        }
    }
    childrenStyle(ev) {
        ev.stopPropagation();
        const tagName = ev.target.tagName;
        const updatedStyles = ev.detail;
        const newStyles = {};
        const childStyles = this.childrenStyles.get(tagName) || {};
        let hasStyleChange = false;
        Object.keys(updatedStyles).forEach((key) => {
            const childKey = `toolbar-${key}`;
            const newValue = updatedStyles[key];
            if (newValue !== childStyles[childKey]) {
                hasStyleChange = true;
            }
            if (newValue) {
                newStyles[childKey] = true;
            }
        });
        if (hasStyleChange) {
            this.childrenStyles.set(tagName, newStyles);
            forceUpdate(this);
        }
    }
    render() {
        const mode = getIonMode(this);
        const childStyles = {};
        this.childrenStyles.forEach((value) => {
            Object.assign(childStyles, value);
        });
        return (h(Host, { key: 'c16803dc4eae9972ef19bf43aa74b94feb4fd4c1', class: {
                ...childStyles,
                ...createColorClasses(this.color, {
                    [mode]: true,
                    'in-toolbar': hostContext('ion-toolbar', this.el),
                }),
            } }, h("div", { key: '20e3f85844c94b8399c245d2df125e6ab678d681', class: "toolbar-background", part: "background" }), h("div", { key: '12f09e324e8d9130b9d30c493106b500233fb016', class: "toolbar-container", part: "container" }, h("slot", { key: '6da0fe99ee0c4d7c969712e2908a4e7e6be5ed2c', name: "start" }), h("slot", { key: '177c346d6dcabb7857d810cda7d25c6dde32e6e2', name: "secondary" }), h("div", { key: '8c921b415940c71bf4c1a2c5c6887f36ad1afd16', class: "toolbar-content", part: "content" }, h("slot", { key: '1f2976b80d967bd51e86ed1357b363271d655df2' })), h("slot", { key: '0f7618044a7e8b0d9b715a8e208070f7ef2ee4c8', name: "primary" }), h("slot", { key: '125c393197e0660a3c2638dd4628c41ef7e05f19', name: "end" }))));
    }
    static get is() { return "ion-toolbar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["toolbar.ios.scss"],
            "md": ["toolbar.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["toolbar.ios.css"],
            "md": ["toolbar.md.css"]
        };
    }
    static get properties() {
        return {
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
            }
        };
    }
    static get elementRef() { return "el"; }
    static get listeners() {
        return [{
                "name": "ionStyle",
                "method": "childrenStyle",
                "target": undefined,
                "capture": false,
                "passive": false
            }];
    }
}
