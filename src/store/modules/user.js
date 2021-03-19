import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
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
    state.userInfo = { ...userInfo }
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
  },
  // 获取用户信息
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // 合并用户信息
    const baseRes = { ...res, ...baseInfo }
    context.commit('setUserInfo', baseRes)
    // TODO
    return baseRes
  },
  // 用户退出
  logout(context) {
    context.commit('removeToken')
    context.commit('reomveUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
