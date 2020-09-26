// miniprogram/pages/player/player.js
let muisclist = []
let nowPlayingIdx = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    isPlaying: false // 播放状态
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
    backgroundAudioManager.stop()
    let music = muisclist[nowPlayingIdx]
    console.log(music.hash)
    this.formatTile(music.filename)
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
        isPlaying: false
      })
      wx.setNavigationBarTitle({
        title: this.data.detail.song_name
      })
      backgroundAudioManager.src = this.data.detail.play_url
      backgroundAudioManager.title = this.data.detail.song_name
      backgroundAudioManager.singer = this.data.detail.author_name
      backgroundAudioManager.coverImgUrl = this.data.detail.img
      backgroundAudioManager.play()
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