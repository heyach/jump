export default function getElementPoints(element) {
    let t = [];
    t.push({
        x: element.x,
        y: element.y,
    });
    t.push({
        x: element.x + element.w,
        y: element.y,
    });
    t.push({
        x: element.x + element.w,
        y: element.y + element.h,
    });
    t.push({
        x: element.x,
        y: element.y + element.h,
    });
    return {
        points: t,
    };
}
