import {
    createRouter,
    createWebHistory
} from 'vue-router'
import type {
    RouteRecordRaw
} from 'vue-router'

import App from "../App.vue"


const routes: Array < RouteRecordRaw > = [{
    path: '/',
    name: 'App',
    component: Home,
}, ]

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes,
})

export default router