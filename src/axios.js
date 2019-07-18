import axios from 'axios'
import router from '@/router/index'
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '' : 'http://www.kuwo.cn'

// 添加请求拦截器
// axios.interceptors.request.use((config)=>{
//     // 在发送请求之前做些什么
//   const token = localStorage.token
//   token ? config.headers.common['Authorization'] = 'Bearer ' + token
//   :null;
//     return config;
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//     });
  
    // 添加响应拦截器
// axios.interceptors.response.use((res)=>{
//     // 对响应数据做点什么
//   if(res.data.res_code==401)router.push({path:'/login'})
//     return res;
//   }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   });

export default axios