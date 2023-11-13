// main.ts

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router'; // 确保正确引入了路由
import axios from 'axios';
// 全局引入
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
app.config.globalProperties.$axios = axios;
// 使用ElementPlus插件
app.use(ElementPlus);

// 使用路由
app.use(router);

// 注册 Element Plus 的图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
