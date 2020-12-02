const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')

const callCloudFn = async(ctx,fnName, params) => {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
        method: 'POST',
        url: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`,
        body: {
            ...params
        },
        json: true
    }
    return await rp(options).then(res => {
        return res
    }).catch( e =>{
        console.warn(e)
    })
}

module.exports = callCloudFn