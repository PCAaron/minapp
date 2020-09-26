// components/progressbar/progressbar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },
  lifetimes:{
    ready(){
      this.getMovableDis()
      this.bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取movable宽度
    getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[0].width
      })
    },
    // 绑定唯一播放器事件
    bindBGMEvent() {
      backgroundAudioManager.onPlay(()=>{

      })
      backgroundAudioManager.onStop(()=>{
        
      })
      backgroundAudioManager.onPause(()=>{
        
      })
      backgroundAudioManager.onWaiting(()=>{
        
      })
      backgroundAudioManager.onCanplay(()=>{
        if(typeof backgroundAudioManager.duration !== 'undefined'){
          this.setTime()
        } else {
          setTimeout(() => {
            this.setTime()
          },1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(()=>{
        
      })
      backgroundAudioManager.onEnded(()=>{
        
      })
      backgroundAudioManager.onError((res)=>{
        wx.showToast({
          title: '错误:'+res.errCode
        })
      })
    },
    setTime(){
      const duration = backgroundAudioManager.duration
      const durationFmt = this.formatTime(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    // 格式化时间
    formatTime(sec) {
      const min = Math.floor(sec/60)
      sec = Math.floor(sec % 60)
      return {
        'min':this.parse0(min),
        'sec':this.parse0(sec)
      }
    },
    parse0(sec) {
      return sec < 10 ? '0'+sec : sec
    }
  }
})
