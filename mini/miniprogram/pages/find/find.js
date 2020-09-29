// miniprogram/pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false //控制底部弹出层是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 发布功能
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success:(res) => {
        // 授权列表
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res) => {
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender	// 性别：0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              this.onloginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },
  onloginSuccess(e) {
    const detail = e.detail
    wx.navigateTo({
      url: `../blog/blog?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
    })
  },
  onloginFail() {
    wx.showModal({
      title: '授权用户才能发布动态'
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