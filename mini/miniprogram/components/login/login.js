// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(e){
      const userinfo = e.detail.userInfo
      console.log(e)
      if(userinfo){
        this.setData({
          modalShow: false
        })
        this.triggerEvent('loginSuccess', userinfo)
      } else {
        this.triggerEvent('loginFail')
      }
    }
  }
})
