import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 后台除了登陆接口外，都需要token权限验证，故添加请求拦截器
axios.interceptors.request.use(config => {
  // 为请求头对象添加 token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
// 全局注册组件
Vue.component('tree-table', TreeTable)
// 将时间转化成某格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  // 填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // 模板字符串
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
