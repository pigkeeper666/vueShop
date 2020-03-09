import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
// 导入进度条插件
import NProgress from 'nprogress'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://118.178.90.222:8889/api/private/v1/'

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
// 后台除了登陆接口外，都需要token权限验证，故添加请求拦截器
axios.interceptors.request.use(config => {
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  // 为请求头对象添加 token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  // 当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
// 全局注册组件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
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
