module.exports = {
  publicPath:
    process.env.NODE_ENV === "development"
      ? "/"
      : "https://netease-cloud-music-api-beige-rho.vercel.app",
  devServer: {
    proxy: {
      "/": {
        target: "https://netease-cloud-music-api-beige-rho.vercel.app",
        ws: false,
        changOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
        secure: false, // 如果是https接口，需要配置这个参数为true
        open: true, //配置自动启动浏览器
        pathRewrite: {},
      },
      //   "/url":{
      //     target:'http://www.kuwo.cn',
      //     ws: false,
      //     changOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
      //     secure: false,   // 如果是https接口，需要配置这个参数为true
      //     open: true, //配置自动启动浏览器
      //     pathRewrite:{}
      //   },
      //   "/newh5":{
      //     target:'http://www.kuwo.cn',
      //     ws: false,
      //     changOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
      //     secure: false,   // 如果是https接口，需要配置这个参数为true
      //     open: true, //配置自动启动浏览器
      //     pathRewrite:{}
      // },
      //   "/":{
      //     target:'http://localhost:3000',
      //     ws: false,
      //     changOrigin: true,
      //     pathRequiresRewrite: {}
      // }
    },
  },
  chainWebpack: (config) => {
    config
      .plugin("webpack-bundle-analyzer")
      .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
  },
};
