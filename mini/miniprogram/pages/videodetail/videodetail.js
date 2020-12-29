// miniprogram/pages/videodetail/videodetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    count: 0,
    publish: null,
    word: null,
    detail: null,
    list: []
  },

  _formatNumber(num, point){
    let numStr = num.toString().split('.')[0]
    if (numStr.length < 6) {
      return numStr
    } else if (numStr.length >= 6 && numStr.length <= 8) {
      let decimal = numStr.substring(numStr.length-4, numStr.length-4 + point)
      return parseFloat(parseInt(num/10000) + '.' + decimal) + '万'
    } else if(numStr.length > 8) {
      let decimal = numStr.substring(numStr.length-8, numStr.length-8 + point)
      return parseFloat(parseInt(num/100000000) + '.' + decimal) + '亿'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      count: this._formatNumber(options.count, 2),
      publish: options.publish,
      word: options.word
    })
    wx.getBackgroundAudioManager().stop() // 播放视频前停止音乐
    this.loadMVDetail()
    this.loadMVList()
  },

  loadMVDetail(id) {
    wx.showLoading({
      title: '加载中...'
    })
    wx.cloud.callFunction({
      name: 'video',
      data: {
        $url: 'mvdetail',
        id: id || this.data.id
      }
    }).then(res => {
      this.setData({
        detail: res.result
      })
      wx.setNavigationBarTitle({
        title: this.data.detail.mvinfo.name
      })
      wx.hideLoading()
    })
  },

  loadMVList() {
    wx.cloud.callFunction({
      name: 'video',
      data: {
        $url: 'hotmv',
        word: this.data.word
      }
    }).then(res => {
      if (res.result && res.result.code === 0) { // 存在接口返回数据类型错误，错误则跳过
        this.setData({
          list: res.result.data.mv && res.result.data.mv.list
        })
      }
    })
  },

  videoError(e) {
    console.log(e.detail.errMsg)
    wx.showModal({
      title: '小熊提示',
      content: e.detail.errMsg,
    })
  },

  loadNewMV(e) {
    console.log(e)
    const { count, id, publish, word } = e.detail.currentTarget.dataset
    this.setData({
      id,
      count: this._formatNumber(count, 2),
      publish,
      word
    })
    this.loadMVDetail(id)
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