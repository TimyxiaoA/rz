import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/lang'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Component from '@/components'

import '@/icons' // icon
import '@/permission' // permission control

// 引入语法  **`import *  as  变量`**  得到的是一个对象**`{ 变量1：对象1，变量2： 对象2 ...   }`**
import * as directives from '@/directives'
import * as filters from '@/filters'
import mixin from '@/mixin'

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(Component) // 注册自己的全局插件

Vue.config.productionTip = false

// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 遍历所有的导出的过滤器对象 完成自定义全局注册
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 全局混入
Vue.mixin(mixin)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
