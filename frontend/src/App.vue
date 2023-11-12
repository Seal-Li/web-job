<!-- App.vue -->

<template>
  <div class="App">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import { ref } from 'vue';

export default {
  components: { 
    Login,
    Register
  },
  setup() {
    // 判断是否显示登录页面
    const isRegisterPage = ref(false);

    // 监听路由变化，根据路由判断是否显示登录页面
    const onRouteChange = () => {
      isRegisterPage.value = window.location.pathname === '/register';
    };

    // 在页面加载时和路由变化时执行监听函数
    window.addEventListener('load', onRouteChange);
    window.addEventListener('popstate', onRouteChange);

    return {
      isRegisterPage,
    };
    }

};
</script>

<style scoped>
.App {
  background-image: url('./assets/bgpic.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh; /* 保证背景图片充满整个视口 */
  margin: 0; /* 去除 body 默认的 margin */
}
</style>
