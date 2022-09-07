import BasicElement from "./BasicElement"
import Timer from "./Timer"

// player
class Person extends BasicElement {
    x: number
    y: number
    w: number
    h: number
    image: HTMLImageElement
    run: boolean
    runIndex: number
    timer: any
    lastTime: number
    fps: any
    constructor(option) {
        super(option)
        this.offsetX = option.offsetX
        this.offsetY = option.offsetY
        this.w = option.w
        this.h = option.h
        this.image = new Image()
        this.image.src = "https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da9a108504204c22a7a9fb74c47a04ed~tplv-k3u1fbpfcp-watermark.image?"
        
        this.run = false
        this.runIndex = 0
        this.lastTime = 0
        this.timer = null
        this.fps = 100
    }
    draw(ctx) {
        ctx.drawImage(this.image, 0 + this.runIndex % 8 * this.w, 0, this.w, this.h, this.x + this.offsetX, this.y + this.offsetY, this.w, this.h);
    }
    animate() {
        this.timer = new Timer(() => {
            this.runIndex++
        }, this.fps)
    }
    play() {
        this.run = true
        this.animate()
    }
    stop() {
        this.run = false
        this.timer.clear()
    }
    pointInElement(x, y) {
        return this.x <= x && this.y <= y && this.x + this.w >= x && this.y + this.h >= y;
    }
}

export default Person
