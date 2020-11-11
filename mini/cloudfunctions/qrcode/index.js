// 云函数入口文件
const cloud = require('wx-server-sdk')

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
    lineColor: {
      'r': 255,
      'g': 165,
      'b': 194
    },
    isHyaline: true
    // page: 'pages/playlist/playlist'
  })
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
    fileContent: result.buffer
  })

  return upload.fileID
}