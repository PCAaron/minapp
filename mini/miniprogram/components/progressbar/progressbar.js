// components/progressbar/progressbar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 //当前秒数
let duration = 0 // 当前歌曲总时长
let isMoving = false // 表示当前进度条是否拖拽，解决进度条拖动和updateTime冲突
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
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
  // 定义组件生命周期
  lifetimes:{
    ready(){
      if(this.properties.isSame && this.data.showTime.totalTime == '00:00'){
        this.setTime()
      }
      this.getMovableDis()
      this.bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 绑定进度条事件
    onChange(e){
      // console.log(e)
      if(e.detail.source == 'touch'){
        this.data.progress = e.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = e.detail.x
        isMoving = true
      }
    },
    onTouchEnd(){
      const currentTimeFmt = this.formatTime(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      isMoving = false
      backgroundAudioManager.seek(duration*this.data.progress/100)
    },
    // 获取movable宽度
    getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    // 绑定唯一播放器事件:播放生命周期
    bindBGMEvent() {
      backgroundAudioManager.onPlay(()=>{
        isMoving = false // 解决touchEnd事件时再次触发onChange
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onStop(()=>{
        
      })
      backgroundAudioManager.onPause(()=>{
        this.triggerEvent('musicPause')
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
        if(!isMoving){
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const currentTimeFmt = this.formatTime(currentTime)
          const sec = currentTime.toString().split('.')[0]
          // 优化，1s设置一次setData
          if(sec != currentSec){
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration, //播放长度
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentSec = sec
            // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            })
          }
        }
      })
      backgroundAudioManager.onEnded(()=>{
        this.triggerEvent('musicEnd') // 向父组件抛出事件
      })
      backgroundAudioManager.onError((res)=>{
        wx.showToast({
          title: '错误:'+res.errCode
        })
      })
    },
    setTime(){
      duration = backgroundAudioManager.duration
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
