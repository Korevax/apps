/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class Note {
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: 'ffe9b4de8bbd89b1ef427f6cd5dbcd354d715e6b', class: createColorClasses(this.color, {
                [mode]: true,
            }) }, h("slot", { key: '42fa3ca3f98208ea2a5057da25b7f9d371c5ba1f' })));
    }
    static get is() { return "ion-note"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["note.ios.scss"],
            "md": ["note.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["note.ios.css"],
            "md": ["note.md.css"]
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
}
