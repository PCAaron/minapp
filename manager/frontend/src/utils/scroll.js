const scroll = {
    isEnd: false,
    start(cb) {
        let timer = null
        cb && window.addEventListener('scroll', () => {
            if (timer) {
                clearTimeout(timer)
            }
            // 函数防抖
            timer = setTimeout(() => {
                // 滚动高度
                const scrollTop = document.documentElement.scrollTop 
                // 真实高度
                const scrollHeight = document.documentElement.scrollHeight
                // 浏览器可视高度
                const clientHeight = document.documentElement.clientHeight
                if (!this.isEnd && scrollHeight == scrollTop + clientHeight) {
                    window.scrollTo(0, scrollTop - 100)
                    cb()
                }
            }, 300)
        })
    },
    end() {
        this.isEnd = true
    }
}

export default scroll