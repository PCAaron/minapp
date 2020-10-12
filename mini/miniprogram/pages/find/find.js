// miniprogram/pages/find/find.js
let keyword=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false, //控制底部弹出层是否显示
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBlogList()
  },
  loadBlogList(start = 0) {
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url:'list',
        start: start,
        keyword,
        count: 10
      }
    }).then(res=>{
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.stopPullDownRefresh()
    })
  },

  goComment(e) {
    wx.navigateTo({
      url:'../../pages/comment/comment?blogId=' + e.target.dataset.blogid
    })
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
  onSearch(e) {
    this.setData({
      blogList: []
    })
    keyword = e.detail.keyword
    this.loadBlogList()
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
      blogList: []
    })
    this.loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})