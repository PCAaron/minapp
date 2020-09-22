// miniprogram/pages/home/home.js
const MAX_LIMIT = 9

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3669462915,2276960289&fm=26&gp=0.jpg'
      },
      {
        url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600358438063&di=8ddf2337c756754c2c258002bfe84c01&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F585057cef3127c2098950dd567c6f33d9726b2f4142a3-2mtZpN_fw658'
      },
      {
        url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2080365821,905282483&fm=26&gp=0.jpg'
      }
    ],
    playList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankList()
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
    this.setData({
      playList: []
    })
    this.getRankList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getRankList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})