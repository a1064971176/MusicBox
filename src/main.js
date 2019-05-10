import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index.js'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import '@/assets/css/index.scss'
Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('./assets/image/default.png')
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
