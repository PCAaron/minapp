// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-music-ruu6d'
})

const TcbRouter = require('tcb-router')

const db = cloud.database()

const lifeCollection = db.collection('life')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  
  app.router('list', async (ctx, next) => {
    let lifeList = await lifeCollection.skip(event.start).limit(event.count)
      .orderBy('times', 'asc').get().then(res=>{
        return res.data
      })
    ctx.body = lifeList
  })

  return app.serve()
}