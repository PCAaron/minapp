// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init({
  env: 'test-music-ruu6d'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  app.router('playlist', async (ctx,next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start).limit(event.count) // 分页信息
      .orderBy('createTime','desc').get() // 排序方式
      .then(res => {
        return res
      })
  })

  return app.serve()
}