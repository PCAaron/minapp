const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const playlist = require('./controller/playlist')
router.use('/playlist', playlist.routes())

app.use(router.routes()) // 重新声明
app.use(router.allowedMethods()) // 允许方法使用

app.use(async ctx => {
    ctx.body = 'hello word'
})

app.listen(3000, () => {
    console.log('server is listening in port 3000')
})