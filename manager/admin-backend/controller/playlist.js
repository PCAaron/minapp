const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')

router.get('/list', async (ctx,next) => {
    // 查询歌单列表
    const {start, count} = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(start),
        count: parseInt(count)
    })
    const data = JSON.parse(res.resp_data).data
    ctx.body = {
        data,
        code: 20000
    }
})

module.exports = router