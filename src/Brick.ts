import BasicElement from "./BasicElement"
import Timer from "./Timer"

export default class Brick extends BasicElement{
    x: number
    y: number
    w: number
    h: number
    image: HTMLImageElement
    type: string
    timer: Timer
    fps: any
    constructor(option) {
        super({})
        this.x = option.x
        this.y = option.y
        this.w = option.w
        this.h = option.h
        this.type = "Brick"
        this.image = new Image()
        this.image.src = "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a173f1034e914476ad194cab26075c04~tplv-k3u1fbpfcp-watermark.image?"
        this.fps = 16
        this.timer = null
        this.animate()
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    
    gotShot() {
        this.destroy()
    }
    animate() {
        let x = this.x - this.w
        let x2 = this.x + this.w
        let f = Math.random() < 0.5 ? -1 : 1
        this.timer = new Timer(() => {
            this.x += 1 * f
            if(this.x > x2) {
                f = -1
            }
            if(this.x < x) {
                f = 1
            }
        }, this.fps)
    }

    destroy() {
        this.parent.remove(this)
    }

    pointInElement(x: number, y: number) {
        // 假设内置close大小为20*20，在元素右上角
        // 这个判断还是要加上offset，更新后，子元素的xy就是container的xy
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}