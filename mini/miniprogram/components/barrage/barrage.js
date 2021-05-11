// components/barrage/barrage.js
//index.js
var that = undefined;
var doommList = [];
var i = 0;
var ids=0;
var cycle=null  //计时器
var listTimer = null 
var ending = false // 标识不再请求

// 弹幕参数
class Doomm {
  constructor(text, top, time, color, _id) {  //内容，顶部距离，运行时间，颜色（参数可自定义增加）
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    this.id = i++;
    this._id = _id
  }
}
// 弹幕字体颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

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
    doommData: [],
    arr: []
  },

  pageLifetimes: {
    async show() {
      await this.loadBlogList()
      this.loadCycle()
      listTimer = setInterval(async () => {
        !ending && await this.loadBlogList(this.data.arr.length)
        if (ending) {
          clearInterval(listTimer)
        }
      }, 10000)
    },
    hide() {
      clearInterval(cycle)
      ids = 0;
      doommList = []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadCycle() {
      that = this;
      cycle= setInterval(function () {
        let arr=that.data.arr
          if(arr[ids]==undefined){
            ids = 0
            // 1.循环一次，清除计时器
            // doommList = []
            // clearInterval(cycle)

            // 2.无限循环弹幕
            doommList.push(new Doomm(arr[ids].all, Math.ceil(Math.random() * 100), 12, getRandomColor(), arr[ids]._id));
            if(doommList.length>5){   //删除运行过后的dom
                doommList.splice(0, 1)
            }
            that.setData({
              doommData: doommList
            })
            ids++
          }else{
            doommList.push(new Doomm(arr[ids].all, Math.ceil(Math.random() * 100), 12, getRandomColor(), arr[ids]._id));
            if(doommList.length>5){  
                doommList.splice(0, 1)
            }
            that.setData({
              doommData: doommList
            })     
            ids++
          }
      }, 3000)
    },
    async loadBlogList(start = 0) {
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url:'list',
          start: start,
          keyword: '',
          count: 10
        }
      }).then(res=>{
        if (res.result < 10) {
          ending = true
        }
        const resString = res.result.map(i => {
          return {
            all: `${i.nickName}：${i.content}`,
            _id: i._id
          }
        })
        this.setData({
          arr: this.data.arr.concat(resString)
        })
      })
    },
    goComment(e) {
      wx.navigateTo({
        url:'../../pages/comment/comment?blogId=' + e.target.dataset.blogid
      })
    },
  }
})
