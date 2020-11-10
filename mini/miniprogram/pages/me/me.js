// miniprogram/pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkUser () {
    // 判断用户是否授权
    wx.getSetting({
      success:(res) => {
        // 授权列表
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res) => {
              this.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  qrcode() {
    wx.showLoading({
      title:"生成中"
    })
    wx.cloud.callFunction({
      name: 'qrcode'
    }).then(res=>{
      wx.hideLoading()
      const fileId = res.result
      console.log(res)
      wx.previewImage({
        current: fileId,
        urls: [fileId]
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