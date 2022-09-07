export default function Throttle(fn, delay) {
    var last, deferTime
    return function(args) {
        var that = this
        var now = +new Date()
        // 接着如果上个时间间隔里已经执行了fn，last存在，且时间间隔还未结束，设置一个定时器间隔执行，且重置last时间
        if(last && now < last + delay) {
            clearTimeout(deferTime)
            deferTime = setTimeout(function() {
                last = now
                fn.call(that, args)
            }, delay)
        } else {
            // 一进来的时候last为空，直接执行fn，然后把执行时间记录为last
            last = now
            fn.call(that, args)
        }
    }
}