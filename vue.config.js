module.exports = {
    publicPath: process.env.NODE_ENV === 'development' ? '/' : '/demo',
    devServer: {
        proxy: 'http://localhost:3000', // 开发环境的接口地址url
        // proxy: 'http://music.kassing.cn', // 开发环境的接口地址url
      }
  }