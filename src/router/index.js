import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/Users.vue'
const Users = () => import(/* webpackChunkName:"user" */ '../components/Users.vue')
// import Rights from '../components/Rights.vue'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/Rights.vue')
// import Roles from '../components/Roles.vue'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/Roles.vue')
// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import List from '../components/goods/List.vue'
const List = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')
// import Order from '../components/Order.vue'
const Order = () => import(/* webpackChunkName:"order" */ '../components/Order.vue')
// import Report from '../components/Report.vue'
const Report = () => import(/* webpackChunkName:"report" */ '../components/Report.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 看看有没有token
  const token = window.sessionStorage.getItem('token')
  // 没有的话就去登陆
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
