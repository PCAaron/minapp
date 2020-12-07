const Koa = require('koa')
const cors = require('koa2-cors') // 解决跨域
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const { ENV } = require('./constant/index')
const koaBody = require('koa-body') // 解析post-body参数

// 跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))

// 接受post参数解析
app.use(koaBody({
    multipart: true
}))

// 全局中间件
app.use(async (ctx, next)=> {
    ctx.state.env = ENV
    await next()
})

const playlist = require('./controller/playlist')
router.use('/playlist', playlist.routes())

const swiper = require('./controller/swiper')
router.use('/swiper', swiper.routes())

const blog = require('./controller/blog')
router.use('/blog', blog.routes())

app.use(router.routes()) // 重新声明
app.use(router.allowedMethods()) // 允许方法使用

app.use(async ctx => {
    ctx.body = 'hello word'
})

app.listen(3000, () => {
    console.log('server is listening in port 3000')
})