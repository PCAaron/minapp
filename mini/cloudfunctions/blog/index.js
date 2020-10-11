// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-music-ruu6d'
})

const TcbRouter = require('tcb-router')

const db = cloud.database() // 初始化数据库

const blogCollection = db.collection('blog') // 获取blog

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    let blogList = await blogCollection.skip(event.start).limit(event.count) // 分页查询
      .orderBy('createTime','desc').get().then(res=>{ //按createTime逆序获取
        return res.data
      })
      ctx.body = blogList
  })

  return app.serve()
}