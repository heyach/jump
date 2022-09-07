import AutoZindex from "./AutoZindex";
import Container from "./Container";
import guid from "./guid";

// 基础元素
class BasicElement {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    id: string;
    zindex: number;
    active: boolean;
    event: {};
    parent: Container;
    constructor(option: any) {
        this.x = 0;
        this.y = 0;
        this.offsetX = option.offsetX;
        this.offsetY = option.offsetY;
        this.id = guid();
        this.zindex = option.zindex ? option.zindex : AutoZindex.getIndex();
        this.active = false;
        this.event = {};
        this.parent = null;
    }
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    addEvent(key, fn) {
        this.event[key] = this.event[key] || [];
        this.event[key].push(fn);
    }
    dispatchEvent(key) {
        this.event[key] && this.event[key].forEach((item) => item(this));
    }
}

export default BasicElement