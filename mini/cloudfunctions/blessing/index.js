// 云函数入口文件
const cloud = require('wx-server-sdk')

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

const TcbRouter = require('tcb-router')

const db = cloud.database() // 初始化数据库

const BlessingCollection = db.collection('blessing')
const UserCollection = db.collection('userlist')
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
    const _openid = event.user && event.user.openid
    if (_openid) {
      let { data } = await UserCollection.where({
        openid: _openid
      }).get()
      if (data.length === 0) {
        await UserCollection.add({
          data: event.user
        })
      }
    }
    let {total} = await BlessingCollection.count()
    let { data } = await UserCollection.get()
    // let total = await BlessingCollection.count().then(res=>{
    //   return res.data
    // })
    // let {data} = await BlessingCollection
    //   .orderBy('createTime','desc').get()
    ctx.body = {
      total,
      userList:data
    }
  })

  return app.serve()
}