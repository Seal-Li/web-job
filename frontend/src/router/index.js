import {
    createRouter,
    createWebHistory
} from 'vue-router';

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgetPassword from '../views/ForgetPassword.vue';
import Home from '../views/Home.vue'; 


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
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router };