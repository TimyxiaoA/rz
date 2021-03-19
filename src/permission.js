import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置白名单
const whiteList = ['/login', '404']

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 有 token
  if (store.getters.token) {
    // 如果去登录页 ,跳到主页
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.name) {
        // 如果没有 username 表示当前用户资料没有获取过
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      next()
    }
  } else {
    // 无 token
    if (whiteList.includes(to.path)) {
      // 在白名单里面 放行
      next()
    } else {
      // 不在白名单里面, 跳到登录页
      next('/login')
    }
  }
  // 为了解决切换地址时进度条不关闭的问题
  // 同一个地址间的跳转,并不会触发 beforeEach 和 afterEach
  NProgress.done()
})

// 路由后置守卫
router.afterEach(() => {
  NProgress.done()
})
