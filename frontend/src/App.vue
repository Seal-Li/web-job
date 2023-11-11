<!-- App.vue -->

<template>
    <router-view v-if="!isRegisterPage"></router-view>
    <Login v-else></Login>
  <router-view></router-view>
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

<style></style>
