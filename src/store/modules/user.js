import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // 从本地获取 token
  userInfo: {} // 用户信息
}

const mutations = {
  // 储存本地 token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除本地 token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 用户登录
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    // 写入时间戳  将当前的最新时间写入缓存
    setTimeStamp()
  },
  // 获取用户信息
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // 合并用户信息
    const baseRes = { ...res, ...baseInfo }
    context.commit('setUserInfo', baseRes)
    //! 后续添加动态路由时使用
    return res
  },
  // 用户退出
  logout(context) {
    context.commit('removeToken') // 删除 token
    context.commit('reomveUserInfo') // 删除用户资料
    resetRouter() // 重置路由
    // 重置 vuex中的 routes
    //! 都有命名空间的子模块如何互相调用 actions 和 mutations  设置第三个参数为 { root: true }
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
