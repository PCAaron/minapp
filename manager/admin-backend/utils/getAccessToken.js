const rp = require('request-promise')
const { APPID, APPSECRET } = require('../constant/index')
const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, './access_token.json')

const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

const updateAccessToken = async() => {
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    console.log(res)
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}

const getAccessToken = async () => {
    // 读取json
    try {
        const readRes = fs.readFileSync(fileName, 'utf-8')
        const readObj = JSON.parse(readRes)
        const createTime = new Date(readObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if ((nowTime - createTime) / 1000/60/60 >=2 ) {
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    } catch (e) {
        await updateAccessToken()
        await getAccessToken()
    }
}
access_token
setInterval(async ()=>{
    await updateAccessToken()
}, (7200 - 300) * 1000)

module.exports = getAccessToken() // 获取access_token