/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class ItemGroup {
    render() {
        const mode = getIonMode(this);
        return (h(Host, { key: 'd24ee9c70a99d11b7d95dfb4a8066670bdfcbc1d', role: "group", class: {
                [mode]: true,
                // Used internally for styling
                [`item-group-${mode}`]: true,
                item: true,
            } }));
    }
    static get is() { return "ion-item-group"; }
    static get originalStyleUrls() {
        return {
            "ios": ["item-group.ios.scss"],
            "md": ["item-group.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["item-group.ios.css"],
            "md": ["item-group.md.css"]
        };
    }
}
