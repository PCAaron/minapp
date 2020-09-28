// components/musicitem/musicitem.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingid: -1
  },

  pageLifetimes: {
    show() {
      this.setData({
        playingid: app.getPlayMusicId()
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e){
      const musicid = e.currentTarget.dataset.musicid
      const idx = e.currentTarget.dataset.index
      this.setData({
        playingid: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicid}&idx=${idx}`,
      })
    }
  }
})
