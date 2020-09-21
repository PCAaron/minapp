// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

// 音乐排行榜接口
const URL = 'http://m.kugou.com/rank/list&json=true'

cloud.init({
  env: 'test-music-ruu6d'
})

// 初始化云数据库
const db = cloud.database()

const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  const list = await playlistCollection.get() // 获取数据库列表

  const playlist = await rp(URL).then(res => {
    console.log('res', res)
    return JSON.parse(res).rank.list
  })

  // 去重操作
  const newData = []
  for(let i=0,len1 = playlist.length; i<len1;i++) {
    let flag = true
    for(let j= 0,len2 = list.data.length;j<len2;j++) {
      if(playlist[i].rankid === list.data[j].rankid){
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