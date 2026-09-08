/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class Row {
    render() {
        return (h(Host, { key: '12b7419dd67ff18dd00e1bf5093299bd94c75503', class: getIonMode(this) }, h("slot", { key: '43fc76a289ecaf398a77a90034ee576003a826fd' })));
    }
    static get is() { return "ion-row"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["row.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["row.css"]
        };
    }
}
