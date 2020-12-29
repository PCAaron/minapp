// components/videocard/videocard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    video: Object
  },

  externalClasses: ['iconfont','icon-shipin'],

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toVideo(e) {
      this.triggerEvent('loadNewMV', e)
    }
  }
})
