const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')

router.get('/list', async(ctx,next)=>{
    const query = `db.collection('swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    // 云文件下载链接
    let fileList = []
    res.data.forEach(item=>{
        fileList.push({
            fileid: JSON.parse(item).fileid,
            max_age: 7200
        })
    })
    const ret = await cloudStorage.download(ctx, fileList)
    console.log('swiper-res', ret)
    let arr = []
    ret.file_list.forEach((file, idx) => {
        arr.push({
            download_url: file.download_url,
            fileid: file.fileid,
            _id: JSON.parse(res.data[idx])._id
        })
    })
    ctx.body = {
        code: 20000,
        data: arr
    }
})

module.exports = router