import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router/index'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import { createPinia } from 'pinia'
const pinia = createPinia();

// 引入全局样式
import '@/styles/index.scss'

import './permission'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component as any)
}
app.use(router)
.use(ElementPlus, { locale: zhCn })
.use(pinia)
.mount('#app')
