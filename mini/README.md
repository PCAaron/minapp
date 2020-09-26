# 小小熊の音乐

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 云函数优化：tcb-router

- 一个用户在一个云环境中只能创建50个云函数      
- 相识的请求归类到同一个云函数处理      
- tcb-router是一个koa风格的云函数路由库     
  用法详见：cloudfunctions/music/index.js       

## 酷狗音乐接口

- 音乐详情：https://www.kugou.com/yy/index.php?r=play/getdata&hash=xxx      
  浏览器访问接口能正常获取，但是通过http请求则返回{“status”:0,“err_code”:20010,“data”:[]}       
  需要在请求头中携带cookie值kg_mid，kg_mid可为任何值      
  用法详见：cloudfunctions/music/index.js   

## 小程序中引入字体图标

- iconfont:https://www.iconfont.cn/     
  选中图标->加入项目->Font class：生成代码->在浏览器中打开代码目录并下载至小程序目录内
  -> 全局引入：app.wxss中引入文件 -> text标签中使用     

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

