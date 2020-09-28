// components/lyric/lyric.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },

  observers: {
    lyric(src){
      this.parseLyric(src)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 解析歌词
    parseLyric(sLyric) {
      let line =  sLyric.split('\n')
      console.log(line)
      let lrcList = []
      line.forEach(el => {
        let time = el.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        console.log(time)
        if(time != null){
          let lrc = el.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let time2Seconds = parseInt(timeReg[1])*60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          lrcList.push({
            time: time2Seconds,
            lrc
          })
        }
      })
      this.setData({
        lrcList
      })
    }
  }
})
