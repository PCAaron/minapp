// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-music-ruu6d'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('playlist')
  .skip(event.start).limit(event.count) // 分页信息
  .orderBy('createTime','desc').get() // 排序方式
  .then(res => {
    return res
  })
}