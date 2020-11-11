// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

// 音乐排行榜接口
const URL = 'http://m.kugou.com/rank/list&json=true'

const CLOUD_ENV = 'test-music-ruu6d' // backend-vkv6p

cloud.init({
  env: CLOUD_ENV
})

// 初始化云数据库
const db = cloud.database()

const playlistCollection = db.collection('playlist')

const MAX_LIMIT=10

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get() // 获取数据库列表:云函数限制一次只能获取100条

  const countRes = await playlistCollection.count()
  const total = countRes.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []

  for (let i = 0;i<batchTimes;i++) {
    let promise = playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if(tasks.length > 0){
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playlist = await rp(URL).then(res => {
    console.log('total', total)
    console.log('batchTimes', batchTimes)
    console.log('tasks', tasks)
    return JSON.parse(res).rank.list
  })

  // 去重操作
  const newData = []
  for(let i=0,len1 = playlist.length; i<len1;i++) {
    let flag = true
    for(let j= 0,len2 = list.data.length;j<len2;j++) {
      if(playlist[i].id == list.data[j].id){
        flag = false
        break
      }
    }
    if(flag){
      newData.push(playlist[i])
    }
  }

  for (let i=0, len = newData.length; i<len; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate()
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      console.log('插入失败')
    })
  }

  return newData.length
}