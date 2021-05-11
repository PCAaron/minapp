// miniprogram/pages/loveTime/loveTime.js
import formatTime from '../../utils/formatTime.js'
const EACH_COUNT = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList()
  },

  loadList(start = 0) {
    wx.cloud.callFunction({
      name: 'life',
      data: {
        $url: 'list',
        start,
        count: EACH_COUNT
      }
    }).then(res => {
      let data = res.result.map(i => {
        return {
          ...i,
          content: i.title,
          img: [i.img],
          location: {
            name: i.address
          }
        }
      })
      data.forEach( t => {
        t.times = formatTime(new Date(t.times), 'yyyy-MM-dd')
      })
      this.setData({
        list: this.data.list.concat(data)
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
    this.setData({
      list: []
    })
    this.loadList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadList(this.data.list.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})