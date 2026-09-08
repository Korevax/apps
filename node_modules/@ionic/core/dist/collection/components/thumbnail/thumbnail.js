/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class Thumbnail {
    render() {
        return (h(Host, { key: 'ff9d2a4886b1c90a316c761f1160111f0e997f5d', class: getIonMode(this) }, h("slot", { key: '9a0f0d69e3713831e88c8770a60b28ff1a03abb6' })));
    }
    static get is() { return "ion-thumbnail"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["thumbnail.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["thumbnail.css"]
        };
    }
}
