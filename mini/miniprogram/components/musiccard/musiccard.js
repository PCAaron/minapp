// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cover: Object
  },

  // 监听器
  observers: {
  },

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
    musicList() {
      wx.navigateTo({
        url: `../../pages/player/player?id=${this.properties.cover.key}`
      })
    }
  }
})
