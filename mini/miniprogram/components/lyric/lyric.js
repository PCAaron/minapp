// components/lyric/lyric.js
let lyrciHeight = 0
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
      if(!src){
        this.setData({
          lrcList: [
            {
              time: 0,
              lrc: '暂无歌词'
            }
          ],
          nowLyricIndex: -1
        })
        return
      }
      this.parseLyric(src)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, //当前选中歌词的索引
    scrollTop: 0 //滚动高度
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: function(res) {
          // 求出1rpx的大小
          lyrciHeight = res.screenWidth / 750 * 64
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime) {
      console.log(currentTime)
      let lrcList = this.data.lrcList
      if(lrcList.length){
        if(currentTime > lrcList[lrcList.length-1].time){ // 兼容当前歌词长过计算时间
          if(this.data.nowLyricIndex != -1){
            this.setData({
              nowLyricIndex: -1,
              scrollTop: lrcList.length * lyrciHeight
            })
          }
        }
        for(let i=0,len = lrcList.length;i<len;i++){
          if(currentTime <= lrcList[i].time){
            this.setData({
              nowLyricIndex: i-1,
              scrollTop: (i-1) * lyrciHeight
            })
            break
          }
        }
      }
    },
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
