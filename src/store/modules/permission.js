// vuex的权限模块
import { constantRoutes, asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}

const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...newRoutes]
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []
    //   筛选出 动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // asyncRoutes 找 有没有对象中的 meta.name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(item => item.meta.name === key))
    })
    // 得到的 routes 是所有模块中满足权限要求的路由数组 // routes就是当前用户所拥有的 动态路由的权限
    // 将动态路由提交给 mutations
    context.commit('setRoutes', [...routes, { path: '*', redirect: '/404', hidden: true }]) // 404 page must be placed at the end !!!
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
