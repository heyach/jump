import CheckCollision from "./CheckCollision";
import Container from "./Container";
import flatArrayChildren from "./flatArrayChildren";
import Player from "./Player";
import Timer from "./Timer";
// 
class PersonElm {
    container: Container;
    player: Player;
    fps: any;
    jumpTimer: Timer;
    direction: any;
    fallTimer: Timer;
    stand: boolean;
    begin: boolean;
    constructor(option) {
        this.container = new Container({
            name: "PlayerElm",
            x: option.x,
            y: option.y,
            w: option.w,
            h: option.h
        });
        this.direction = "right"
        this.container.type = "PersonElm"
        
        this.player = new Player({
            offsetX: 0,
            offsetY: 0,
            w: 30,
            h: 30,
        })
      
        this.player.play()
        this.container.add(this.player);

        this.jumpTimer = null
        this.fallTimer = null
        this.fps = 16

        this.stand = false
        this.begin = false

        this.fall()

    }
    setDirection(d) {
        this.direction = d
    }
    move() {
        switch (this.direction) {
            case "right": 
                if(this.container.x < 300 - this.container.w - 3) {
                    this.container.x += 3
                }
                break
            case "left":
                if(this.container.x > 3) {
                    this.container.x -= 3
                }
                break
            default: 
                break
        }
    }
    stop() {
        this.player.stop()
    }
    fall() {
        this.fallTimer = new Timer(() => {
            this.container.y += 10
            let elms = flatArrayChildren(this.container.parent.children);
            CheckCollision(elms, this.container, ["Brick"], (elm) => {
                if(this.container.y + this.container.h > elm.y) {
                    this.container.y = elm.y - this.container.h - 1
                } else {
                    this.container.y -= 10
                }
                this.stand = true
            })
            if(this.container.y + this.container.h > 500) {
                this.container.y = 500 - this.container.h - 1
                if(this.begin) {
                    this.fallTimer.clear()
                    this.fallTimer = null
                    alert("GG")
                    location.reload()
                }
            }
        }, this.fps)
    }
    jumpFall(d) {
        let tmpY = this.container.y
        this.container.y = d
        let elms = flatArrayChildren(this.container.parent.children);
        CheckCollision(elms, this.container, ["Brick"], (elm) => {
            // 只做底部的检测
            if(this.container.y + this.container.h > elm.y) {
                this.container.y = elm.y - this.container.h - 1
            } else {
                this.container.y = tmpY
            }
            this.stand = true
            this.jumpTimer.clear()
            this.jumpTimer = null
        })
    }
    // 左跳或者右跳
    jump(f: (1 | -1)) {
        if(this.jumpTimer) {
            return
        }
        this.stand = false
        // sin跳跃法
        // Math.sin(d % 180 * Math.PI / 180)
        // 右跳，在一段时间间隔里，人物从当前位置做一个跳的变化，x从x0变到x1，这个dx是固定的，比如180，y从y0变到y1，这个y的动态过程由sin(x)计算得到，再乘以xy的系数，就能得到一个跳跃了
        let y0 = this.container.y
        let dx = 0
        let dy = 0
        this.jumpTimer = new Timer(() => {
            if(dx < 180 && dx > -180) {
                dx += 5 * f
                dy = Math.floor(Math.sin(Math.abs(dx) % 180 * Math.PI / 180) * 70)
            } else {
                this.jumpTimer.clear()
                this.jumpTimer = null
            }
            this.jumpFall(y0 - dy)
        }, this.fps)
    }

}

export default PersonElm