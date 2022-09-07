import Projection from "./Projection";
import Vector from "./Vector";

// 获取投影轴上的投影，参数为投影轴向量
export default function getProjection(v: Vector, points) {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    points.forEach(point => {
        let p = new Vector(point.x, point.y);
        let dotProduct = p.dot(v);
        min = Math.min(min, dotProduct);
        max = Math.max(max, dotProduct);
    })
    return new Projection(min, max);
}