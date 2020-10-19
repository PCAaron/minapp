// miniprogram/pages/player/player.js
let muisclist = []
let nowPlayingIdx = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    isPlaying: false, // 播放状态
    isLyricShow: false,
    lyric: '',
    isSame: false // 表示当前是否同一首歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIdx = options.idx
    muisclist = wx.getStorageSync('musiclist')
    this.loadMuiscDetail()
  },

  loadMuiscDetail() {
    let music = muisclist[nowPlayingIdx]
    if(music.hash == app.getPlayMusicId()){
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if(!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    console.log(music.hash)
    this.formatTile(music.filename)
    app.setPlayMusicId(music.hash)
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'player',
        musicid: music.hash
      }
    }).then(res => {
      this.setData({
        detail: res.result.data,
        isPlaying: false,
        lyric: res.result.data.lyrics
      })
      wx.setNavigationBarTitle({
        title: this.data.detail.song_name
      })
      if(!this.data.detail.play_url){
        wx.showToast({
          title:'无法播放'
        })
        return
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = this.data.detail.play_url
        backgroundAudioManager.title = this.data.detail.song_name
        backgroundAudioManager.singer = this.data.detail.author_name
        backgroundAudioManager.coverImgUrl = this.data.detail.img
        backgroundAudioManager.play()
        // 保存播放历史
        this.savePlayHistory()
      }
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
  },

  formatTile(filename) {
    const opts = filename.indexOf('-')
    console.log(opts)
  }, 

  togglePlay() {
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev() {
    nowPlayingIdx--
    if(nowPlayingIdx < 0){
      nowPlayingIdx = muisclist.length -1
    } 
    this.loadMuiscDetail()
  },
  onNext() {
    nowPlayingIdx++
    if(nowPlayingIdx === muisclist.length){
      nowPlayingIdx = 0
    } 
    this.loadMuiscDetail()
  },

  showLyric() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime) // 选中组件并调用方法
  },

  // 获取progressbar playing
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  savePlayHistory() {
    const music = muisclist[nowPlayingIdx]
    const openid  = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let flag = false
    for(let i=0,len=history.length;i<len;i++){
      if(history[i].id == music.id){
        flag = true
        break
      }
    }
    if(!flag){
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})