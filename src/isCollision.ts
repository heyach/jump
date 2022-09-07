import getAxes from "./getAxes";
import getProjection from "./getProjection";

export default function isCollision(poly, poly2) {
    let axes1 = getAxes(poly.points);
    let axes2 = getAxes(poly2.points);
    let axes = [...axes1, ...axes2];

    for (let ax of axes) {
        let p1 = getProjection(ax, poly.points);
        let p2 = getProjection(ax, poly2.points);
        if (!p1.overlaps(p2)) {
            return false
        }
    }
    return true
}
