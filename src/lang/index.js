import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 引入cookie包
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...customEN
  },
  zh: {
    ...zhLocale,
    ...customZH
  }
}

export default new VueI18n({
  locale: Cookie.get('language') || 'zh', // set locale
  messages // set locale messages
})
