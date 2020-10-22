//app.js
App({
  onLaunch: function (options) {
    console.log('onLauch', options)
    this.checkUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-music-ruu6d',
        traceUser: true, // 云开发控制台中查看访问过的用户
      })
    }
    this.getOpenid()
    this.globalData = {
      playingMusicId: -1,
      userInfo: null,
      openid: -1
    }
  },

  onShow(options) {
    console.log('onShow', options)
  },

  setPlayMusicId(musicId){
    this.globalData.playingMusicId = musicId
  },
  getPlayMusicId() {
    return this.globalData.playingMusicId
  },
  setUserInfo(info){
    this.globalData.userInfo = info
  },
  getUserInfo(){
    return this.globalData.userInfo
  },
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      this.globalData.openid = openid
      if(wx.getStorageSync(openid)==''){
        wx.setStorageSync(this.globalData.openid, [])
      } 
    })
  },
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    // 检测版本更新
    updateManager.onCheckForUpdate(res=>{
      if(res.hasUpdate){
        updateManager.onUpdateReady(()=>{
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success(res){
              if(res.confirm){
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  }
})
