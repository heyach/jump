// 投影
export default class Projection {
    min: number
    max: number
    constructor(min, max) {
        this.min = min
        this.max = max
    }
    // 2个投影是否重叠
    overlaps(p : Projection) {
        return this.max > p.min && this.min < p.max
    }
}