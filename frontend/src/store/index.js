import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

// 使用 pinia-plugin-persistedstate 插件
pinia.use(piniaPluginPersistedstate, { key: 'userStore' });

export { pinia };