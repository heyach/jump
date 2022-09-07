// 自增的zindex，由于zindex是一个重要的判断点击元素字段，除非用户传递，否则后加入的一律自增，这样就会排在上层
let AutoZindex = (function() {
    class Singleton {
        zindex: number
        static instance: Singleton
        nindex: number
        hindex: number
        constructor() {
            this.zindex = 1000
            this.nindex = 1000
            this.hindex = 10000
            if(Singleton.instance) {
                return Singleton.instance
            }
            return Singleton.instance = this
        }
        getIndex() {
            return ++this.zindex
        }
        getNindex() {
            return --this.nindex
        }
        getHindex() {
            return ++this.hindex
        }
    }
    var sin = new Singleton()
    return sin
})()
export default AutoZindex