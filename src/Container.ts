import AutoZindex from "./AutoZindex";
import guid from "./guid";
import Stage from "./Stage";

interface ContainerOption {
    name: any;
    id?: string // 自增或者编辑传入
    x: number
    y: number
    w: number
    h: number
    zindex?: number
}

// 方形容器 内置一个删除icon，点击删除container，icon的显示状态由container的active来控制
class Container {
    parent: Stage;
    type: string;
    children: any[];
    active: boolean;
    zindex: number;
    id: string;
    c: string;
    x: number;
    y: number;
    w: number;
    h: number;
    delIcon: any;
    name: any;
    buildInChildren: any[];
    constructor(option: ContainerOption) {
        this.name = option.name;
        this.x = option.x;
        this.y = option.y;
        this.w = option.w;
        this.h = option.h;
        this.id = option.id ? option.id : guid();
        this.zindex = option.zindex ? option.zindex : AutoZindex.getIndex();
        this.active = false;
        this.children = [];
        this.buildInChildren = []
        this.type = "container";
        
        this.parent = null;
    }
    add(child) {
        child.parent = this;
        this.children.push(child);
    }
    remove(child) {
        let index = this.parent.children.findIndex((item) => item.id == child.id)
        index != -1 && this.parent.children.splice(
            index,
            1
        );
    }
    destory() {
        this.parent.remove(this)
    }
    draw(ctx) {
        // 绘制所有子元素，但是以container为基准，如container在(100, 100)，子元素1在(20, 20)，那么子元素1的绘制位置为(120, 120)
        this.children.forEach((item) => {
            item.updatePosition(this.x, this.y);
            item.draw(ctx);
        });
    }
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }
    // 点是否在矩形内
    pointInElement(x, y) {
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}

export default Container