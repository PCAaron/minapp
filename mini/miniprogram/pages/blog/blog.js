// miniprogram/pages/blog/blog.js
const MAX_WORD_NUM = 140 //文字最大长度
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0, //输入文字个数
    footerBottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  },

  onInput(e) {
    let wordNum = e.detail.value.length
    if(wordNum >= MAX_WORD_NUM) {
      wordNum = `最大字数为${MAX_WORD_NUM}`
    } else {
      this.setData({
        wordNum
      })
    }
  },
  onFocus(e) {
    this.setData({
      footerBottom: e.detail.height // 虚拟键盘
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
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