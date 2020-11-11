// 云函数入口文件
const cloud = require('wx-server-sdk')

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()

  const result = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `/pages/comment/comment?blogId=${event.blogId}`,
    data: {
      name1: {
        value: '评论完成'
      },
      character_string2: {
        value: event.content
      }
    },
    templateId: 'Q8fNVjuzBaoovBGlJxIwei21d0qn35dwvwhFVJmJk1w',
    formid: event.formId
  })
  return result
}