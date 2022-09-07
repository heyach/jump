import flatArrayChildren from "./flatArrayChildren";

// 舞台类
class Stage {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    target: any;
    clickX: number;
    clickY: number;
    targetDx: number;
    targetDy: number;
    isDrag: boolean;
    children: any[];
    static DragElement: string[];
    flatElements: any[];
    constructor(canvas) {
        // 初始化canvas
        this.canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext("2d");

        this.children = [];
        this.flatElements = []

        // 当前点击选中的元素
        this.target = null;

        // 点击位置相对canvas的xy偏移量
        this.clickX = null;
        this.clickY = null;

        // 点击位置相对元素的起始位置，比如矩形的左上顶点，圆形的圆心
        this.targetDx = 0;
        this.targetDy = 0;

        // 增加拖拽状态判断，mousemove了才是拖拽，否则只是点击
        this.isDrag = false;

        // 直接可以拖拽的元素，还有一些是要放入container，目前只有container能直接操作，其余都要放入container
        Stage.DragElement = ["container"]

        this.initEvent();
    }

    initEvent() {
        // 先添加down监听，达成条件后再添加move监听
        this.canvas.addEventListener("mousedown", this.mouseDown);
        document.addEventListener("mouseup", () => {
            this.canvas.style.cursor = "";
            if (this.isDrag) {
                this.clearChildrenActive();
                this.isDrag = false;
                // this.target = null
            } 
            this.target && this.target.dispatchEvent && this.target.dispatchEvent("mouseup");
            this.target = null
            this.canvas.removeEventListener("mousemove", this.targetMove, false);
        });
    }

    // mouseDown作为事件函数，this指向要处理
    mouseDown = (e) => {
        let that = this
        // 缓存target的位置
        this.clickX = e.offsetX;
        this.clickY = e.offsetY;
        // 根据点击的点，找到在框内的元素（最大zindex，有可能重叠的）
        // 先假设只有rect
        // 把children和children的children拍平，然后判断元素的位置
        this.flatElements = flatArrayChildren(this.children);
        // 先找到点击的元素（多个）
        let clickElements = this.flatElements.filter((item) => {
            return item.pointInElement && item.pointInElement(e.offsetX, e.offsetY, that.ctx);
        });
        // 再找到zindex最大的那个
        let target = clickElements.find((item) => item.zindex == Math.max(...clickElements.map((item) => item.zindex)));
        // this.clearChildrenActive();
        // console.log(target)
        if (target) {
            // **知道点击了那个taget，应该把target的点击事件处理暴露出去，而不是都丢在这里**
            this.target = target;
            this.target.active = true;
            // 还要处理鼠标点下的位置与target左上角的位置
            this.targetDx = this.clickX - target.x;
            this.targetDy = this.clickY - target.y;
            this.canvas.style.cursor = "all-scroll";
            this.target.dispatchEvent && this.target.dispatchEvent("click");
            this.canvas.addEventListener("mousemove", this.targetMove, false);
        } 
    };
    targetMove = (e) => {
        let moveX = e.offsetX - this.clickX;
        let moveY = e.offsetY - this.clickY;
        if(Math.abs(moveX) > 5 || Math.abs(moveY) > 5) {
            this.isDrag = true;
        } 
        this.target.dispatchEvent && this.target.dispatchEvent("move");
        // 本身可以拖拽的元素
        // 更新，拖拽动作改成自定义事件处理，各元素自行添加move事件
        // Stage.DragElement.indexOf(this.target.type) != -1
        //     ? this.target.updatePosition && this.target.updatePosition(this.clickX + moveX - this.targetDx, this.clickY + moveY - this.targetDy)
        //     : this.target.parent.updatePosition && this.target.parent.updatePosition(
        //           this.clickX + moveX - this.targetDx - this.target.offsetX,
        //           this.clickY + moveY - this.targetDy - this.target.offsetY
        //       );
    };
    clearChildrenActive() {
        // 清除所有元素的选中状态
        this.children.forEach((item) => item.setActive(false));
    }

    add(child) {
        this.children.push(child);
        child.parent = this;
        this.render();
    }
    remove(child) {
        let index = this.children.findIndex((item) => item.id == child.id)
        index != -1 && this.children.splice(index, 1);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
    }
    render() {
        requestAnimationFrame(Stage.prototype.render.bind(this));
        this.clear();
        this.children.sort((a, b) => {
            return a.zindex - b.zindex;
        });
        // 渲染子元素的时候，根据zindex来进行先后渲染
        this.children.forEach((item) => item.draw(this.ctx));
    }
}

export default Stage