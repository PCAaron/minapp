// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
// let {Cookie} = require('tough-cookie') // tough-cookie 注入cookie失败，详见issue：https://github.com/salesforce/tough-cookie/issues/132

const BASE_URL = 'http://m.kugou.com'
const PLAY_URL = 'https://www.kugou.com'

// let cookie = new Cookie({
//   kg_mid: "kugoukey",
//   httpOnly: true,
//   maxAge: 31536000
// });

// let cookiejar = rp.jar();
// cookiejar.setCookie(cookie.toString(), 'https://www.kugou.com');

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  // 每日蜜语
  app.router('sweetword', async (ctx,next) => {
    ctx.body = await cloud.database().collection('sweetlist')
      .orderBy('createTime', 'desc')
      .get(0)
      .then(res=>{
        console.log('sweetlist', res)
        return res
      })
  })

  app.router('playlist', async (ctx,next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start).limit(event.count) // 分页信息
      // .orderBy('createTime','desc') // 排序方式
      .get() 
      .then(res => {
        return res
      })
  })

  app.router('musiclist', async (ctx,next) => {
    ctx.body = await rp(`${BASE_URL}/rank/info?rankid=${parseInt(event.rankid)}&page=${parseInt(event.page)}&json=true`)
      .then(res => {
        return JSON.parse(res)
      })
  })

  app.router('player', async (ctx,next) => {
    console.log('hash', event.musicid)
    ctx.body = await rp({
      uri: `${PLAY_URL}/yy/index.php?r=play/getdata&hash=${event.musicid}`,
      headers: {
        Cookie: 'kg_mid=kugoukey', // 请求歌词需要写入kg_mid cookie值
        maxAge: 31536000
      }
    })
      .then(res => {
        return JSON.parse(res)
      })
  })

  return app.serve()
}