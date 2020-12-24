// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const { TONGKEY } = require('./constant/index.js')
// let {Cookie} = require('tough-cookie') // tough-cookie 注入cookie失败，详见issue：https://github.com/salesforce/tough-cookie/issues/132

const BASE_URL = 'http://m.kugou.com'
const PLAY_URL = 'https://www.kugou.com'
const mKUGOU_URL = 'http://m.kugou.com/'

const SEARCH_URL = 'http://mobilecdn.kugou.com/' // 歌曲名搜索歌曲

const TONG_URL = 'https://api88.net/'

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

  // app.router('playlist', async (ctx,next) => { // 歌曲分类
  //   ctx.body = await cloud.database().collection('playlist')
  //     .skip(event.start).limit(event.count) // 分页信息
  //     // .orderBy('createTime','desc') // 排序方式
  //     .get() 
  //     .then(res => {
  //       return res
  //     })
  // })

  // app.router('musiclist', async (ctx,next) => { // 歌曲列表
  //   ctx.body = await rp(`${BASE_URL}/rank/info?rankid=${parseInt(event.rankid)}&page=${parseInt(event.page)}&json=true`)
  //     .then(res => {
  //       return JSON.parse(res)
  //     })
  // })

  app.router('player', async (ctx,next) => {
    console.log('hash', event.musicid)
    ctx.body = await rp({
      uri: `${PLAY_URL}/yy/index.php?r=play/getdata&hash=${event.musicid}`, // 接口已没有返回歌词及音频
      // uri: `${mKUGOU_URL}/app/i/getSongInfo.php?cmd=playInfo&hash=${event.musicid}`, // 接口有请求限制
      headers: {
        Cookie: 'kg_mid=kugoukey', // 请求歌词需要写入kg_mid cookie值
        maxAge: 31536000
      }
    })
      .then(res => {
        console.log('res----', res)
        return JSON.parse(res)
      })
  })

  // app.router('search', async(ctx,next) => { // 歌曲搜索 demo:http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=%E6%B5%B7%E9%98%94%E5%A4%A9%E7%A9%BA&page=1&pagesize=20&showtype=1
  //   const muiscName = event.musicName
  //   ctx.body = await rp(`${SEARCH_URL}/api/v3/search/song?format=json&keyword=${muiscName}&page=1&pagesize=20&showtype=1`)
  //     .then(res => {
  //       return JSON.parse(res)
  //     })
  // })

  // 首页音乐分类
  app.router('classify', async(ctx, next) => {
    ctx.body = await cloud.database().collection('classifylist')
      .orderBy('createTime', 'desc')
      .get()
      .then(res=>{
        console.log('classifylist', res)
        return res
      })
  })

  // 分类跳转进列表
  app.router('musicMenus', async(ctx, next) => {
    ctx.body = await rp(`${TONG_URL}/api/netease/?key=${TONGKEY}&id=${event.id}&type=so`)
      .then(res=>{
        console.log('musicMenus-res', res)
        return JSON.parse(res)
      })
  })

  return app.serve()
}