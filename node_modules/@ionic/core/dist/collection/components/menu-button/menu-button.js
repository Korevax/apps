/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { inheritAriaAttributes } from "../../utils/helpers";
import { menuController } from "../../utils/menu-controller/index";
import { createColorClasses, hostContext } from "../../utils/theme";
import { menuOutline, menuSharp } from "ionicons/icons";
import { config } from "../../global/config";
import { getIonMode } from "../../global/ionic-global";
import { updateVisibility } from "../menu-toggle/menu-toggle-util";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @part native - The native HTML button element that wraps all child elements.
 * @part icon - The menu button icon (uses ion-icon).
 */
export class MenuButton {
    constructor() {
        this.inheritedAttributes = {};
        this.visible = false;
        /**
         * If `true`, the user cannot interact with the menu button.
         */
        this.disabled = false;
        /**
         * Automatically hides the menu button when the corresponding menu is not active
         */
        this.autoHide = true;
        /**
         * The type of the button.
         */
        this.type = 'button';
        this.onClick = async () => {
            return menuController.toggle(this.menu);
        };
    }
    componentWillLoad() {
        this.inheritedAttributes = inheritAriaAttributes(this.el);
    }
    componentDidLoad() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const { color, disabled, inheritedAttributes } = this;
        const mode = getIonMode(this);
        const menuIcon = config.get('menuIcon', mode === 'ios' ? menuOutline : menuSharp);
        const hidden = this.autoHide && !this.visible;
        const attrs = {
            type: this.type,
        };
        const ariaLabel = inheritedAttributes['aria-label'] || 'menu';
        return (h(Host, { key: 'b8869377822b082c6c4d3f16135b50b733eabf65', onClick: this.onClick, "aria-disabled": disabled ? 'true' : null, "aria-hidden": hidden ? 'true' : null, class: createColorClasses(color, {
                [mode]: true,
                button: true, // ion-buttons target .button
                'menu-button-hidden': hidden,
                'menu-button-disabled': disabled,
                'in-toolbar': hostContext('ion-toolbar', this.el),
                'in-toolbar-color': hostContext('ion-toolbar[color]', this.el),
                'ion-activatable': true,
                'ion-focusable': true,
            }) }, h("button", { key: '48fc0a7011414b60dd7d5136f247e937ae4bb8c8', ...attrs, disabled: disabled, class: "button-native", part: "native", "aria-label": ariaLabel }, h("span", { key: '8c712f28c5afd345e403a9afc525931112852708', class: "button-inner" }, h("slot", { key: 'dd872325e42baf435188478c8d1cfc416075089d' }, h("ion-icon", { key: 'a4f02bdb715b07792c17e12c7837873d70171f88', part: "icon", icon: menuIcon, mode: mode, lazy: false, "aria-hidden": "true" }))), mode === 'md' && h("ion-ripple-effect", { key: '564e2a8a804e14d1135502f7b17d8b7b9862e81b', type: "unbounded" }))));
    }
    static get is() { return "ion-menu-button"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["menu-button.ios.scss"],
            "md": ["menu-button.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["menu-button.ios.css"],
            "md": ["menu-button.md.css"]
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
            },
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
                    "text": "If `true`, the user cannot interact with the menu button."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "disabled",
                "defaultValue": "false"
            },
            "menu": {
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
                    "text": "Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "menu"
            },
            "autoHide": {
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
                    "text": "Automatically hides the menu button when the corresponding menu is not active"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "auto-hide",
                "defaultValue": "true"
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
            }
        };
    }
    static get states() {
        return {
            "visible": {}
        };
    }
    static get elementRef() { return "el"; }
    static get listeners() {
        return [{
                "name": "ionMenuChange",
                "method": "visibilityChanged",
                "target": "body",
                "capture": false,
                "passive": false
            }, {
                "name": "ionSplitPaneVisible",
                "method": "visibilityChanged",
                "target": "body",
                "capture": false,
                "passive": false
            }];
    }
}
