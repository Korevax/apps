/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { hostContext } from "../../utils/theme";
import { config } from "../../global/config";
import { getIonMode } from "../../global/ionic-global";
export class SkeletonText {
    constructor() {
        /**
         * If `true`, the skeleton text will animate.
         */
        this.animated = false;
    }
    componentWillLoad() {
        this.emitStyle();
    }
    emitStyle() {
        // The emitted property is used by item in order
        // to add the item-skeleton-text class which applies
        // overflow: hidden to its label
        const style = {
            'skeleton-text': true,
        };
        this.ionStyle.emit(style);
    }
    render() {
        const animated = this.animated && config.getBoolean('animated', true);
        const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
        const mode = getIonMode(this);
        return (h(Host, { key: '1114e5caf6419e9458db8256480b39e6989963b2', class: {
                [mode]: true,
                'skeleton-text-animated': animated,
                'in-media': inMedia,
            } }, h("span", { key: '9137cf837f163fc0653437fc003666cddac103b0' }, "\u00A0")));
    }
    static get is() { return "ion-skeleton-text"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["skeleton-text.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["skeleton-text.css"]
        };
    }
    static get properties() {
        return {
            "animated": {
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
                    "text": "If `true`, the skeleton text will animate."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "attribute": "animated",
                "defaultValue": "false"
            }
        };
    }
    static get events() {
        return [{
                "method": "ionStyle",
                "name": "ionStyle",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "Emitted when the styles change."
                },
                "complexType": {
                    "original": "StyleEventDetail",
                    "resolved": "StyleEventDetail",
                    "references": {
                        "StyleEventDetail": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::StyleEventDetail",
                            "referenceLocation": "StyleEventDetail"
                        }
                    }
                }
            }];
    }
    static get elementRef() { return "el"; }
}
