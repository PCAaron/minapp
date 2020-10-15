// components/blogcoment/blogcoment.js
let userInfo = ''
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },
  externalClasses: ['iconfont','icon-pinglun','icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    onloginSuccess(e) {
      userInfo = e.detail
      this.setData({
        loginShow: false,
      },() => {
        this.setData({
          modalShow: true
        })
      })
    },
    onloginFail() {
      wx.showModal({
        content:'授权用户才能进行评论'
      })
    },
    onSend(e) {
      // 插入数据库
      let content = e.detail.value.content
      let formId = e.detail.formId
      if(content.trim() == ''){
        wx.showModal({
          content: '评论内容不能为空'
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId:this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then(res=>{

        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            content,
            formId,
            blogId: this.properties.blogId
          }
        }).then(res=> {
          console.log(res)
        })

        wx.hideLoading()
        wx.showToast({
          title:'评论成功'
        })
        this.setData({
          modalShow: false,
          content: ''
        })

        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })

      // 推送模板消息
    }
  }
})
