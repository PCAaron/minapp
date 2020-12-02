const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn') // 调用云函数
const callCloudDB = require('../utils/callCloudDB') // 调用云数据库

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

// 查询数据库获取详情
router.get('/getById', async (ctx,next)=>{
    const { id } = ctx.request.query
    const query = `db.collection('playlist').doc('${id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})

// 更新详情信息
router.post('/updatePlaylist', async(ctx, next) => {
    const { _id, rankname, intro, imgurl } = ctx.request.body
    console.log(_id, rankname, intro, imgurl)
    const query = `db.collection('playlist').doc('${_id}').update({data: {rankname: '${rankname}',intro: '${intro}', imgurl: '${imgurl}'}})`
    console.log(query.replace('\n',''))
    const res = await callCloudDB(ctx, 'databaseupdate', query.replace('\r','').replace('\n',''))
    console.log('res-update', res)
    ctx.body = {
        code: 20000,
        data: res
    }
})

module.exports = router