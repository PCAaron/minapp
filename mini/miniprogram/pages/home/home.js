// miniprogram/pages/home/home.js
const MAX_LIMIT = 26
const db = wx.cloud.database() // 初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    playList: [],
    sweet: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiper()
    this.getRankList()
    this.getSweet()
  },
  // 获取轮播图
  getSwiper() {
    db.collection('swiper').get().then(res=>{
      this.setData({
        imgUrls: res.data
      })
    })
  },

  // 获取排行榜列表
  getRankList() {
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playList.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then(res => {
      console.log(res)
      this.setData({
        playList: this.data.playList.concat(res.result.data)
      })
      wx.stopPullDownRefresh() // 停止下拉刷新动作
      wx.hideLoading()
    })
  },

  getSweet() {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'sweetword'
      }
    }).then(res=>{
      this.setData({
        sweet: res.result.data[0].sweet
      })
    })
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
    this.getSwiper()
    this.setData({
      playList: []
    })
    this.getRankList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 取消分页
    // this.getRankList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})