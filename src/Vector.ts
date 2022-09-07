// 坐标系向量
export default class Vector {
    x: number;
    y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // 获取向量的长度
    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    // 向量相加
    add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    // 向量相减
    sub(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    // 向量点积
    dot(v: Vector) {
        return this.x * v.x + this.y * v.y;
    }
    // 返回法向量
    perp() {
        return new Vector(this.y, -this.x);
    }
    // 单位向量
    unit() {
        let d = this.getLength();
        return d ? new Vector(this.x / d, this.y / d) : new Vector(0, 0);
    }
}
