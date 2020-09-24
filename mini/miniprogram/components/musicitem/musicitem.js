// components/musicitem/musicitem.js
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

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e){
      const musicid = e.currentTarget.dataset.musicid
      this.setData({
        playingid: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicid}`,
      })
    }
  }
})
