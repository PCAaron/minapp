// components/blogcard/blogcard.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  externalClasses: ['iconfont','icon-location'],

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImg(e){
      const ds = e.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc
      })
    }
  }
})
