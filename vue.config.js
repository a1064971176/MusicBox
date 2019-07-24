module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
    devServer: {
      proxy:{
        "/api":{
            target:'http://www.kuwo.cn',
            ws: false,
            changOrigin: true,
            pathRequiresRewrite: {}
        },
        "/":{
          target:'http://localhost:3000',
          ws: false,
          changOrigin: true,
          pathRequiresRewrite: {}
      }
      }
  },
  chainWebpack:config=>{
    config
    .plugin('webpack-bundle-analyzer')
    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
}
}