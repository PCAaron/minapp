const Router = require('koa-router')
const router = new Router()
const getAccessToken = require('../utils/getAccessToken')
const { ENV } = require('../constant/index')
const rp = require('request-promise')

router.get('/list', async (ctx,next) => {
    // 查询歌单列表
    const access_token = await getAccessToken()
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=music`
    const options = {
        method: 'POST',
        uri: url,
        body: {
            $url: 'playlist',
            start: 0,
            count: 50
        },
        json: true
    }
    ctx.body = await rp(options).then(res => {
        console.log('res', res)
        return JSON.parse(res.resp_data).data
    }).catch(e => {
        console.warn(e)
    })

})

module.exports = router