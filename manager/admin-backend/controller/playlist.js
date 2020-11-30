const Router = require('koa-router')
const router = new Router()

router.get('/list', async (ctx,next) => {
    // 查询歌单列表
    ctx.body = 'test'
})

module.exports = router