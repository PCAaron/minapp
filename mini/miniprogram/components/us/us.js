// components/us/us.js
const db = wx.cloud.database() // 初始化数据库

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
    begin: '2016/08/22 00:00:00',
    together: null,
    users: []
  },
  pageLifetimes: {
    async show() {
      this.formatTimes()
      db.collection('manager').get().then(res=>{
        console.log('res.data-----', res.data)
        this.setData({
          users: res.data
        })
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
        together: days // days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒",
      })
    },
  }
})
