// components/search/search.js
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type:String,
      value: '请输入关键字'
    }
  },
  externalClasses: ['iconfont','icon-sousuo'], // 允许外部传入样式

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e) {
      keyword = e.detail.value
    },
    onSearch() {
      this.triggerEvent('search',{
        keyword
      })
    }
  }
})
