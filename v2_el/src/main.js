import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './theme/index.css'

import '@/assets/styles/bootstrap.scss'

Vue.config.productionTip = false
// 定义全局变量
Vue.mixin({
  data() {
    return {
      dialogTop: '50px',
      dialogWidth: '80%',
      formLabelWidth: '150px'
    };
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
