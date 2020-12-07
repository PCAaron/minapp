const Router = require('koa-router')
const router =  new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')

router.get('/list', async(ctx,next)=>{
    const { start,count } = ctx.request.query
    const query = `db.collection('blog').skip(${start}).limit(${count}).orderBy('createTime','desc').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: res.data
    }
})

router.post('/del', async(ctx,next)=>{
    const {_id, img} = ctx.request.body
    console.log(_id, img)
    // 删除动态
    const queryBlog = `db.collection('blog').doc('${_id}').remove()`
    const delBlog = await callCloudDB(ctx, 'databasedelete', queryBlog)
    // 删除评论
    const queryComment = `db.collection('blog-comment').where({blogId:'${_id}'}).remove()`
    const delComment = await callCloudDB(ctx,'databasedelete', queryComment)
    // 删除图片
    const delImg = await cloudStorage.delete(ctx, img)
    ctx.body = {
        code: 20000, 
        data: {
            delBlog,
            delComment,
            delImg
        }
    }
})

module.exports = router