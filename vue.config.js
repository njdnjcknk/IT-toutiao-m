 //vue-cli的配置文件
 // 配置参考https://cli.vuejs.org/zh/config/ 
 module.exports = {
     // ...其他配置
     lintOnSave: false,
     //开发环境下推荐使用/ 生产环境下如果想用file协议可以打开那就用./
     // publicPath:'./'   //部署应用包时的基本url. 默认是/
     publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
     //关闭map文件
     productionSourceMap: false
 }