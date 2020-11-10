// miniprogram/pages/life/life.js
import formatTime from '../../utils/formatTime.js'
const DEFAULT_PAGE = 0;
const EACH_COUNT = 10
Page({
  startPageX: 0,
  currentView: DEFAULT_PAGE,
  data: {
    toView: `card_${DEFAULT_PAGE}`,
    list: []
  },

  onLoad () {
    this.loadList()
  },
  
  loadList(start = 0) {
    wx.cloud.callFunction({
      name: 'life',
      data: {
        $url: 'list',
        start,
        count: EACH_COUNT
      }
    }).then(res => {
      let data = res.result
      data.forEach( t => {
        t.times = formatTime(new Date(t.times), 'yyyy-MM-dd')
      })
      this.setData({
        list: this.data.list.concat(data)
      })
    })
  },

  touchStart(e) {
    console.log(e)
    this.startPageX = e.changedTouches[0].pageX;
  },

  touchEnd(e) {
    const moveX = e.changedTouches[0].pageX - this.startPageX;
    const maxPage = this.data.list.length - 1;
    if (Math.abs(moveX) >= 150){
      if (moveX > 0) {
        this.currentView = this.currentView !== 0 ? this.currentView - 1 : 0;
      } else {
        this.currentView = this.currentView !== maxPage ? this.currentView + 1 : maxPage;
      }
    }
    this.setData({
      toView: `card_${this.currentView}`
    });
    if (this.currentView > maxPage -1) {
      this.loadList(this.data.list.length)
    }
  }
})