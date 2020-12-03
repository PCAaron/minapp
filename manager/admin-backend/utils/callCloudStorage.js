const getAccessToken = require('./getAccessToken')
const rp = require('request-promise')
const fs = require('fs')

// 云存储函数
const cloudStorage = {
    async download(ctx, fileList) {
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                file_list: fileList
            },
            json: true
        }

        return await rp(options).then(res=>{
            return res
        }).catch(e=>{
            console.warn(e)
        })

    },
    async upload(ctx) {
        const ACCESS_TOKEN = await getAccessToken()
        // 请求地址
        const file = ctx.request.files.file
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                path
            },
            json: true
        }
        const info = await rp(options).then(res=>{
            return res
        }).catch(e=>{
            console.warn(e)
        })
        console.log(info)
        // 上传图片
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData: {
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.path)
            },
            json: true
        }
        await rp(params)
        return info.file_id
    },
    async delete(ctx, fileid_list) {
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                fileid_list
            },
            json: true
        }
        await rp(options).then(res=>{
            return res
        }).catch(e=>{
            console.warn(e)
        })
    }
}

module.exports = cloudStorage