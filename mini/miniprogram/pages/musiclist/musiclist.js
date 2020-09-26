// miniprogram/pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    info: {
      bannerurl: '',
      rankname: '',
      rankid: '',
      id: '',
      issue: ''
    },
    musiclist: null,
    total: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        rankid:options.rankid,
        page:this.data.page,
        $url: 'musiclist'
      }
    }).then(res => {
      this.setData({
        info: {
          bannerurl: (res.result.info.bannerurl).replace('{size}', '400'),
          rankname: res.result.info.rankname,
          rankid: res.result.info.rankid,
          id: res.result.info.id,
          issue: res.result.info.issue
        },
        musiclist: res.result.songs.list,
        total: res.result.songs.total
      })
      this.setMusiclist()
    })
  },

  setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
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