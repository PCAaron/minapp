const cloud = require('wx-server-sdk')

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)

  const { OPENID } = cloud.getWXContext()

  const result = await cloud.openapi.customerServiceMessage.send({
    touser: OPENID,
    msgtype: 'text',
    text: {
      content: '收到：' + event.Content,
    }
  })

  console.log(result)

  return result
}
