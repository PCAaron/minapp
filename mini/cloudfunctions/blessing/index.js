// 云函数入口文件
const cloud = require('wx-server-sdk')

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

const TcbRouter = require('tcb-router')

const db = cloud.database() // 初始化数据库

const BlessingCollection = db.collection('blessing')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  const wxContext = cloud.getWXContext()

  app.router('getUser', async (ctx,next) => {

  })

  app.router('list', async (ctx, next) => {
    let {total} = await BlessingCollection.count()
    // let total = await BlessingCollection.count().then(res=>{
    //   return res.data
    // })
    let {data} = await BlessingCollection
      .orderBy('createTime','desc').get()
    ctx.body = {
      total,
      userList:data
    }
  })

  return app.serve()
}