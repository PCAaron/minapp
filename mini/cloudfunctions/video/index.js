// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const { TONGKEY } = require('./constant/index.js')

const TONG_URL = 'https://api88.net/'

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  // 热门mv列表
  app.router('hotmv', async(ctx, next) => {
    ctx.body = await rp(`${TONG_URL}/api/mv/?key=${TONGKEY}&mv=qq&type=so&word=最热MV`)
      .then(res=>{
        return JSON.parse(res)
      })
  })

  return app.serve()
}