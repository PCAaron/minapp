// miniprogram/pages/blessing/blessing.js
let lastFrameTime = 0;
let count = 0;
let ctx = null;
let factor = {
  speed: .008, // 运动速度，值越小越慢
  t: 0 //  贝塞尔函数系数
};
let that;

let timer = null; // 循环定时器
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    total: 0,
    userList: [],
    allUser: [],
    modalShow: false, //控制底部弹出层是否显示
    begin: '2016/08/22 00:00:00',
    together: null,
    style_img: '',
    img_path: [
      [{
        x: 30,
        y: 400
      }, {
        x: 70,
        y: 300
      }, {
        x: -50,
        y: 150
      }, {
        x: 30,
        y: 0
      }],
      [{
        x: 30,
        y: 400
      }, {
        x: 30,
        y: 300
      }, {
        x: 80,
        y: 150
      }, {
        x: 30,
        y: 0
      }],
      [{
        x: 30,
        y: 400
      }, {
        x: 0,
        y: 90
      }, {
        x: 80,
        y: 100
      }, {
        x: 30,
        y: 0
      }]
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    setInterval(() => {
      this.formatTimes()
    },1000)
    //获取canvas实例
    ctx = wx.createCanvasContext('mycanvas')
    this.loadList()
  },
  async loadList() {
    // console.log(await db.collection('blessing').count())
    wx.cloud.callFunction({
      name: 'blessing',
      data: {
        $url:'list'
      }
    }).then(res=>{
      // 前端过滤重复用户
      console.log(res.result)
      const { total,userList } = res.result
      const idxs = this.unique(userList)
      let _users = []
      for (let i=0;i<idxs.length;i++) {
        _users.push(userList[idxs[i]])
      }
      this.setData({
        total,
        allUser: userList,
        userList: _users
      })
    })
  },
  unique(arr) {
    let _ids = arr.map(user => user._openid)
    let _arr = []
    let num = []
    for (let i=0;i<_ids.length;i++) {
      if(!_arr.includes(_ids[i])){
        _arr.push(_ids[i])
        num.push(i)
      }
    }
    return num
  },
  formatTimes() {
    const date1= this.data.begin;  //开始时间
    const date2 = new Date();    //结束时间
    const date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数    
    //计算出相差天数
    const days=Math.floor(date3/(24*3600*1000))
 
    //计算出小时数
    const leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    const hours=Math.floor(leave1/(3600*1000))
    //计算相差分钟数
    const leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    const minutes=Math.floor(leave2/(60*1000))
    //计算相差秒数
    const leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    const seconds=Math.round(leave3/1000)
    this.setData({
      together: days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒",
    })
  },
  // 点赞动画
  requestAnimationFrame(callback) {
    var currTime = new Date().getTime();
    //手机屏幕刷新率一般为60Hz，大概16ms刷新一次，这里为了使页面看上去更流畅自然,通过改变timedis的值可以控制动画的快慢
    var timedis = 16 - (currTime - lastFrameTime)
    var timeToCall = Math.max(0, timedis);
    var id = setTimeout(callback, timeToCall);
    lastFrameTime = currTime + timeToCall;
    return id;
  },
  drawImage: function (data,repeatcount) {
    if (repeatcount == 0){
      return
    }
    var p10 = data[0][0]; // 三阶贝塞尔曲线起点坐标值
    var p11 = data[0][1]; // 三阶贝塞尔曲线第一个控制点坐标值
    var p12 = data[0][2]; // 三阶贝塞尔曲线第二个控制点坐标值
    var p13 = data[0][3]; // 三阶贝塞尔曲线终点坐标值

    var p20 = data[1][0];
    var p21 = data[1][1];
    var p22 = data[1][2];
    var p23 = data[1][3];

    var p30 = data[2][0];
    var p31 = data[2][1];
    var p32 = data[2][2];
    var p33 = data[2][3];

    var t = factor.t;

    /*计算多项式系数*/
    var cx1 = 3 * (p11.x - p10.x);
    var bx1 = 3 * (p12.x - p11.x) - cx1;
    var ax1 = p13.x - p10.x - cx1 - bx1;

    var cy1 = 3 * (p11.y - p10.y);
    var by1 = 3 * (p12.y - p11.y) - cy1;
    var ay1 = p13.y - p10.y - cy1 - by1;

    /*计算xt yt坐标值 */
    var xt1 = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p10.x;
    var yt1 = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p10.y;

    /** 计算多项式系数*/
    var cx2 = 3 * (p21.x - p20.x);
    var bx2 = 3 * (p22.x - p21.x) - cx2;
    var ax2 = p23.x - p20.x - cx2 - bx2;

    var cy2 = 3 * (p21.y - p20.y);
    var by2 = 3 * (p22.y - p21.y) - cy2;
    var ay2 = p23.y - p20.y - cy2 - by2;

    /*计算xt yt坐标值*/
    var xt2 = ax2 * (t * t * t) + bx2 * (t * t) + cx2 * t + p20.x;
    var yt2 = ay2 * (t * t * t) + by2 * (t * t) + cy2 * t + p20.y;


    /** 计算多项式系数*/
    var cx3 = 3 * (p31.x - p30.x);
    var bx3 = 3 * (p32.x - p31.x) - cx3;
    var ax3 = p33.x - p30.x - cx3 - bx3;

    var cy3 = 3 * (p31.y - p30.y);
    var by3 = 3 * (p32.y - p31.y) - cy3;
    var ay3 = p33.y - p30.y - cy3 - by3;

    /*计算xt yt坐标值*/
    var xt3 = ax3 * (t * t * t) + bx3 * (t * t) + cx3 * t + p30.x;
    var yt3 = ay3 * (t * t * t) + by3 * (t * t) + cy3 * t + p30.y;
    factor.t += factor.speed;
    ctx.drawImage("../../images/tran-heart.png", xt1, yt1, 30, 30);
    ctx.drawImage("../../images/big-heart.png", xt2, yt2, 30, 30);
    ctx.drawImage("../../images/yellow-heart.png", xt3, yt3, 30, 30);
    ctx.draw();
    if (factor.t > 1) {
      factor.t = 0;
      clearTimeout(timer)
      if(repeatcount <= -1){
        that.startTimer(repeatcount)
      }else{
        if (count < repeatcount){
          that.startTimer(repeatcount)
          count++
        }else {
          that.draworiginal()
          count = 0;
        }
      }
    } else {
      timer = that.requestAnimationFrame(function () {
        that.drawImage(that.data.img_path, repeatcount)
      })
    }
  },
  onClickImage: function (e) {
    // 判断用户是否授权
    wx.getSetting({
      success:(res) => {
        // 授权列表
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res) => {
              this.setData({
                userInfo: res.userInfo
              })
              db.collection('blessing').add({ // 小程序插入数据库自带openid
                data: {
                  ...res.userInfo,
                  createTime: db.serverDate()
                }
              }).then(res=>{
                this.loadList()
                this.imageAnimate()
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },
  onloginSuccess(e) {
    const detail = e.detail
    this.onClickImage()
  },
  onloginFail() {
    wx.showModal({
      title: '请留下你的足迹'
    })
  },
  imageAnimate() {
    //点击心形的时候动画效果
    that.setData({
      style_img: 'transform:scale(1.3);'
    })
    setTimeout(function () {
      that.setData({
        style_img: 'transform:scale(1);'
      })
    }, 500)
    factor.t = 2
    count = 0
    that.startTimer(1)
  },
  //repeatcount -1就是循环，其他大于零的整数就是动画循环次数
  startTimer: function (repeatcount) {
    that.drawImage(that.data.img_path, repeatcount)
  },
  draworiginal(){
    ctx.drawImage("../../images/tran-heart.png", 30, 400, 30, 30);
    ctx.drawImage("../../images/big-heart.png", 30, 400, 30, 30);
    ctx.drawImage("../../images/yellow-heart.png", 30, 400, 30, 30);
    ctx.draw();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})