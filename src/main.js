import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import './styles/index.css'
import { setupPermissionDirective } from './utils/permission'

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 按顺序使用插件
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 设置权限指令
setupPermissionDirective(app)

// 最后挂载应用
app.mount('#app')
