// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

// 情话
const URL = 'https://chp.shadiao.app/api.php'

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

const db = cloud.database()

const sweetlistCollection = db.collection('sweetlist')

// 云函数入口函数
exports.main = async (event, context) => {
  const sweetWord = await rp(URL).then(res => {
    console.log('res', res)
    return res
  })

  await sweetlistCollection.add({
    data: {
      sweet: sweetWord,
      createTime: db.serverDate()
    }
  }).then(res=>{
    console.log('插入成功')
  }).catch(e=>{
    console.log('插入失败')
  })
}