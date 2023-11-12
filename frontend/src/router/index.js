import {
    createRouter,
    createWebHistory
} from 'vue-router';

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgetPassword from '../views/ForgetPassword.vue';


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
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export { router };