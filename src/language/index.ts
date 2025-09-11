import Vue from 'vue'
import VueI18n from 'vue-i18n'
import iView from 'view-design'
import enUS from 'view-design/dist/locale/en-US'
import zhCN from 'view-design/dist/locale/zh-CN'

const app_zh = require('./zh-cn.json')
const app_en = require('./en-us.json')
const app_ja = require('./ja-jp.json')

Vue.use(VueI18n)

const messages = {
  en: Object.assign(app_en),
  zh: Object.assign(app_zh),
  ja: Object.assign(app_ja)
}

const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'zh'

const i18n = new VueI18n({
  locale: saved,
  fallbackLocale: 'zh',
  messages,
  silentTranslationWarn: true
})

// Initialize View UI locale (fallback to en for ja)
Vue.use(iView, {
  locale: saved === 'zh' ? zhCN : enUS
})

export function setLang(lang: 'zh' | 'en' | 'ja') {
  i18n.locale = lang
  try { localStorage.setItem('lang', lang) } catch (e) {}
  const ui = lang === 'zh' ? zhCN : enUS
  // runtime switch for view-design
  // @ts-ignore
  if ((iView as any).locale) {
    // @ts-ignore
    iView.locale(ui)
  }
}

export default i18n
