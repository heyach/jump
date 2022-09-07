function getElementPoints(element) {
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
import isCollision from "./isCollision"

export default function CheckCollision(elms: any[], elm, type: Array<string>, cb: Function) {
    // 更新优化，碰撞检测消耗很大，这里不用和所有的元素检测，根据elm的范围获取一定范围就行了
    // 这个优化没办法通用，必须根据具体应用去做，比如我们这里，单元格是60，子弹是最大占位是20，那么以子弹为中心，100px外的元素显然是不可能发生碰撞的
    // 比如2个坦克的碰撞，t2.x一定要大于t1.x - 60 不满足这个条件，是不可能碰撞的，都不用检测
    // 这样筛选之后范围可以极大的缩小
    let checkElms = elms.filter(item => {
        return type.includes(item.type) && 
               item.id != elm.id && 
               (item.x > elm.x - 200 && item.y > elm.y - 200 && item.x < elm.x + elm.w + 200 && item.y < elm.y + elm.h + 200)
    })
    // 子弹的检测对象数直接从几百个降低到2-5个
    let p = false
    for(let i = 0;i < checkElms.length;i++) {
        if(isCollision(getElementPoints(checkElms[i]), getElementPoints(elm))) {
            p = true
            cb(checkElms[i])
            break
        }
    }
    return p
}