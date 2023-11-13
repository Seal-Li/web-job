import {
    createRouter,
    createWebHistory
} from 'vue-router';

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



const routes = [
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
        path: '/forget-password', // 添加忘记密码页面的路由
        name: 'ForgetPassword',
        component: ForgetPassword,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/recommend',
        name: 'recommend',
        component: Recommend,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/hot',
        name: 'hot',
        component: Hot,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/beerCategory',
        name: 'beerCategory',
        component: BeerCategory,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/beerKnowledge',
        name: 'beerKnowledge',
        component: BeerKnowledge,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/forum',
        name: 'forum',
        component: Forum,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/userCenter',
        name: 'userCenter',
        component: UserCenter,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/myOrders',
        name: 'myOrders',
        component: MyOrders,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/myFavorites',
        name: 'myFavorites',
        component: MyFavorites,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
      {
        path: '/myAddresses',
        name: 'myAddresses',
        component: MyAddresses,
        meta: { requiresAuth: true } // 如果首页需要登录才能访问，添加这个meta
      },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router };