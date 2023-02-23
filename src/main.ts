import { createApp } from 'vue'
import App from './App.vue'
import Admin from './Admin.vue'
import Home from './Home.vue'

import { createRouter, createWebHistory } from 'vue-router'

 
import './assets/main.css'

const routes = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        }
    ]
})

const app = createApp(App);

app.use(routes)

app.mount('#app')