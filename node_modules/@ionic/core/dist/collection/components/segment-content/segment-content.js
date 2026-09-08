/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
export class SegmentContent {
    render() {
        return (h(Host, { key: 'b03079d7cfd78724828a4f42d7a7030457682b25' }, h("slot", { key: 'c4c86280e5e577ee31a181758fea27a788fd87fa' })));
    }
    static get is() { return "ion-segment-content"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["segment-content.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["segment-content.css"]
        };
    }
}
