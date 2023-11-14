// main.ts

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import axios from 'axios';
import { createPinia } from 'pinia'; // 引入 createPinia
import { useUserStore } from './store/auth'; // 引入 useUserStore

// 全局引入
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);

// 创建 Pinia 实例
const pinia = createPinia();

// 使用 Pinia 插件
app.use(pinia);

// 使用 axios
app.config.globalProperties.$axios = axios;

// 在创建 Vue 实例之前，先调用 setupStore 函数来设置 Pinia 实例
app.config.globalProperties.$userStore = useUserStore(pinia);

// 使用 ElementPlus 插件
app.use(ElementPlus);

// 使用路由
app.use(router);

// 注册 Element Plus 的图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 挂载应用
app.mount('#app');

// const userStore = useUserStore();
// userStore.$onInit();