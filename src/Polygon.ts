import BasicElement from "./BasicElement";

class Polygon {
    points: any;
    constructor(points) {
        this.points = points
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.slice(1).forEach(item => {
            ctx.lineTo(item.x, item.y)
        })
        ctx.lineTo(this.points[0].x, this.points[0].y)
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
    }
}
export default Polygon