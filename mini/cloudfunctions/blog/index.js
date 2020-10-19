// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-music-ruu6d'
})

const TcbRouter = require('tcb-router')

const db = cloud.database() // 初始化数据库

const blogCollection = db.collection('blog') // 获取blog
const commentCollection = db.collection('blog-comment')
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    let w={}
    if(keyword.trim() != ''){
      w={
        content: db.RegExp({
          regexp: keyword,
          options: 'i' 
        })
      }
    }

    let blogList = await blogCollection.where(w) // 模糊查询
      .skip(event.start).limit(event.count) // 分页查询
      .orderBy('createTime','desc').get().then(res=>{ //按createTime逆序获取
        return res.data
      })
      ctx.body = blogList
  })

  app.router('detail', async(ctx,next) => {
    let blogId = event.blogId
    // 查询详情
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then(res => {
      return res.data
    })
    // 评论查询
    const countResult = await commentCollection.count()
    const total = countResult.total
    let commnetList = {
      data: []
    }
    if(total > 0){
      const batchTimes = Math.ceil(total/MAX_LIMIT)
      const tasks =[]
      for(let i=0;i<batchTimes;i++){
        let promise = commentCollection.skip(i*MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if(tasks.length > 0){
        commnetList = (await Promise.all(tasks)).reduce((acc,cur)=>{
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      commnetList,
      detail
    }
  })

  const wxContext = cloud.getWXContext()
  app.router('getList', async(ctx,next)=>{
    ctx.body = await blogCollection.where({
      _openid: wxContext.OPENID
    }).skip(event.start).limit(event.count).orderBy('createTime','desc').get()
      .then(res=>{
        return res.data
      })
  })

  return app.serve()
}