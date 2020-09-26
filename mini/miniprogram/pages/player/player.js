// miniprogram/pages/player/player.js
let muisclist = []
let nowPlayingIdx = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIdx = options.idx
    muisclist = wx.getStorageSync('musiclist')
    this.loadMuiscDetail()
  },

  async loadMuiscDetail() {
    let music = muisclist[nowPlayingIdx]
    this.formatTile(music.filename)
    wx.setNavigationBarTitle({
      title: music.filename
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'player',
        musicid: music.hash
      }
    }).then(res => {
      console.log(res)
    })
  },

  formatTile(filename) {
    const opts = filename.indexOf('-')
    console.log(opts)
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