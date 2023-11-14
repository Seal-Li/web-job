import { createRouter, createWebHistory } from 'vue-router';

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgetPassword from '../views/ForgetPassword.vue';
import Home from '../views/Home.vue'; 
import Recommend from '../views/Recommend.vue';
import Hot from '../views/Hot.vue';
import BeerCategory from '../views/BeerCategory.vue';
import BeerKnowledge from '../views/BeerKnowledge.vue';
import Forum from '../views/Forum.vue';
import UserCenter from '../views/UserCenter.vue';
import MyOrders from '../views/MyOrders.vue';
import MyFavorites from '../views/MyFavorites.vue';
import MyAddresses from '../views/MyAddresses.vue';

import { useAuthStore } from '@/store/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/forget-password',
      name: 'ForgetPassword',
      component: ForgetPassword,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      meta: { requiresAuth: true }
    },
    {
      path: '/hot',
      name: 'hot',
      component: Hot,
      meta: { requiresAuth: true }
    },
    {
      path: '/beerCategory',
      name: 'beerCategory',
      component: BeerCategory,
      meta: { requiresAuth: true }
    },
    {
      path: '/beerKnowledge',
      name: 'beerKnowledge',
      component: BeerKnowledge,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum',
      name: 'forum',
      component: Forum,
      meta: { requiresAuth: true }
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: UserCenter,
      meta: { requiresAuth: true }
    },
    {
      path: '/myOrders',
      name: 'myOrders',
      component: MyOrders,
      meta: { requiresAuth: true }
    },
    {
      path: '/myFavorites',
      name: 'myFavorites',
      component: MyFavorites,
      meta: { requiresAuth: true }
    },
    {
      path: '/myAddresses',
      name: 'myAddresses',
      component: MyAddresses,
      meta: { requiresAuth: true }
    },
  ],
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // 直接在导航守卫中使用

  // 检查是否需要身份验证
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 如果需要身份验证且用户未登录，则重定向到登录页面
    next('/');
  } else {
    // 否则，继续导航
    next();
  }
});

export { router };
