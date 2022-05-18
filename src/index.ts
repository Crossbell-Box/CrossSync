import { createApp } from 'vue';
import Index from './Index.vue';

import IndexPage from './pages/Index.vue';
import MintPage from './pages/Mint.vue';
import ProfilePage from './pages/Profile.vue';
import HomePage from './pages/Home.vue';
import NotePage from './pages/Note.vue';

import { createRouter, createWebHashHistory } from 'vue-router';

import 'element-plus/dist/index.css';
import './index.css';

const app = createApp(Index);

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: IndexPage,
        },
        {
            path: '/mint',
            component: MintPage,
        },
        {
            path: '/profile',
            component: ProfilePage,
        },
        {
            path: '/home',
            component: HomePage,
        },
        {
            path: '/note/:id',
            component: NotePage,
        },
    ],
});

app.use(router);
app.mount('#app');
