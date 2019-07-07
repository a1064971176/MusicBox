module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
    devServer: {
      proxy:{
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