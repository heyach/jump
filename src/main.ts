import Background from "./Background";
import Brick from "./Brick";
import PlayerElm from "./PlayerElm";
import Stage from "./Stage";
import Timer from "./Timer";

let s2 = new Stage(document.getElementById("stage"))

let bg = new Background()
s2.add(bg)

let y = 0
let shut = [[180, 430], [100, 320], [50, 220], [170, 120],[80, 20], [100, -120], 
            [40, -220], [200, -320],[180, -430], [100, -500], [40, -620], 
            [200, -720],[180, -800], [100, -920], [40, -1020], [200, -1120]]
let bs = []
shut.forEach(item => {
    let b = new Brick({
        x: item[0],
        y: item[1],
        w: 50,
        h: 10
    })
    bs.push(b)
    s2.add(b)
})

let p = new PlayerElm({
    x: 32,
    y: 470,
    w: 30,
    h: 30,
})
s2.add(p.container)
let pressKey = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
}

document.getElementById("btn-begin").addEventListener("click", () => {
    document.body.removeChild(document.getElementById("btn-begin"))
    // 记录按键的状态，比如右，donw的时候为true，up的时候为false，只要为true就执行，这个时候去按空格，就会同时触发2个
    document.addEventListener("keydown", (e) => {
        switch(e.code) {
            case "ArrowRight": 
                pressKey.right = true
                break
            case "ArrowLeft":  
                pressKey.left = true
                break
            case "Space":  
                pressKey.space = true
                break
            default: 
                break
        }
    })
    document.addEventListener("keyup", (e) => {
        switch(e.code) {
            case "ArrowRight": 
                pressKey.right = false
                break
            case "ArrowLeft":  
                pressKey.left = false
                break
            case "Space":  
                pressKey.space = false
                break
            default: 
                break
        }
    })
})
let pressTimer = new Timer(() => {
    if(pressKey.right) {
        p.setDirection("right")
        p.move()
    }
    if(pressKey.left) {
        p.setDirection("left")
        p.move()
    }
}, 16)
let delta = 5
let riseTimer
let pressTimer2 = new Timer(() => {
    if(pressKey.space) {
        if(p.stand) {
            p.begin = true
            riseTimer= new Timer(() => {
                y += delta
                bg.rise(delta)
                bs.forEach(item => {
                    item.y += delta
                })
            }, 16, 160, () => {})
        }
        p.jump(1)
        if(y > 1500) {
            pressTimer2.clear()
            riseTimer.clear()
            alert("游戏通关")
            location.reload()
        }
    }
}, 100)