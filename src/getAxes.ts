import Vector from "./Vector";
// 获取多个点的所有投影轴
export default function getAxes(points) {
    let axes = [];
    for (let i = 0, j = points.length - 1; i < j; i++) {
        let v1 = new Vector(points[i].x, points[i].y);
        let v2 = new Vector(points[i + 1].x, points[i + 1].y);
        axes.push(v1.sub(v2).perp().unit());
    }
    let firstPoint = points[0];
    let lastPoint = points[points.length - 1];
    let v1 = new Vector(lastPoint.x, lastPoint.y);
    let v2 = new Vector(firstPoint.x, firstPoint.y);
    axes.push(v1.sub(v2).perp().unit());
    return axes;
}
