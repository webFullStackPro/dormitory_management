import './assets/main.css'

import { createApp, reactive } from 'vue'
import ElementPlus from 'element-plus'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 定义全局变量
const globalState = reactive({
  dialogTop: '50px',
  dialogWidth: '80%',
  formLabelWidth: '150px'
})

// 提供全局变量
app.provide('globalState', globalState);

app.use(router)

app.use(ElementPlus)

app.use(ElMessage)

app.mount('#app')
