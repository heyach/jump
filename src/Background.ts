import Timer from "./Timer";

class Background {
    bgs: string[];
    bg1: HTMLImageElement;
    bg2: HTMLImageElement;
    index: number;
    y: number;
    timer: Timer;
    h: number;
    w: number;
    imgh: number;
    bufcanvas: HTMLCanvasElement;
    bufctx: any;
    constructor() {
        this.bgs = [
            "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/372c9e7aaacb448eb0c98f2981889b93~tplv-k3u1fbpfcp-watermark.image?", 
            "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fea4c48c4f44e059e3adc02f4816f84~tplv-k3u1fbpfcp-watermark.image?", 
            "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e24eaf658f148e197986a5b31b91c07~tplv-k3u1fbpfcp-watermark.image?"]
        // this.bgs = ["./bg1.png", "./bg2.png", "./bg3.png"]
        this.bg1 = new Image()
        this.index = 0
        this.bg1.src = this.bgs[0]
        this.w = 300
        this.h = 500
        
        this.bufcanvas = document.createElement("canvas");
        this.bufcanvas.width = this.w
        this.bufcanvas.height = this.h
        this.bufctx = this.bufcanvas.getContext("2d");
        this.y = 0
        this.imgh = 600
    }
    draw(ctx) {
        // 一开始y为0，即绘制bg1的0-500部分
        // y增加到50的时候，绘制bg1的50-550部分
        // y增加到200的时候，绘制bg1的200-600部分，但是这总共只有400，屏幕为500，还差100，要绘制bg2的0-100到canvas的400-500位置
        // y增加到300的时候，绘制bg1的300-600部分，再绘制bg2的0-200部分到canvas的300-500位置
        // y增加到600的时候，说明bg1已经绘制完了，把bg2重置为bg1，把y重置为0从先循环
        // y一直增加，绘制bg1的[0, y, w, h]到canvas上的[0, 0, w, h]上，
        this.bufctx.drawImage(this.bg1, 0, this.y, this.w, this.imgh, 0, 0, this.w, this.imgh);
        if(this.bg2 && this.bg2.src) {
            // 如果bg1只绘制了部分，那么从bg2上补充上空缺
            this.bufctx.drawImage(this.bg2, 0, 0, this.w, this.h - (this.imgh - this.y), 0, this.imgh - this.y, this.w, this.h - (this.imgh - this.y));
        }
        ctx.drawImage(this.bufcanvas, 0, 0, this.w, this.h);
    }
    rise(n) {
        this.y += n
        // 如果图片的绘制内容小于屏幕，就要考虑绘制下一张图片了
        if(this.imgh - this.y < this.h) {
            this.bg2 = new Image()
            this.bg2.src = this.bgs[(this.index + 1) % this.bgs.length]
        }
        // 如果bg1已经全部绘制完了，就把bg2当成bg1，把bg3当成bg2准备绘制，一直循环替换
        if(this.y > this.imgh) {
            this.bg1.src = this.bgs[(this.index + 1) % this.bgs.length]
            this.y = 0
            this.bg2 = null
            this.index ++
        }
    }
    animate() {
        this.timer = new Timer(() => {
            this.y += 3
            // 如果图片的绘制内容小于屏幕，就要考虑绘制下一张图片了
            if(this.imgh - this.y < this.h) {
                this.bg2 = new Image()
                this.bg2.src = this.bgs[(this.index + 1) % this.bgs.length]
            }
            // 如果bg1已经全部绘制完了，就把bg2当成bg1，把bg3当成bg2准备绘制，一直循环替换
            if(this.y > this.imgh) {
                this.bg1.src = this.bgs[(this.index + 1) % this.bgs.length]
                this.y = 0
                this.bg2 = null
                this.index ++
            }
        }, 16)
    }
}
export default Background