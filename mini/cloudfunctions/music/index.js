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
// cookiejar.setCookie(cookie, 'https://www.kugou.com');

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