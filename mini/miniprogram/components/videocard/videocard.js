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

  observers: {
    ['video.play_count'](count) {
      console.log('count', count)
      this.setData({
        _count: this._formatNumber(count, 2)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toVideo(e) {
      wx.navigateTo({
        url: `../../pages/videodetail/videodetail?id=${this.properties.video.v_id}&count=${this.properties.video.play_count}&publish=${this.properties.video.publish_date}`
      })
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
    }
  }
})
