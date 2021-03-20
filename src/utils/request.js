// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间 1hour

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
const IsCheckTimeOut = () => {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

// 创建一个axios的实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 响应时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // 设置 token
  const token = store.getters.token
  if (token) {
    //! 主动处理 token 过期
    // 只有在有 token的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为 true表示过期了 token没用了
      // 退出
      store.dispatch('user/logout')
      // 跳转
      router.push('/login')
      // 返回
      return Promise.reject(new Error('token超时了'))
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 业务错了 提示 + 返回一个 promise.reject()
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  //! 被动处理 token 过期
  // error 信息 里面 response的对象  当等于10002的时候 表示 后端告诉我token超时了
  if (error && error.response && error.response.data.code === 10002) {
    // 登出action 删除token
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error)
})

// 导出axios实例
export default service
