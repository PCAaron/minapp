// miniprogram/pages/blog/blog.js
const MAX_WORD_NUM = 140 //文字最大长度
const MAX_IMG_NUM = 9
const db = wx.cloud.database()
let content = ''
let userInfo = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0, //输入文字个数
    footerBottom: 0,
    images: [],
    selectPhoto: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
  },

  onInput(e) {
    let wordNum = e.detail.value.length
    if(wordNum >= MAX_WORD_NUM) {
      wordNum = `最大字数为${MAX_WORD_NUM}`
    } 
    this.setData({
      wordNum
    })
    content = e.detail.value
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
  onChooseImg() {
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <=0 ? false : true
        })
      }
    })
  },
  onDeleteImage(e) {
    this.data.images.splice(e.target.dataset.index,1)
    this.setData({
      images: this.data.images
    })
    if(this.data.images.length == MAX_IMG_NUM -1){
      this.setData({
        selectPhoto: true
      })
    }
  },
  onPreviewImg(e){
    wx.previewImage({
      urls: this.data.images,
      current: e.target.dataset.imagesrc
    })
  },
  send() {
    if(content.trim() === ''){
      wx.showModal({
        content: '请输入内容'
      })
      return
    }
    // 数据->云数据库
    // 数据库:内容，图片fileid，openid，昵称，头像，时间
    // 图片-> 云存储 返回fileid
    let promiseArr = []
    let fileIds = []
    wx.showLoading()
    //图片上传
    for(let i=0,len=this.data.images.length;i<len;i++){
      let p = new Promise((resolve,reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random()*1000000 + suffix,
          filePath: item,
          success: (res) => {
            resolve(res.fileID)
            fileIds = fileIds.concat(res.fileID)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
      promiseArr.push(p)
    }
    // 存入到云数据库
    Promise.all(promiseArr).then(res=>{
      db.collection('blog').add({ // 小程序插入数据库自带openid
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate()
        }
      }).then(res=>{
        wx.showToast('发布成功')
        wx.hideLoading()
        wx.navigateBack()
      }).catch(err=>{
        wx.hideLoading()
        wx.showToast('发布失败')
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